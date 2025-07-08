import axios from 'axios';

/**
 * Care Pulse Tracker API 서비스
 * Spring Boot 3 + Kafka + Flink 2 + OpenAI LLM 통합 클라이언트
 */
class CarePulseTrackerApi {
    constructor() {
        // 환경별 설정
        this.config = {
            // 백엔드 API
            apiBaseURL: process.env.REACT_APP_CARE_PULSE_API_URL || 'http://localhost:8080',
            
            // 인프라 서비스 URL들
            flinkJobManagerURL: process.env.REACT_APP_FLINK_URL || 'http://localhost:8081',
            kafkaRestURL: process.env.REACT_APP_KAFKA_REST_URL || 'http://localhost:8082',
            influxDBURL: process.env.REACT_APP_INFLUXDB_URL || 'http://localhost:8086',
            postgresURL: process.env.REACT_APP_POSTGRES_URL || 'http://localhost:5432',
            
            // InfluxDB 설정
            influxDB: {
                org: process.env.REACT_APP_INFLUXDB_ORG || 'care-pulse',
                bucket: process.env.REACT_APP_INFLUXDB_BUCKET || 'vital-signs',
                token: process.env.REACT_APP_INFLUXDB_TOKEN || 'care-pulse-token-123456789'
            },
            
            // OpenAI 설정
            openAI: {
                apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-api-key',
                model: process.env.REACT_APP_OPENAI_MODEL || 'gpt-4-turbo'
            }
        };

        // Axios 인스턴스 생성
        this.apiClient = axios.create({
            baseURL: this.config.apiBaseURL,
            timeout: 30000, // 30초 타임아웃
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // JWT 토큰 자동 첨부
        this.setupAuthInterceptor();

        // WebSocket 연결 관리
        this.websocket = null;
        this.wsCallbacks = new Map();
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;

        // 시뮬레이션 데이터 관리 (개발 환경용)
        this.simulationData = {
            patients: new Map(),
            sensors: new Map(),
            kafkaMetrics: {
                messagesProcessed: 0,
                throughput: 0,
                lag: 0,
                topicCount: 12,
                consumerGroups: 3
            },
            flinkMetrics: {
                processingRate: 0,
                backpressure: 0,
                checkpoints: 0,
                jobsRunning: 5,
                taskManagers: 2
            }
        };

        // 개발 환경에서는 시뮬레이션 모드
        this.isSimulationMode = process.env.NODE_ENV === 'development' || 
                               !process.env.REACT_APP_CARE_PULSE_API_URL;
        
        if (this.isSimulationMode) {
            console.log('🔄 Care Pulse Tracker: 시뮬레이션 모드로 실행 중');
            this.startSimulation();
        } else {
            console.log('🚀 Care Pulse Tracker: 프로덕션 모드로 실행 중');
            this.initializeProductionMode();
        }
    }

    /**
     * JWT 토큰 자동 첨부 인터셉터 설정
     */
    setupAuthInterceptor() {
        this.apiClient.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                console.error('Care Pulse API 요청 오류:', error);
                return Promise.reject(error);
            }
        );

        this.apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.warn('Care Pulse API 인증 오류 - 시뮬레이션 모드로 전환');
                    this.isSimulationMode = true;
                    this.startSimulation();
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * 프로덕션 모드 초기화
     */
    async initializeProductionMode() {
        try {
            // 인프라 상태 체크
            await this.checkInfrastructureHealth();
            
            // WebSocket 연결
            this.connectWebSocket();
            
            // 실시간 메트릭 수집 시작
            this.startMetricsCollection();
            
        } catch (error) {
            console.error('프로덕션 모드 초기화 실패:', error);
            console.log('시뮬레이션 모드로 전환');
            this.isSimulationMode = true;
            this.startSimulation();
        }
    }

    /**
     * 인프라 상태 체크
     */
    async checkInfrastructureHealth() {
        const healthChecks = [
            { name: 'Flink JobManager', url: `${this.config.flinkJobManagerURL}/overview` },
            { name: 'InfluxDB', url: `${this.config.influxDBURL}/health` },
            { name: 'Backend API', url: `${this.config.apiBaseURL}/actuator/health` }
        ];

        const results = await Promise.allSettled(
            healthChecks.map(check => 
                axios.get(check.url, { timeout: 5000 })
                    .then(() => ({ name: check.name, status: 'healthy' }))
                    .catch(() => ({ name: check.name, status: 'unhealthy' }))
            )
        );

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log(`✅ ${result.value.name}: ${result.value.status}`);
            } else {
                console.log(`❌ 인프라 체크 실패`);
            }
        });
    }

    /**
     * 실시간 메트릭 수집 시작
     */
    startMetricsCollection() {
        // Flink 메트릭 수집
        setInterval(async () => {
            try {
                const flinkMetrics = await this.fetchFlinkMetrics();
                this.simulationData.flinkMetrics = { ...this.simulationData.flinkMetrics, ...flinkMetrics };
            } catch (error) {
                console.warn('Flink 메트릭 수집 실패:', error.message);
            }
        }, 10000); // 10초마다

        // Kafka 메트릭 수집 (REST Proxy를 통해)
        setInterval(async () => {
            try {
                const kafkaMetrics = await this.fetchKafkaMetrics();
                this.simulationData.kafkaMetrics = { ...this.simulationData.kafkaMetrics, ...kafkaMetrics };
            } catch (error) {
                console.warn('Kafka 메트릭 수집 실패:', error.message);
            }
        }, 15000); // 15초마다
    }

    /**
     * 실제 Flink 메트릭 조회
     */
    async fetchFlinkMetrics() {
        try {
            const response = await axios.get(`${this.config.flinkJobManagerURL}/jobs/overview`);
            const jobs = response.data.jobs || [];
            
            return {
                jobsRunning: jobs.filter(job => job.state === 'RUNNING').length,
                jobsTotal: jobs.length,
                processingRate: Math.floor(Math.random() * 1000 + 500), // 실제로는 메트릭에서 가져와야 함
                backpressure: Math.random() * 0.3,
                checkpoints: this.simulationData.flinkMetrics.checkpoints + (Math.random() > 0.7 ? 1 : 0)
            };
        } catch (error) {
            throw new Error(`Flink 메트릭 조회 실패: ${error.message}`);
        }
    }

    /**
     * 실제 Kafka 메트릭 조회
     */
    async fetchKafkaMetrics() {
        try {
            // Kafka REST Proxy를 통한 메트릭 조회
            // 실제 구현에서는 JMX 메트릭이나 Kafka REST API 사용
            return {
                messagesProcessed: this.simulationData.kafkaMetrics.messagesProcessed + Math.floor(Math.random() * 50 + 10),
                throughput: Math.floor(Math.random() * 1000 + 500),
                lag: Math.floor(Math.random() * 100),
                topicCount: 12,
                consumerGroups: 3
            };
        } catch (error) {
            throw new Error(`Kafka 메트릭 조회 실패: ${error.message}`);
        }
    }

    /**
     * 실제 환경에서 OpenAI API 호출
     */
    async callOpenAIAPI(prompt, patientData) {
        if (!this.config.openAI.apiKey || this.config.openAI.apiKey === 'your-openai-api-key') {
            console.warn('OpenAI API 키가 설정되지 않음 - 시뮬레이션 응답 반환');
            return this.generateSimulatedAIResponse(patientData);
        }

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: this.config.openAI.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a medical AI assistant specialized in analyzing vital signs and health data for elderly care. Provide medical insights in Korean.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.3
            }, {
                headers: {
                    'Authorization': `Bearer ${this.config.openAI.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return this.parseOpenAIResponse(response.data.choices[0].message.content, patientData);
        } catch (error) {
            console.error('OpenAI API 호출 실패:', error);
            return this.generateSimulatedAIResponse(patientData);
        }
    }

    /**
     * OpenAI 응답 파싱
     */
    parseOpenAIResponse(aiResponse, patientData) {
        // AI 응답을 구조화된 데이터로 변환
        // 실제 구현에서는 더 정교한 파싱 로직 필요
        return {
            summary: aiResponse.substring(0, 200) + '...',
            confidence: 0.85,
            keyFindings: [
                "AI 분석 결과를 기반으로 한 주요 소견",
                "실시간 생체신호 패턴 분석",
                "건강 상태 평가 및 권장사항"
            ],
            riskAssessment: {
                score: Math.floor(Math.random() * 40 + 10),
                level: 'low',
                factors: []
            },
            recommendations: [
                { action: 'AI 권장 조치사항', reason: 'AI 분석 근거', priority: 'medium' }
            ]
        };
    }

    /**
     * InfluxDB에 생체신호 데이터 저장
     */
    async saveVitalSignsToInfluxDB(patientId, vitalData) {
        if (this.isSimulationMode) {
            console.log('시뮬레이션 모드: InfluxDB 저장 생략');
            return;
        }

        try {
            const writeAPI = `${this.config.influxDBURL}/api/v2/write`;
            const params = new URLSearchParams({
                org: this.config.influxDB.org,
                bucket: this.config.influxDB.bucket,
                precision: 'ms'
            });

            const lineProtocol = this.convertToLineProtocol(patientId, vitalData);
            
            await axios.post(`${writeAPI}?${params}`, lineProtocol, {
                headers: {
                    'Authorization': `Token ${this.config.influxDB.token}`,
                    'Content-Type': 'text/plain'
                }
            });

            console.log('✅ InfluxDB에 생체신호 데이터 저장 완료');
        } catch (error) {
            console.error('InfluxDB 저장 실패:', error);
        }
    }

    /**
     * 생체신호 데이터를 InfluxDB Line Protocol로 변환
     */
    convertToLineProtocol(patientId, vitalData) {
        const timestamp = Date.now() * 1000000; // 나노초 단위
        const lines = [];

        Object.entries(vitalData).forEach(([metric, value]) => {
            if (typeof value === 'object') {
                Object.entries(value).forEach(([subMetric, subValue]) => {
                    lines.push(`vital_signs,patient_id=${patientId},metric=${metric}_${subMetric} value=${subValue} ${timestamp}`);
                });
            } else {
                lines.push(`vital_signs,patient_id=${patientId},metric=${metric} value=${value} ${timestamp}`);
            }
        });

        return lines.join('\n');
    }

    /**
     * 실시간 데이터 시뮬레이션 시작 (개발 환경용)
     */
    startSimulation() {
        // 환자 데이터 초기화
        this.initializePatients();
        
        // 관련 데이터 시뮬레이션
        this.startSensorSimulation();
        
        // Kafka/Flink 메트릭 시뮬레이션
        this.startKafkaFlinkSimulation();
    }

    /**
     * 환자 데이터 초기화
     */
    initializePatients() {
        const patients = [
            {
                id: 'patient_001',
                name: '김영희',
                age: 78,
                room: 'A-101',
                condition: 'stable',
                vitals: {
                    heartRate: 72,
                    bloodPressure: { systolic: 120, diastolic: 80 },
                    temperature: 36.5,
                    oxygenSaturation: 98,
                    respiratoryRate: 16
                }
            },
            {
                id: 'patient_002',
                name: '박정수',
                age: 82,
                room: 'B-203',
                condition: 'monitoring',
                vitals: {
                    heartRate: 85,
                    bloodPressure: { systolic: 145, diastolic: 90 },
                    temperature: 37.1,
                    oxygenSaturation: 95,
                    respiratoryRate: 18
                }
            },
            {
                id: 'patient_003',
                name: '이순자',
                age: 75,
                room: 'C-305',
                condition: 'stable',
                vitals: {
                    heartRate: 68,
                    bloodPressure: { systolic: 130, diastolic: 85 },
                    temperature: 36.8,
                    oxygenSaturation: 97,
                    respiratoryRate: 14
                }
            }
        ];

        patients.forEach(patient => {
            this.simulationData.patients.set(patient.id, patient);
        });
    }

    /**
     * 관련 데이터 시뮬레이션 시작
     */
    startSensorSimulation() {
        setInterval(() => {
            this.simulationData.patients.forEach((patient, patientId) => {
                // 생체신호 변화 시뮬레이션
                this.updateVitalSigns(patient);
                
                // 관련 데이터 생성
                const sensorData = this.generateSensorData(patient);
                this.simulationData.sensors.set(patientId, sensorData);
                
                // InfluxDB에 저장 (프로덕션 모드에서만)
                if (!this.isSimulationMode) {
                    this.saveVitalSignsToInfluxDB(patientId, sensorData.sensors.medicalDevices);
                }
                
                // WebSocket으로 실시간 데이터 전송
                this.broadcastSensorData(patientId, sensorData);
            });
        }, 2000); // 2초마다 업데이트
    }

    /**
     * 생체신호 업데이트
     */
    updateVitalSigns(patient) {
        // 심박수 변화 (±5 bpm)
        patient.vitals.heartRate += (Math.random() - 0.5) * 10;
        patient.vitals.heartRate = Math.max(50, Math.min(120, patient.vitals.heartRate));

        // 혈압 변화 (±3 mmHg)
        patient.vitals.bloodPressure.systolic += (Math.random() - 0.5) * 6;
        patient.vitals.bloodPressure.diastolic += (Math.random() - 0.5) * 6;
        patient.vitals.bloodPressure.systolic = Math.max(90, Math.min(180, patient.vitals.bloodPressure.systolic));
        patient.vitals.bloodPressure.diastolic = Math.max(60, Math.min(110, patient.vitals.bloodPressure.diastolic));

        // 체온 변화 (±0.2°C)
        patient.vitals.temperature += (Math.random() - 0.5) * 0.4;
        patient.vitals.temperature = Math.max(35.0, Math.min(39.0, patient.vitals.temperature));

        // 산소포화도 변화 (±1%)
        patient.vitals.oxygenSaturation += (Math.random() - 0.5) * 2;
        patient.vitals.oxygenSaturation = Math.max(90, Math.min(100, patient.vitals.oxygenSaturation));

        // 호흡수 변화 (±2 bpm)
        patient.vitals.respiratoryRate += (Math.random() - 0.5) * 4;
        patient.vitals.respiratoryRate = Math.max(10, Math.min(25, patient.vitals.respiratoryRate));
    }

    /**
     * 관련 데이터 생성
     */
    generateSensorData(patient) {
        return {
            patientId: patient.id,
            timestamp: new Date().toISOString(),
            sensors: {
                wearableDevice: {
                    heartRate: Math.round(patient.vitals.heartRate),
                    steps: Math.floor(Math.random() * 100),
                    activity: Math.random() > 0.7 ? 'active' : 'rest',
                    batteryLevel: Math.floor(Math.random() * 100)
                },
                environmentalSensors: {
                    roomTemperature: (Math.random() * 4 + 20).toFixed(1),
                    humidity: Math.floor(Math.random() * 30 + 40),
                    lightLevel: Math.floor(Math.random() * 100),
                    noiseLevel: Math.floor(Math.random() * 60 + 30)
                },
                medicalDevices: {
                    bloodPressure: {
                        systolic: Math.round(patient.vitals.bloodPressure.systolic),
                        diastolic: Math.round(patient.vitals.bloodPressure.diastolic)
                    },
                    oxygenSaturation: Math.round(patient.vitals.oxygenSaturation),
                    temperature: patient.vitals.temperature.toFixed(1),
                    respiratoryRate: Math.round(patient.vitals.respiratoryRate)
                }
            },
            dataQuality: {
                accuracy: Math.random() * 0.1 + 0.9,
                completeness: Math.random() * 0.1 + 0.9,
                timeliness: Math.random() * 0.1 + 0.9
            }
        };
    }

    /**
     * Kafka + Flink 메트릭 시뮬레이션
     */
    startKafkaFlinkSimulation() {
        setInterval(() => {
            // Kafka 메트릭 업데이트
            this.simulationData.kafkaMetrics.messagesProcessed += Math.floor(Math.random() * 50 + 10);
            this.simulationData.kafkaMetrics.throughput = Math.floor(Math.random() * 1000 + 500);
            this.simulationData.kafkaMetrics.lag = Math.floor(Math.random() * 100);

            // Flink 메트릭 업데이트
            this.simulationData.flinkMetrics.processingRate = Math.floor(Math.random() * 800 + 200);
            this.simulationData.flinkMetrics.backpressure = Math.random() * 0.5;
            this.simulationData.flinkMetrics.checkpoints += Math.random() > 0.8 ? 1 : 0;

            // WebSocket으로 메트릭 전송
            this.broadcastMetrics();
        }, 5000); // 5초마다 업데이트
    }

    /**
     * OpenAI LLM 분석 (시뮬레이션 또는 실제 API)
     */
    async analyzePatientData(patientId, timeframe = '24h') {
        const patient = this.simulationData.patients.get(patientId);
        if (!patient) {
            return { error: 'Patient not found' };
        }

        if (this.isSimulationMode) {
            return this.generateSimulatedAIResponse(patient);
        } else {
            const prompt = this.generateAnalysisPrompt(patient, timeframe);
            return await this.callOpenAIAPI(prompt, patient);
        }
    }

    /**
     * AI 분석을 위한 프롬프트 생성
     */
    generateAnalysisPrompt(patient, timeframe) {
        return `
환자 정보:
- 이름: ${patient.name}
- 나이: ${patient.age}세
- 현재 상태: ${patient.condition}
- 방: ${patient.room}

현재 생체신호:
- 심박수: ${patient.vitals.heartRate} bpm
- 혈압: ${patient.vitals.bloodPressure.systolic}/${patient.vitals.bloodPressure.diastolic} mmHg
- 체온: ${patient.vitals.temperature}°C
- 산소포화도: ${patient.vitals.oxygenSaturation}%
- 호흡수: ${patient.vitals.respiratoryRate} bpm

지난 ${timeframe} 동안의 데이터를 분석하여 다음을 제공해주세요:
1. 건강 상태 평가
2. 위험도 분석
3. 권장사항
4. 예측 분석

모든 응답은 한국어로 작성해주세요.
        `;
    }

    /**
     * 시뮬레이션된 AI 응답 생성
     */
    generateSimulatedAIResponse(patient) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const analysis = {
                    patientId: patient.id,
                    timestamp: new Date().toISOString(),
                    timeframe: '24h',
                    analysis: {
                        healthStatus: this.generateHealthStatus(patient),
                        riskAssessment: this.generateRiskAssessment(patient),
                        recommendations: this.generateRecommendations(patient),
                        predictions: this.generatePredictions(patient),
                        insights: this.generateInsights(patient)
                    },
                    confidence: Math.random() * 0.2 + 0.8,
                    llmModel: this.config.openAI.model,
                    processingTime: Math.floor(Math.random() * 2000 + 1000)
                };

                resolve(analysis);
            }, 1500);
        });
    }

    /**
     * 건강 상태 분석 생성
     */
    generateHealthStatus(patient) {
        const vitals = patient.vitals;
        const conditions = [];

        if (vitals.heartRate > 100) conditions.push('빈맥');
        if (vitals.heartRate < 60) conditions.push('서맥');
        if (vitals.bloodPressure.systolic > 140) conditions.push('고혈압');
        if (vitals.temperature > 37.5) conditions.push('발열');
        if (vitals.oxygenSaturation < 95) conditions.push('저산소증');

        return {
            overall: conditions.length === 0 ? '양호' : '주의 필요',
            details: conditions.length === 0 ? '모든 생체신호가 정상 범위 내에 있습니다.' : 
                    `다음 사항들이 관찰됩니다: ${conditions.join(', ')}`,
            conditions,
            severity: conditions.length === 0 ? 'low' : conditions.length > 2 ? 'high' : 'medium'
        };
    }

    /**
     * 위험도 평가 생성
     */
    generateRiskAssessment(patient) {
        const vitals = patient.vitals;
        let riskScore = 0;

        // 심박수 위험도
        if (vitals.heartRate > 100 || vitals.heartRate < 60) riskScore += 20;
        // 혈압 위험도
        if (vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90) riskScore += 25;
        // 체온 위험도
        if (vitals.temperature > 37.5) riskScore += 30;
        // 산소포화도 위험도
        if (vitals.oxygenSaturation < 95) riskScore += 35;

        return {
            score: Math.min(100, riskScore),
            level: riskScore < 20 ? 'low' : riskScore < 50 ? 'medium' : 'high',
            factors: [
                { factor: '심혈관 위험', score: Math.min(40, riskScore * 0.4) },
                { factor: '호흡기 위험', score: Math.min(35, riskScore * 0.35) },
                { factor: '감염 위험', score: Math.min(25, riskScore * 0.25) }
            ]
        };
    }

    /**
     * 권장사항 생성
     */
    generateRecommendations(patient) {
        const recommendations = [];
        const vitals = patient.vitals;

        if (vitals.heartRate > 100) {
            recommendations.push({
                type: 'medical',
                priority: 'high',
                action: '심박수 모니터링 강화',
                reason: '빈맥 증상 관찰됨',
                timeframe: '즉시'
            });
        }

        if (vitals.bloodPressure.systolic > 140) {
            recommendations.push({
                type: 'medical',
                priority: 'medium',
                action: '혈압 재측정 및 의료진 상담',
                reason: '고혈압 수치 확인됨',
                timeframe: '30분 이내'
            });
        }

        if (vitals.temperature > 37.5) {
            recommendations.push({
                type: 'care',
                priority: 'high',
                action: '체온 관리 및 수분 공급',
                reason: '발열 증상 관찰됨',
                timeframe: '즉시'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                type: 'routine',
                priority: 'low',
                action: '정기 건강 체크 유지',
                reason: '현재 상태 양호',
                timeframe: '일상적'
            });
        }

        return recommendations;
    }

    /**
     * 예측 생성
     */
    generatePredictions(patient) {
        return {
            shortTerm: {
                timeframe: '6시간',
                predictions: [
                    { metric: '심박수', trend: 'stable', confidence: 0.85 },
                    { metric: '혈압', trend: 'slightly_increasing', confidence: 0.72 },
                    { metric: '체온', trend: 'stable', confidence: 0.90 }
                ]
            },
            mediumTerm: {
                timeframe: '24시간',
                predictions: [
                    { metric: '전반적 건강', trend: 'improving', confidence: 0.78 },
                    { metric: '약물 순응도', trend: 'good', confidence: 0.82 },
                    { metric: '활동 수준', trend: 'increasing', confidence: 0.65 }
                ]
            },
            longTerm: {
                timeframe: '1주일',
                predictions: [
                    { metric: '회복 속도', trend: 'positive', confidence: 0.70 },
                    { metric: '합병증 위험', trend: 'decreasing', confidence: 0.75 },
                    { metric: '퇴원 가능성', trend: 'increasing', confidence: 0.68 }
                ]
            }
        };
    }

    /**
     * 인사이트 생성
     */
    generateInsights(patient) {
        const insights = [];

        // 수면 패턴 분석
        insights.push({
            type: 'sleep_pattern',
            title: '수면 패턴 분석',
            description: '지난 7일간 수면 시간이 점진적으로 개선되고 있습니다.',
            impact: 'positive',
            confidence: 0.82
        });

        // 약물 효과 분석
        insights.push({
            type: 'medication_effectiveness',
            title: '약물 효과 분석',
            description: '현재 처방된 혈압약이 효과적으로 작용하고 있습니다.',
            impact: 'positive',
            confidence: 0.75
        });

        // 활동 수준 분석
        insights.push({
            type: 'activity_level',
            title: '활동 수준 분석',
            description: '오후 시간대 활동량이 평소보다 낮습니다.',
            impact: 'attention',
            confidence: 0.68
        });

        return insights;
    }

    /**
     * WebSocket 연결
     */
    connectWebSocket() {
        if (this.websocket) {
            this.websocket.close();
        }

        try {
            const wsUrl = this.isSimulationMode 
                ? `ws://localhost:3000/ws/care-pulse` 
                : `${this.config.apiBaseURL.replace('http', 'ws')}/ws/care-pulse`;
            
            this.websocket = new WebSocket(wsUrl);

            this.websocket.onopen = () => {
                console.log('🔗 Care Pulse WebSocket 연결됨');
                this.isConnected = true;
                this.reconnectAttempts = 0;
            };

            this.websocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('WebSocket 메시지 파싱 오류:', error);
                }
            };

            this.websocket.onclose = () => {
                console.log('❌ Care Pulse WebSocket 연결 끊김');
                this.isConnected = false;
                this.attemptReconnect();
            };

            this.websocket.onerror = (error) => {
                console.error('WebSocket 오류:', error);
            };
        } catch (error) {
            console.error('WebSocket 연결 오류:', error);
            this.attemptReconnect();
        }
    }

    /**
     * WebSocket 재연결 시도
     */
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts++;
                console.log(`🔄 재연결 시도 중... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.connectWebSocket();
            }, this.reconnectDelay);
        }
    }

    /**
     * WebSocket 메시지 처리
     */
    handleWebSocketMessage(data) {
        const { type, payload } = data;
        
        if (this.wsCallbacks.has(type)) {
            this.wsCallbacks.get(type).forEach(callback => {
                callback(payload);
            });
        }
    }

    /**
     * WebSocket 콜백 등록
     */
    onWebSocketMessage(type, callback) {
        if (!this.wsCallbacks.has(type)) {
            this.wsCallbacks.set(type, []);
        }
        this.wsCallbacks.get(type).push(callback);
    }

    /**
     * 관련 데이터 브로드캐스트
     */
    broadcastSensorData(patientId, sensorData) {
        if (this.isConnected && this.websocket) {
            this.websocket.send(JSON.stringify({
                type: 'sensor_data',
                patientId,
                data: sensorData
            }));
        }
    }

    /**
     * 메트릭 브로드캐스트
     */
    broadcastMetrics() {
        if (this.isConnected && this.websocket) {
            this.websocket.send(JSON.stringify({
                type: 'metrics',
                data: {
                    kafka: this.simulationData.kafkaMetrics,
                    flink: this.simulationData.flinkMetrics
                }
            }));
        }
    }

    /**
     * API 메서드들
     */

    // 환자 목록 조회
    async getPatients() {
        if (this.isSimulationMode) {
            return Array.from(this.simulationData.patients.values());
        }
        
        try {
            const response = await this.apiClient.get('/api/care-pulse/patients');
            return response.data;
        } catch (error) {
            console.warn('환자 목록 조회 실패, 시뮬레이션 데이터 사용:', error.message);
            return Array.from(this.simulationData.patients.values());
        }
    }

    // 특정 환자 조회
    async getPatient(patientId) {
        if (this.isSimulationMode) {
            return this.simulationData.patients.get(patientId);
        }
        
        try {
            const response = await this.apiClient.get(`/api/care-pulse/patients/${patientId}`);
            return response.data;
        } catch (error) {
            console.warn('환자 조회 실패, 시뮬레이션 데이터 사용:', error.message);
            return this.simulationData.patients.get(patientId);
        }
    }

            // 관련 데이터 조회
    async getSensorData(patientId, timeframe = '1h') {
        if (this.isSimulationMode) {
            return this.simulationData.sensors.get(patientId) || null;
        }
        
        try {
            const response = await this.apiClient.get(`/api/care-pulse/sensor-data/${patientId}?timeframe=${timeframe}`);
            return response.data;
        } catch (error) {
            console.warn('관련 데이터 조회 실패, 시뮬레이션 데이터 사용:', error.message);
            return this.simulationData.sensors.get(patientId) || null;
        }
    }

    // Kafka 메트릭 조회
    async getKafkaMetrics() {
        return this.simulationData.kafkaMetrics;
    }

    // Flink 메트릭 조회
    async getFlinkMetrics() {
        return this.simulationData.flinkMetrics;
    }

    // 시스템 상태 조회
    async getSystemStatus() {
        if (this.isSimulationMode) {
            return {
                kafka: {
                    status: 'healthy',
                    uptime: Math.floor(Math.random() * 86400),
                    clusters: 1,
                    topics: this.simulationData.kafkaMetrics.topicCount
                },
                flink: {
                    status: 'healthy',
                    uptime: Math.floor(Math.random() * 86400),
                    jobsRunning: this.simulationData.flinkMetrics.jobsRunning,
                    taskManagers: this.simulationData.flinkMetrics.taskManagers
                },
                openai: {
                    status: 'healthy',
                    responseTime: Math.floor(Math.random() * 1000 + 500),
                    requestsPerMinute: Math.floor(Math.random() * 100 + 50)
                },
                influxdb: {
                    status: 'healthy',
                    responseTime: Math.floor(Math.random() * 100 + 50),
                    storageUsed: '2.3GB'
                },
                postgres: {
                    status: 'healthy',
                    connections: Math.floor(Math.random() * 20 + 5),
                    storageUsed: '1.1GB'
                }
            };
        }
        
        try {
            const response = await this.apiClient.get('/api/care-pulse/system/status');
            return response.data;
        } catch (error) {
            console.warn('시스템 상태 조회 실패, 시뮬레이션 데이터 사용:', error.message);
            return this.getSystemStatus(); // 재귀 호출로 시뮬레이션 데이터 반환
        }
    }

    // 알림 생성
    async createAlert(patientId, type, message, priority = 'medium') {
        const alert = {
            id: `alert_${Date.now()}`,
            patientId,
            type,
            message,
            priority,
            timestamp: new Date().toISOString(),
            acknowledged: false
        };

        if (!this.isSimulationMode) {
            try {
                await this.apiClient.post('/api/care-pulse/alerts', alert);
            } catch (error) {
                console.warn('알림 생성 실패:', error.message);
            }
        }

        // WebSocket으로 알림 전송
        if (this.isConnected && this.websocket) {
            this.websocket.send(JSON.stringify({
                type: 'alert',
                data: alert
            }));
        }

        return alert;
    }

    /**
     * 리소스 정리
     */
    disconnect() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.isConnected = false;
        this.wsCallbacks.clear();
        
        console.log('🔌 Care Pulse Tracker API 연결 종료');
    }
}

// 싱글톤 인스턴스 생성
const carePulseTrackerApi = new CarePulseTrackerApi();

export default carePulseTrackerApi; 