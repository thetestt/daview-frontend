import axiosInstance from './axiosInstance';

/**
 * 숲: Care Pulse Tracker API 클라이언트
 * 나무: 바이탈/업무 데이터 전송 및 알림 관리 API 호출
 */
class TrackerApi {
    
    /**
     * 숲: 이벤트 데이터 수집 API 호출
     * 나무: 바이탈과 업무 데이터를 배치로 서버에 전송
     */
    async collectEvents(vitals = [], tasks = []) {
        try {
            const requestData = {
                requestId: this.generateRequestId(),
                clientTimestamp: new Date().toISOString(),
                vitals: vitals,
                tasks: tasks,
                clientId: 'daview-react',
                clientVersion: '1.0.0',
                priority: this.hasPriorityData(vitals, tasks)
            };

            console.log('Sending event data:', requestData);

            const response = await axiosInstance.post('/api/tracker/events', requestData);
            return response.data;
        } catch (error) {
            console.error('Error collecting events:', error);
            throw this.handleApiError(error);
        }
    }

    /**
     * 숲: 사용자별 알림 목록 조회
     * 나무: 특정 사용자의 최근 Care Pulse 알림 가져오기
     */
    async getUserAlerts(userId, limit = 10) {
        try {
            const response = await axiosInstance.get(`/api/tracker/alerts/${userId}`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user alerts:', error);
            throw this.handleApiError(error);
        }
    }

    /**
     * 숲: 알림 확인 처리
     * 나무: 요양사가 알림을 확인했을 때 서버에 상태 업데이트
     */
    async acknowledgeAlert(alertId, caregiverId) {
        try {
            const response = await axiosInstance.patch(`/api/tracker/alerts/${alertId}/acknowledge`, {
                caregiverId: caregiverId
            });
            return response.data;
        } catch (error) {
            console.error('Error acknowledging alert:', error);
            throw this.handleApiError(error);
        }
    }

    /**
     * 숲: 알림 해결 처리
     * 나무: 알림에 대한 조치 완료 시 서버에 상태 업데이트
     */
    async resolveAlert(alertId, caregiverId, responseNotes = '') {
        try {
            const response = await axiosInstance.patch(`/api/tracker/alerts/${alertId}/resolve`, {
                caregiverId: caregiverId,
                responseNotes: responseNotes
            });
            return response.data;
        } catch (error) {
            console.error('Error resolving alert:', error);
            throw this.handleApiError(error);
        }
    }

    /**
     * 숲: 실시간 통계 조회
     * 나무: 대시보드용 Care Pulse 통계 데이터 가져오기
     */
    async getRealtimeStats(hours = 24) {
        try {
            const response = await axiosInstance.get('/api/tracker/stats', {
                params: { hours }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching realtime stats:', error);
            throw this.handleApiError(error);
        }
    }

    /**
     * 숲: 시스템 상태 확인
     * 나무: Care Pulse Tracker 시스템 전체 상태 점검
     */
    async checkHealth() {
        try {
            const response = await axiosInstance.get('/api/tracker/health');
            return response.data;
        } catch (error) {
            console.error('Error checking health:', error);
            throw this.handleApiError(error);
        }
    }

    /**
     * 숲: WebSocket 연결 테스트
     * 나무: 실시간 알림 연결 상태 확인
     */
    async testWebSocket(userId) {
        try {
            const response = await axiosInstance.post('/api/tracker/test-websocket', {
                userId: userId
            });
            return response.data;
        } catch (error) {
            console.error('Error testing WebSocket:', error);
            throw this.handleApiError(error);
        }
    }

    /**
     * 숲: 바이탈 데이터 생성 헬퍼
     * 나무: 폼 데이터를 VitalDTO 형식으로 변환
     */
    createVitalData(userId, caregiverId, vitalData) {
        return {
            eventId: this.generateEventId(),
            userId: userId,
            timestamp: new Date().toISOString(),
            systolicBp: vitalData.systolicBp,
            diastolicBp: vitalData.diastolicBp,
            heartRate: vitalData.heartRate,
            bodyTemperature: vitalData.bodyTemperature,
            bloodGlucose: vitalData.bloodGlucose,
            oxygenSaturation: vitalData.oxygenSaturation,
            dailySteps: vitalData.dailySteps,
            sleepHours: vitalData.sleepHours,
            mealIntake: vitalData.mealIntake,
            qualityScore: vitalData.qualityScore || 1.0,
            caregiverId: caregiverId,
            metadata: vitalData.metadata || {}
        };
    }

    /**
     * 숲: 업무 데이터 생성 헬퍼
     * 나무: 폼 데이터를 TaskDTO 형식으로 변환
     */
    createTaskData(caregiverId, patientId, taskData) {
        return {
            eventId: this.generateEventId(),
            caregiverId: caregiverId,
            patientId: patientId,
            timestamp: new Date().toISOString(),
            taskType: taskData.taskType,
            description: taskData.description,
            durationMinutes: taskData.durationMinutes,
            status: taskData.status || 'COMPLETED',
            priority: taskData.priority || 'MEDIUM',
            patientResponse: taskData.patientResponse,
            complexityScore: taskData.complexityScore,
            hasAlert: taskData.hasAlert || false,
            alertDescription: taskData.alertDescription,
            notes: taskData.notes,
            emotionalScore: taskData.emotionalScore,
            metadata: taskData.metadata || {}
        };
    }

    /**
     * 숲: 고우선순위 데이터 확인
     * 나무: 긴급 상황이나 위험 수준 데이터 포함 여부 확인
     */
    hasPriorityData(vitals, tasks) {
        // 숲: 위험 수준 바이탈 확인
        const hasHighRiskVital = vitals.some(vital => 
            (vital.systolicBp && (vital.systolicBp >= 180 || vital.systolicBp <= 90)) ||
            (vital.heartRate && (vital.heartRate >= 120 || vital.heartRate <= 50)) ||
            (vital.bodyTemperature && (vital.bodyTemperature >= 38.5 || vital.bodyTemperature <= 35.5))
        );

        // 숲: 긴급 업무 확인
        const hasUrgentTask = tasks.some(task => 
            task.priority === 'HIGH' || task.hasAlert === true
        );

        return hasHighRiskVital || hasUrgentTask;
    }

    /**
     * 숲: 요청 ID 생성
     * 나무: 클라이언트 측 중복 요청 방지용 고유 ID
     */
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 숲: 이벤트 ID 생성
     * 나무: 개별 이벤트 고유 식별자
     */
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 숲: API 오류 처리
     * 나무: 표준화된 오류 메시지 반환
     */
    handleApiError(error) {
        if (error.response) {
            // 숲: 서버 응답 오류
            return {
                message: error.response.data.message || 'API 오류가 발생했습니다.',
                status: error.response.status,
                data: error.response.data
            };
        } else if (error.request) {
            // 숲: 네트워크 오류
            return {
                message: '서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.',
                status: 0,
                data: null
            };
        } else {
            // 숲: 기타 오류
            return {
                message: error.message || '알 수 없는 오류가 발생했습니다.',
                status: -1,
                data: null
            };
        }
    }
}

// 숲: 싱글톤 인스턴스 내보내기
export default new TrackerApi(); 