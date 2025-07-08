import { useState, useCallback, useRef } from 'react';
import trackerApi from '../api/trackerApi';

/**
 * 숲: Care Pulse 이벤트 수집 관리 Hook
 * 나무: 바이탈/업무 데이터를 배치로 수집하여 서버에 전송
 */
export const useEventCollector = (caregiverId) => {
    const [isCollecting, setIsCollecting] = useState(false);
    const [lastResponse, setLastResponse] = useState(null);
    const [collectionStats, setCollectionStats] = useState({
        totalEvents: 0,
        successfulEvents: 0,
        failedEvents: 0,
        lastSent: null
    });
    
    const pendingVitals = useRef([]);
    const pendingTasks = useRef([]);
    const collectionTimer = useRef(null);

    /**
     * 숲: 바이탈 데이터 추가
     * 나무: 새로운 바이탈 데이터를 수집 큐에 추가
     */
    const addVitalData = useCallback((userId, vitalData) => {
        const vital = trackerApi.createVitalData(userId, caregiverId, vitalData);
        pendingVitals.current.push(vital);
        
        console.log('Vital data added to collection queue:', vital);
        
        // 숲: 긴급 데이터인 경우 즉시 전송
        if (isUrgentVital(vitalData)) {
            sendEvents();
        }
    }, [caregiverId]);

    /**
     * 숲: 업무 데이터 추가
     * 나무: 새로운 업무 데이터를 수집 큐에 추가
     */
    const addTaskData = useCallback((patientId, taskData) => {
        const task = trackerApi.createTaskData(caregiverId, patientId, taskData);
        pendingTasks.current.push(task);
        
        console.log('Task data added to collection queue:', task);
        
        // 숲: 긴급 업무인 경우 즉시 전송
        if (isUrgentTask(taskData)) {
            sendEvents();
        }
    }, [caregiverId]);

    /**
     * 숲: 수집된 이벤트 전송
     * 나무: 대기 중인 모든 이벤트를 서버로 배치 전송
     */
    const sendEvents = useCallback(async () => {
        if (isCollecting || (pendingVitals.current.length === 0 && pendingTasks.current.length === 0)) {
            return;
        }

        setIsCollecting(true);
        
        try {
            const vitals = [...pendingVitals.current];
            const tasks = [...pendingTasks.current];
            
            console.log(`Sending ${vitals.length} vitals and ${tasks.length} tasks to server`);
            
            const response = await trackerApi.collectEvents(vitals, tasks);
            
            // 숲: 성공적으로 전송된 이벤트 제거
            pendingVitals.current = [];
            pendingTasks.current = [];
            
            setLastResponse(response);
            updateCollectionStats(response);
            
            console.log('Events sent successfully:', response);
            
            return response;
            
        } catch (error) {
            console.error('Error sending events:', error);
            setLastResponse(error);
            throw error;
        } finally {
            setIsCollecting(false);
        }
    }, [isCollecting]);

    /**
     * 숲: 자동 전송 시작
     * 나무: 지정된 간격으로 자동 이벤트 전송
     */
    const startAutoCollection = useCallback((intervalMinutes = 5) => {
        if (collectionTimer.current) {
            clearInterval(collectionTimer.current);
        }
        
        collectionTimer.current = setInterval(() => {
            if (pendingVitals.current.length > 0 || pendingTasks.current.length > 0) {
                sendEvents();
            }
        }, intervalMinutes * 60 * 1000);
        
        console.log(`Auto collection started with ${intervalMinutes} minute interval`);
    }, [sendEvents]);

    /**
     * 숲: 자동 전송 중지
     * 나무: 자동 전송 타이머 해제
     */
    const stopAutoCollection = useCallback(() => {
        if (collectionTimer.current) {
            clearInterval(collectionTimer.current);
            collectionTimer.current = null;
        }
        
        console.log('Auto collection stopped');
    }, []);

    /**
     * 숲: 빠른 바이탈 데이터 입력
     * 나무: 자주 사용되는 바이탈 데이터 입력을 위한 헬퍼 함수
     */
    const addQuickVital = useCallback((userId, type, value) => {
        const vitalData = {};
        
        switch (type) {
            case 'blood_pressure':
                const [systolic, diastolic] = value.split('/').map(Number);
                vitalData.systolicBp = systolic;
                vitalData.diastolicBp = diastolic;
                break;
            case 'heart_rate':
                vitalData.heartRate = Number(value);
                break;
            case 'temperature':
                vitalData.bodyTemperature = Number(value);
                break;
            case 'blood_glucose':
                vitalData.bloodGlucose = Number(value);
                break;
            case 'oxygen_saturation':
                vitalData.oxygenSaturation = Number(value);
                break;
            default:
                console.warn('Unknown vital type:', type);
                return;
        }
        
        vitalData.qualityScore = 1.0;
        addVitalData(userId, vitalData);
    }, [addVitalData]);

    /**
     * 숲: 빠른 업무 데이터 입력
     * 나무: 자주 사용되는 업무 활동 입력을 위한 헬퍼 함수
     */
    const addQuickTask = useCallback((patientId, taskType, description, options = {}) => {
        const taskData = {
            taskType: taskType,
            description: description,
            durationMinutes: options.duration || 15,
            priority: options.priority || 'MEDIUM',
            patientResponse: options.patientResponse || 'NEUTRAL',
            complexityScore: options.complexity || 5,
            hasAlert: options.hasAlert || false,
            alertDescription: options.alertDescription || '',
            notes: options.notes || '',
            emotionalScore: options.emotionalScore || 7
        };
        
        addTaskData(patientId, taskData);
    }, [addTaskData]);

    /**
     * 숲: 긴급 바이탈 데이터 확인
     * 나무: 생명 위험 수준의 바이탈 사인 감지
     */
    const isUrgentVital = useCallback((vitalData) => {
        // 숲: 위험 수준 혈압
        if (vitalData.systolicBp && vitalData.diastolicBp) {
            if (vitalData.systolicBp >= 200 || vitalData.diastolicBp >= 120 ||
                vitalData.systolicBp <= 80 || vitalData.diastolicBp <= 50) {
                return true;
            }
        }
        
        // 숲: 위험 수준 심박수
        if (vitalData.heartRate && (vitalData.heartRate >= 150 || vitalData.heartRate <= 40)) {
            return true;
        }
        
        // 숲: 위험 수준 체온
        if (vitalData.bodyTemperature && 
            (vitalData.bodyTemperature >= 39.0 || vitalData.bodyTemperature <= 35.0)) {
            return true;
        }
        
        // 숲: 위험 수준 산소포화도
        if (vitalData.oxygenSaturation && vitalData.oxygenSaturation < 90) {
            return true;
        }
        
        return false;
    }, []);

    /**
     * 숲: 긴급 업무 확인
     * 나무: 즉시 처리가 필요한 업무 활동 감지
     */
    const isUrgentTask = useCallback((taskData) => {
        return taskData.priority === 'HIGH' || taskData.hasAlert === true;
    }, []);

    /**
     * 숲: 수집 통계 업데이트
     * 나무: 전송 결과를 바탕으로 통계 정보 업데이트
     */
    const updateCollectionStats = useCallback((response) => {
        setCollectionStats(prevStats => ({
            totalEvents: prevStats.totalEvents + (response.successfulVitals || 0) + (response.successfulTasks || 0) + (response.failedVitals || 0) + (response.failedTasks || 0),
            successfulEvents: prevStats.successfulEvents + (response.successfulVitals || 0) + (response.successfulTasks || 0),
            failedEvents: prevStats.failedEvents + (response.failedVitals || 0) + (response.failedTasks || 0),
            lastSent: new Date().toISOString()
        }));
    }, []);

    /**
     * 숲: 대기 중인 이벤트 정보
     * 나무: 현재 전송 대기 중인 이벤트 개수 반환
     */
    const getPendingEventsInfo = useCallback(() => {
        return {
            vitals: pendingVitals.current.length,
            tasks: pendingTasks.current.length,
            total: pendingVitals.current.length + pendingTasks.current.length
        };
    }, []);

    /**
     * 숲: 대기 중인 이벤트 초기화
     * 나무: 전송 실패 시 또는 필요에 따라 대기 큐 초기화
     */
    const clearPendingEvents = useCallback(() => {
        pendingVitals.current = [];
        pendingTasks.current = [];
        console.log('Pending events cleared');
    }, []);

    return {
        isCollecting,
        lastResponse,
        collectionStats,
        addVitalData,
        addTaskData,
        addQuickVital,
        addQuickTask,
        sendEvents,
        startAutoCollection,
        stopAutoCollection,
        getPendingEventsInfo,
        clearPendingEvents
    };
}; 