import { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import trackerApi from '../api/trackerApi';

/**
 * 숲: Care Pulse 실시간 알림 관리 Hook
 * 나무: WebSocket 연결로 실시간 알림 수신 및 상태 관리
 */
export const usePulseAlerts = (userId, caregiverId) => {
    const [alerts, setAlerts] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        totalAlerts: 0,
        unreadAlerts: 0,
        highRiskAlerts: 0
    });

    const clientRef = useRef(null);
    const subscriptionsRef = useRef([]);

    /**
     * 숲: WebSocket 연결 설정
     * 나무: STOMP 클라이언트로 서버 연결 및 토픽 구독
     */
    const connect = useCallback(() => {
        if (clientRef.current?.active) {
            return;
        }

        try {
            setConnectionError(null);
            setIsLoading(true);

            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws-pulse'),
                connectHeaders: {
                    userId: userId,
                    caregiverId: caregiverId
                },
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            client.onConnect = (frame) => {
                console.log('WebSocket connected:', frame);
                setIsConnected(true);
                setIsLoading(false);
                setConnectionError(null);

                // 숲: 전체 알림 토픽 구독
                const generalSub = client.subscribe('/topic/pulse-alerts', (message) => {
                    const alert = JSON.parse(message.body);
                    handleNewAlert(alert);
                });
                subscriptionsRef.current.push(generalSub);

                // 숲: 개인 알림 토픽 구독
                if (caregiverId) {
                    const personalSub = client.subscribe(`/topic/pulse-alerts/${caregiverId}`, (message) => {
                        const alert = JSON.parse(message.body);
                        handleNewAlert(alert);
                    });
                    subscriptionsRef.current.push(personalSub);
                }

                // 숲: 연결 완료 후 기존 알림 로드
                loadExistingAlerts();
            };

            client.onDisconnect = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
                setIsLoading(false);
                cleanupSubscriptions();
            };

            client.onStompError = (frame) => {
                console.error('WebSocket error:', frame);
                setConnectionError('WebSocket 연결 오류가 발생했습니다.');
                setIsConnected(false);
                setIsLoading(false);
            };

            client.onWebSocketError = (error) => {
                console.error('WebSocket connection error:', error);
                setConnectionError('서버와 연결할 수 없습니다.');
                setIsConnected(false);
                setIsLoading(false);
            };

            clientRef.current = client;
            client.activate();

        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            setConnectionError('연결 설정 중 오류가 발생했습니다.');
            setIsLoading(false);
        }
    }, [userId, caregiverId]);

    /**
     * 숲: WebSocket 연결 해제
     * 나무: 구독 해제 및 클라이언트 정리
     */
    const disconnect = useCallback(() => {
        if (clientRef.current?.active) {
            cleanupSubscriptions();
            clientRef.current.deactivate();
            clientRef.current = null;
        }
        setIsConnected(false);
    }, []);

    /**
     * 숲: 구독 정리
     * 나무: 모든 토픽 구독 해제
     */
    const cleanupSubscriptions = useCallback(() => {
        subscriptionsRef.current.forEach(sub => {
            if (sub) {
                sub.unsubscribe();
            }
        });
        subscriptionsRef.current = [];
    }, []);

    /**
     * 숲: 새 알림 처리
     * 나무: 실시간 알림 수신 시 상태 업데이트
     */
    const handleNewAlert = useCallback((alert) => {
        console.log('New alert received:', alert);
        
        setAlerts(prevAlerts => {
            // 숲: 중복 알림 확인
            const existingIndex = prevAlerts.findIndex(a => a.alertId === alert.alertId);
            if (existingIndex !== -1) {
                // 숲: 기존 알림 업데이트
                const updatedAlerts = [...prevAlerts];
                updatedAlerts[existingIndex] = alert;
                return updatedAlerts;
            } else {
                // 숲: 새 알림 추가 (최신 순으로 정렬)
                return [alert, ...prevAlerts];
            }
        });

        // 숲: 통계 업데이트
        updateStats(alert);

        // 숲: 브라우저 알림 표시
        showBrowserNotification(alert);
    }, []);

    /**
     * 숲: 기존 알림 로드
     * 나무: 연결 완료 후 서버에서 기존 알림 목록 가져오기
     */
    const loadExistingAlerts = useCallback(async () => {
        if (!userId) return;

        try {
            const existingAlerts = await trackerApi.getUserAlerts(userId, 20);
            setAlerts(existingAlerts);
            
            // 숲: 초기 통계 계산
            const initialStats = calculateStats(existingAlerts);
            setStats(initialStats);
        } catch (error) {
            console.error('Error loading existing alerts:', error);
        }
    }, [userId]);

    /**
     * 숲: 알림 확인 처리
     * 나무: 사용자가 알림을 클릭했을 때 확인 상태로 변경
     */
    const acknowledgeAlert = useCallback(async (alertId) => {
        if (!caregiverId) return;

        try {
            await trackerApi.acknowledgeAlert(alertId, caregiverId);
            
            setAlerts(prevAlerts => 
                prevAlerts.map(alert => 
                    alert.alertId === alertId 
                        ? { ...alert, status: 'ACKNOWLEDGED', acknowledgedAt: new Date().toISOString() }
                        : alert
                )
            );
        } catch (error) {
            console.error('Error acknowledging alert:', error);
        }
    }, [caregiverId]);

    /**
     * 숲: 알림 해결 처리
     * 나무: 사용자가 알림에 대한 조치를 완료했을 때 해결 상태로 변경
     */
    const resolveAlert = useCallback(async (alertId, responseNotes = '') => {
        if (!caregiverId) return;

        try {
            await trackerApi.resolveAlert(alertId, caregiverId, responseNotes);
            
            setAlerts(prevAlerts => 
                prevAlerts.map(alert => 
                    alert.alertId === alertId 
                        ? { ...alert, status: 'RESOLVED', responseNotes: responseNotes }
                        : alert
                )
            );
        } catch (error) {
            console.error('Error resolving alert:', error);
        }
    }, [caregiverId]);

    /**
     * 숲: 통계 업데이트
     * 나무: 새 알림 수신 시 통계 카운터 업데이트
     */
    const updateStats = useCallback((newAlert) => {
        setStats(prevStats => ({
            totalAlerts: prevStats.totalAlerts + 1,
            unreadAlerts: newAlert.status === 'PENDING' ? prevStats.unreadAlerts + 1 : prevStats.unreadAlerts,
            highRiskAlerts: ['HIGH', 'CRITICAL'].includes(newAlert.severity) ? prevStats.highRiskAlerts + 1 : prevStats.highRiskAlerts
        }));
    }, []);

    /**
     * 숲: 통계 계산
     * 나무: 알림 목록에서 각종 통계 계산
     */
    const calculateStats = useCallback((alertList) => {
        return {
            totalAlerts: alertList.length,
            unreadAlerts: alertList.filter(alert => alert.status === 'PENDING').length,
            highRiskAlerts: alertList.filter(alert => ['HIGH', 'CRITICAL'].includes(alert.severity)).length
        };
    }, []);

    /**
     * 숲: 브라우저 알림 표시
     * 나무: 중요한 알림 수신 시 브라우저 네이티브 알림 표시
     */
    const showBrowserNotification = useCallback((alert) => {
        if (!('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'granted') {
            const notification = new Notification(`Care Pulse 알림 - ${alert.severity}`, {
                body: alert.interpretation,
                icon: '/favicon.ico',
                tag: alert.alertId,
                requireInteraction: ['HIGH', 'CRITICAL'].includes(alert.severity)
            });

            notification.onclick = () => {
                window.focus();
                acknowledgeAlert(alert.alertId);
                notification.close();
            };

            // 숲: 10초 후 자동 닫기
            setTimeout(() => notification.close(), 10000);
        }
    }, [acknowledgeAlert]);

    /**
     * 숲: 브라우저 알림 권한 요청
     * 나무: 컴포넌트 마운트 시 알림 권한 요청
     */
    const requestNotificationPermission = useCallback(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
            });
        }
    }, []);

    /**
     * 숲: 컴포넌트 마운트 시 연결 및 권한 요청
     * 나무: userId가 있을 때만 WebSocket 연결 시도
     */
    useEffect(() => {
        if (userId) {
            requestNotificationPermission();
            connect();
        }

        return () => {
            disconnect();
        };
    }, [userId, connect, disconnect, requestNotificationPermission]);

    return {
        alerts,
        isConnected,
        connectionError,
        isLoading,
        stats,
        connect,
        disconnect,
        acknowledgeAlert,
        resolveAlert,
        refresh: loadExistingAlerts
    };
}; 