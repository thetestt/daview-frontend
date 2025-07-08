import React, { useState, useEffect } from 'react';
import PulseChart from './PulseChart';
import PulseAlertCard from './PulseAlertCard';
import { usePulseAlerts } from '../hooks/usePulseAlerts';
import { useEventCollector } from '../hooks/useEventCollector';
import trackerApi from '../api/trackerApi';

/**
 * 숲: Care Pulse 종합 대시보드 컴포넌트
 * 나무: 실시간 모니터링, 알림 관리, 데이터 수집을 통합한 메인 대시보드
 */
const CarePulseDashboard = ({ 
    userId, 
    caregiverId, 
    patientName = '환자',
    className = '' 
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [realtimeStats, setRealtimeStats] = useState(null);
    const [pulseData, setPulseData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 숲: 커스텀 훅 사용
    const {
        alerts,
        isConnected,
        connectionError,
        stats: alertStats,
        acknowledgeAlert,
        resolveAlert,
        refresh: refreshAlerts
    } = usePulseAlerts(userId, caregiverId);

    const {
        isCollecting,
        collectionStats,
        addQuickVital,
        addQuickTask,
        sendEvents,
        startAutoCollection,
        stopAutoCollection,
        getPendingEventsInfo
    } = useEventCollector(caregiverId);

    /**
     * 숲: 실시간 통계 데이터 로드
     * 나무: 서버에서 Care Pulse 시스템 전체 통계 가져오기
     */
    const loadRealtimeStats = async () => {
        try {
            const stats = await trackerApi.getRealtimeStats(24);
            setRealtimeStats(stats);
        } catch (error) {
            console.error('Error loading realtime stats:', error);
        }
    };

    /**
     * 숲: 모의 펄스 데이터 생성
     * 나무: 데모용 차트 데이터 생성 (실제 환경에서는 실시간 데이터 사용)
     */
    const generateMockPulseData = () => {
        const now = Date.now();
        const data = [];
        
        for (let i = 24; i >= 0; i--) {
            const timestamp = new Date(now - i * 300000); // 5분 간격
            const baseValue = 0.3 + Math.random() * 0.4;
            const spike = Math.random() < 0.1 ? 0.4 : 0; // 10% 확률로 스파이크
            
            data.push({
                timestamp: timestamp.toISOString(),
                value: Math.min(1.0, baseValue + spike)
            });
        }
        
        setPulseData(data);
    };

    /**
     * 숲: 컴포넌트 초기화
     * 나무: 데이터 로드 및 자동 수집 시작
     */
    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            try {
                await loadRealtimeStats();
                generateMockPulseData();
                startAutoCollection(5); // 5분 간격 자동 수집
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId && caregiverId) {
            initialize();
        }

        return () => {
            stopAutoCollection();
        };
    }, [userId, caregiverId, startAutoCollection, stopAutoCollection]);

    /**
     * 숲: 빠른 바이탈 입력 처리
     * 나무: 사전 정의된 바이탈 데이터 템플릿으로 빠른 입력
     */
    const handleQuickVitalInput = (type) => {
        const vitalTemplates = {
            'normal_vitals': {
                systolicBp: 120,
                diastolicBp: 80,
                heartRate: 72,
                bodyTemperature: 36.5,
                oxygenSaturation: 98
            },
            'high_bp': {
                systolicBp: 160,
                diastolicBp: 95,
                heartRate: 85,
                bodyTemperature: 36.5
            },
            'fever': {
                systolicBp: 125,
                diastolicBp: 82,
                heartRate: 95,
                bodyTemperature: 38.2,
                oxygenSaturation: 96
            }
        };

        const vitalData = vitalTemplates[type];
        if (vitalData) {
            Object.entries(vitalData).forEach(([key, value]) => {
                const vitalType = key === 'systolicBp' || key === 'diastolicBp' 
                    ? 'blood_pressure' 
                    : key.replace(/([A-Z])/g, '_$1').toLowerCase();
                
                if (vitalType === 'blood_pressure') {
                    addQuickVital(userId, vitalType, `${vitalData.systolicBp}/${vitalData.diastolicBp}`);
                } else {
                    addQuickVital(userId, vitalType, value.toString());
                }
            });
        }
    };

    /**
     * 숲: 빠른 업무 입력 처리
     * 나무: 일반적인 요양 업무 템플릿으로 빠른 입력
     */
    const handleQuickTaskInput = (type) => {
        const taskTemplates = {
            'vital_check': {
                taskType: 'VITAL_CHECK',
                description: '정기 생체신호 측정 완료',
                duration: 10,
                priority: 'MEDIUM'
            },
            'medication': {
                taskType: 'MEDICATION',
                description: '처방약 복용 도움',
                duration: 15,
                priority: 'HIGH'
            },
            'meal_assist': {
                taskType: 'MEAL_ASSIST',
                description: '식사 도움 및 섭취량 확인',
                duration: 30,
                priority: 'MEDIUM'
            },
            'emergency': {
                taskType: 'EMERGENCY',
                description: '응급 상황 발생 - 즉시 확인 필요',
                duration: 5,
                priority: 'HIGH',
                hasAlert: true,
                alertDescription: '환자 상태 급변으로 인한 응급 처치 실시'
            }
        };

        const taskData = taskTemplates[type];
        if (taskData) {
            addQuickTask(userId, taskData.taskType, taskData.description, {
                duration: taskData.duration,
                priority: taskData.priority,
                hasAlert: taskData.hasAlert,
                alertDescription: taskData.alertDescription
            });
        }
    };

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center h-64 ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Care Pulse 대시보드 로딩 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
                <h3 className="text-lg font-semibold text-red-800 mb-2">오류 발생</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    새로고침
                </button>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-lg ${className}`}>
            {/* 숲: 대시보드 헤더 */}
            <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Care Pulse 대시보드</h2>
                        <p className="text-gray-600">
                            {patientName} • 연결 상태: 
                            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <span className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {isConnected ? '연결됨' : '연결 끊김'}
                            </span>
                        </p>
                    </div>
                    
                    {/* 숲: 실시간 통계 요약 */}
                    <div className="flex space-x-6 text-center">
                        <div>
                            <p className="text-sm text-gray-600">총 알림</p>
                            <p className="text-2xl font-bold text-blue-600">{alertStats.totalAlerts}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">미처리</p>
                            <p className="text-2xl font-bold text-yellow-600">{alertStats.unreadAlerts}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">고위험</p>
                            <p className="text-2xl font-bold text-red-600">{alertStats.highRiskAlerts}</p>
                        </div>
                    </div>
                </div>
                
                {/* 숲: 연결 오류 표시 */}
                {connectionError && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">⚠️ {connectionError}</p>
                    </div>
                )}
            </div>

            {/* 숲: 탭 네비게이션 */}
            <div className="px-6 py-3 border-b border-gray-200">
                <nav className="flex space-x-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        개요
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'alerts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        알림 ({alertStats.unreadAlerts})
                    </button>
                    <button
                        onClick={() => setActiveTab('data-entry')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'data-entry' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        데이터 입력
                    </button>
                </nav>
            </div>

            {/* 숲: 탭 콘텐츠 */}
            <div className="p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* 숲: 펄스 차트 */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">실시간 Pulse 모니터링</h3>
                            <PulseChart
                                data={pulseData}
                                width={800}
                                height={200}
                                threshold={0.7}
                                animate={true}
                                className="mb-4"
                            />
                        </div>

                        {/* 숲: 최근 알림 */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">최근 알림</h3>
                                <button
                                    onClick={refreshAlerts}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    새로고침
                                </button>
                            </div>
                            <div className="space-y-3">
                                {alerts.slice(0, 3).map(alert => (
                                    <PulseAlertCard
                                        key={alert.alertId}
                                        alert={alert}
                                        onAcknowledge={acknowledgeAlert}
                                        onResolve={resolveAlert}
                                        compact={true}
                                        showActions={false}
                                    />
                                ))}
                                {alerts.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">
                                        현재 알림이 없습니다.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 숲: 시스템 상태 */}
                        {realtimeStats && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">시스템 상태</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-600">활성 사용자</p>
                                        <p className="text-xl font-bold text-gray-800">{realtimeStats.activeUsers}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-600">평균 응답시간</p>
                                        <p className="text-xl font-bold text-gray-800">{realtimeStats.averageResponseTime}분</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-600">시스템 부하</p>
                                        <p className="text-xl font-bold text-gray-800">{(realtimeStats.systemLoad * 100).toFixed(0)}%</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-600">확인된 알림</p>
                                        <p className="text-xl font-bold text-gray-800">{realtimeStats.acknowledgedAlerts}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'alerts' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">알림 목록</h3>
                            <div className="flex space-x-2">
                                <span className="text-sm text-gray-600">
                                    총 {alerts.length}개 알림
                                </span>
                            </div>
                        </div>
                        
                        {alerts.map(alert => (
                            <PulseAlertCard
                                key={alert.alertId}
                                alert={alert}
                                onAcknowledge={acknowledgeAlert}
                                onResolve={resolveAlert}
                                showActions={true}
                                compact={false}
                            />
                        ))}
                        
                        {alerts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg mb-4">알림이 없습니다.</p>
                                <p className="text-gray-400">모든 것이 정상적으로 작동하고 있습니다.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'data-entry' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">빠른 바이탈 입력</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => handleQuickVitalInput('normal_vitals')}
                                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <h4 className="font-medium text-gray-800">정상 바이탈</h4>
                                    <p className="text-sm text-gray-600">혈압 120/80, 심박수 72bpm</p>
                                </button>
                                <button
                                    onClick={() => handleQuickVitalInput('high_bp')}
                                    className="p-4 border border-orange-300 rounded-lg hover:bg-orange-50 text-left"
                                >
                                    <h4 className="font-medium text-orange-800">고혈압</h4>
                                    <p className="text-sm text-orange-600">혈압 160/95, 심박수 85bpm</p>
                                </button>
                                <button
                                    onClick={() => handleQuickVitalInput('fever')}
                                    className="p-4 border border-red-300 rounded-lg hover:bg-red-50 text-left"
                                >
                                    <h4 className="font-medium text-red-800">발열</h4>
                                    <p className="text-sm text-red-600">체온 38.2°C, 심박수 95bpm</p>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">빠른 업무 입력</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleQuickTaskInput('vital_check')}
                                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <h4 className="font-medium text-gray-800">바이탈 체크</h4>
                                    <p className="text-sm text-gray-600">정기 생체신호 측정</p>
                                </button>
                                <button
                                    onClick={() => handleQuickTaskInput('medication')}
                                    className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 text-left"
                                >
                                    <h4 className="font-medium text-blue-800">투약 도움</h4>
                                    <p className="text-sm text-blue-600">처방약 복용 도움</p>
                                </button>
                                <button
                                    onClick={() => handleQuickTaskInput('meal_assist')}
                                    className="p-4 border border-green-300 rounded-lg hover:bg-green-50 text-left"
                                >
                                    <h4 className="font-medium text-green-800">식사 도움</h4>
                                    <p className="text-sm text-green-600">식사 도움 및 섭취량 확인</p>
                                </button>
                                <button
                                    onClick={() => handleQuickTaskInput('emergency')}
                                    className="p-4 border border-red-300 rounded-lg hover:bg-red-50 text-left"
                                >
                                    <h4 className="font-medium text-red-800">응급 상황</h4>
                                    <p className="text-sm text-red-600">긴급 상황 발생</p>
                                </button>
                            </div>
                        </div>

                        {/* 숲: 데이터 수집 상태 */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">데이터 수집 상태</h4>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex space-x-4">
                                    <span>대기 중: {getPendingEventsInfo().total}개</span>
                                    <span>전송 완료: {collectionStats.successfulEvents}개</span>
                                    <span>전송 실패: {collectionStats.failedEvents}개</span>
                                </div>
                                <button
                                    onClick={sendEvents}
                                    disabled={isCollecting}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isCollecting ? '전송 중...' : '지금 전송'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarePulseDashboard; 