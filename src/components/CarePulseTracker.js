import React, { useState, useEffect } from 'react';
import styles from './CarePulseTracker.module.css';
import { FaHeartbeat, FaChartLine, FaBrain, FaEye, FaPlay, FaPause, FaSync, FaExclamationTriangle, FaArrowLeft, FaUserMd, FaHospital, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RealTimeDetection from './RealTimeDetection';
import carePulseTrackerApi from '../api/carePulseTrackerApi';

const CarePulseTracker = () => {
    const navigate = useNavigate();
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedPatient, setSelectedPatient] = useState('patient_001');
    const [patients, setPatients] = useState([]);
    const [systemStatus, setSystemStatus] = useState(null);
    const [pipelineData, setPipelineData] = useState({
        detection: {
            sensors: [],
            vitals: {},
            timestamp: null,
            status: 'idle'
        },
        analysis: {
            kafkaMessages: 0,
            flinkProcessing: 0,
            patterns: [],
            status: 'idle'
        },
        interpretation: {
            aiAnalysis: null,
            insights: [],
            recommendations: [],
            status: 'idle'
        },
        prediction: {
            riskScore: 0,
            predictions: [],
            alerts: [],
            status: 'idle'
        }
    });

    // 컴포넌트 초기화 및 데이터 로드
    useEffect(() => {
        const initializeData = async () => {
            try {
                // 환자 목록 로드
                const patientList = await carePulseTrackerApi.getPatients();
                setPatients(patientList);
                
                // 시스템 상태 로드
                const status = await carePulseTrackerApi.getSystemStatus();
                setSystemStatus(status);
                
                // 메트릭 로드
                const kafkaMetrics = await carePulseTrackerApi.getKafkaMetrics();
                const flinkMetrics = await carePulseTrackerApi.getFlinkMetrics();
                
                setPipelineData(prev => ({
                    ...prev,
                    analysis: {
                        ...prev.analysis,
                        kafkaMessages: kafkaMetrics.messagesProcessed,
                        flinkProcessing: flinkMetrics.processingRate,
                        patterns: generatePatterns(),
                        status: 'idle'
                    }
                }));
                
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            }
        };
        
        initializeData();
    }, []);

    // 단계별 파이프라인 실행 시뮬레이션
    useEffect(() => {
        let interval;
        
        if (isRunning) {
            interval = setInterval(async () => {
                setCurrentStep(prev => (prev + 1) % 4);
                await updatePipelineData();
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, selectedPatient]);

    const updatePipelineData = async () => {
        try {
            // 1. 감지 단계 - 센서 데이터
            const sensorData = await carePulseTrackerApi.getSensorData(selectedPatient);
            
            // 2. 분석 단계 - Kafka/Flink 메트릭
            const kafkaMetrics = await carePulseTrackerApi.getKafkaMetrics();
            const flinkMetrics = await carePulseTrackerApi.getFlinkMetrics();
            
            // 3. 해석 단계 - AI 분석
            const aiAnalysis = await carePulseTrackerApi.analyzePatientData(selectedPatient);
            
            setPipelineData(prev => ({
                ...prev,
                detection: {
                    ...prev.detection,
                    sensors: sensorData ? [
                        { type: '심박수', value: sensorData.sensors.medicalDevices.heartRate || sensorData.sensors.wearableDevice.heartRate, unit: 'bpm', status: 'normal' },
                        { type: '혈압', value: `${sensorData.sensors.medicalDevices.bloodPressure.systolic}/${sensorData.sensors.medicalDevices.bloodPressure.diastolic}`, unit: 'mmHg', status: 'normal' },
                        { type: '체온', value: sensorData.sensors.medicalDevices.temperature, unit: '°C', status: 'normal' },
                        { type: '산소포화도', value: sensorData.sensors.medicalDevices.oxygenSaturation, unit: '%', status: 'normal' },
                        { type: '활동량', value: sensorData.sensors.wearableDevice.steps, unit: '걸음', status: 'normal' }
                    ] : [],
                    vitals: sensorData ? {
                        heartRate: sensorData.sensors.wearableDevice.heartRate,
                        bloodPressure: sensorData.sensors.medicalDevices.bloodPressure,
                        temperature: parseFloat(sensorData.sensors.medicalDevices.temperature),
                        oxygenSaturation: sensorData.sensors.medicalDevices.oxygenSaturation,
                        respiratoryRate: sensorData.sensors.medicalDevices.respiratoryRate
                    } : {},
                    timestamp: new Date(),
                    status: 'active'
                },
                analysis: {
                    ...prev.analysis,
                    kafkaMessages: kafkaMetrics.messagesProcessed,
                    flinkProcessing: flinkMetrics.processingRate,
                    patterns: generatePatterns(),
                    status: 'processing'
                },
                interpretation: {
                    ...prev.interpretation,
                    aiAnalysis: aiAnalysis ? {
                        summary: aiAnalysis.analysis.healthStatus.details,
                        confidence: Math.floor(aiAnalysis.confidence * 100),
                        keyFindings: aiAnalysis.analysis.insights.map(insight => insight.description)
                    } : null,
                    insights: aiAnalysis ? aiAnalysis.analysis.insights.map(insight => ({
                        type: insight.type,
                        message: insight.description,
                        priority: insight.impact === 'positive' ? 'low' : insight.impact === 'attention' ? 'medium' : 'high'
                    })) : [],
                    recommendations: aiAnalysis ? aiAnalysis.analysis.recommendations.map(rec => ({
                        action: rec.action,
                        reason: rec.reason,
                        priority: rec.priority
                    })) : [],
                    status: 'interpreting'
                },
                prediction: {
                    ...prev.prediction,
                    riskScore: aiAnalysis ? aiAnalysis.analysis.riskAssessment.score : 0,
                    predictions: aiAnalysis ? [
                        { type: '건강 위험도', prediction: aiAnalysis.analysis.riskAssessment.level, probability: aiAnalysis.analysis.riskAssessment.score, timeframe: '24시간' },
                        ...aiAnalysis.analysis.predictions.shortTerm.predictions.map(pred => ({
                            type: pred.metric,
                            prediction: pred.trend,
                            probability: Math.floor(pred.confidence * 100),
                            timeframe: '6시간'
                        }))
                    ] : [],
                    alerts: generateAlerts(),
                    status: 'predicting'
                }
            }));
            
        } catch (error) {
            console.error('파이프라인 데이터 업데이트 실패:', error);
        }
    };

    const generateSensorData = () => [
        { type: '심박수', value: Math.floor(Math.random() * 40) + 60, unit: 'bpm', status: 'normal' },
        { type: '혈압', value: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 70}`, unit: 'mmHg', status: 'normal' },
        { type: '체온', value: (Math.random() * 2 + 36).toFixed(1), unit: '°C', status: 'normal' },
        { type: '산소포화도', value: Math.floor(Math.random() * 5) + 95, unit: '%', status: 'normal' },
        { type: '활동량', value: Math.floor(Math.random() * 100), unit: '걸음', status: 'normal' }
    ];

    const generateVitalsData = () => ({
        heartRate: Math.floor(Math.random() * 40) + 60,
        bloodPressure: { systolic: Math.floor(Math.random() * 40) + 110, diastolic: Math.floor(Math.random() * 20) + 70 },
        temperature: (Math.random() * 2 + 36).toFixed(1),
        oxygenSaturation: Math.floor(Math.random() * 5) + 95,
        respiratoryRate: Math.floor(Math.random() * 10) + 12
    });

    const generatePatterns = () => [
        { type: '심박변이도', confidence: Math.floor(Math.random() * 30) + 70, trend: '안정' },
        { type: '수면패턴', confidence: Math.floor(Math.random() * 40) + 60, trend: '개선' },
        { type: '활동수준', confidence: Math.floor(Math.random() * 25) + 75, trend: '감소' },
        { type: '복약순응도', confidence: Math.floor(Math.random() * 20) + 80, trend: '안정' }
    ];

    const generateAIAnalysis = () => ({
        summary: "환자의 생체신호는 전반적으로 안정적이나, 심박변이도가 약간 감소하는 경향을 보입니다. 수면 패턴이 개선되고 있어 긍정적인 신호입니다.",
        confidence: Math.floor(Math.random() * 20) + 80,
        keyFindings: [
            "생체신호 안정적 유지",
            "수면 패턴 개선 관찰", 
            "심박변이도 약간 감소"
        ]
    });

    const generateInsights = () => [
        { type: '수면', message: '수면 시간이 점진적으로 개선되고 있습니다.', priority: 'low' },
        { type: '활동', message: '오후 시간대 활동량이 평소보다 낮습니다.', priority: 'medium' },
        { type: '복약', message: '처방된 약물이 효과적으로 작용하고 있습니다.', priority: 'low' }
    ];

    const generateRecommendations = () => [
        { action: '혈압 재측정 및 의료진 상담', reason: '혈압 수치 상승 관찰', priority: 'medium' },
        { action: '수분 섭취량 증가', reason: '체온 상승 및 탈수 위험', priority: 'high' },
        { action: '정기 건강 체크 유지', reason: '현재 상태 양호', priority: 'low' }
    ];

    const generatePredictions = () => [
        { type: '건강위험도', prediction: '낮음', probability: Math.floor(Math.random() * 30) + 70, timeframe: '24시간' },
        { type: '혈압변화', prediction: '안정', probability: Math.floor(Math.random() * 20) + 80, timeframe: '6시간' },
        { type: '활동수준', prediction: '증가', probability: Math.floor(Math.random() * 25) + 65, timeframe: '12시간' }
    ];

    const generateAlerts = () => {
        const alertTypes = ['info', 'warning'];
        return [
            { type: 'info', message: '정기 건강 체크 시간입니다.', timestamp: new Date() },
            { type: 'warning', message: '혈압 수치 확인이 필요합니다.', timestamp: new Date() }
        ].filter(() => Math.random() > 0.5);
    };

    const handleStart = async () => {
        setIsRunning(true);
        setCurrentStep(0);
        await updatePipelineData();
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setCurrentStep(0);
        setPipelineData({
            detection: { sensors: [], vitals: {}, timestamp: null, status: 'idle' },
            analysis: { kafkaMessages: 0, flinkProcessing: 0, patterns: [], status: 'idle' },
            interpretation: { aiAnalysis: null, insights: [], recommendations: [], status: 'idle' },
            prediction: { riskScore: 0, predictions: [], alerts: [], status: 'idle' }
        });
    };

    const handlePatientChange = (patientId) => {
        setSelectedPatient(patientId);
        if (isRunning) {
            updatePipelineData();
        }
    };

    const handleRealtimeDataUpdate = (data) => {
        setPipelineData(prev => ({
            ...prev,
            detection: {
                ...prev.detection,
                sensors: [
                    { type: '심박수', value: data.heartRate, unit: 'bpm', status: getVitalStatus('heartRate', data.heartRate) },
                    { type: '혈압', value: `${data.bloodPressure.systolic}/${data.bloodPressure.diastolic}`, unit: 'mmHg', status: 'normal' },
                    { type: '체온', value: data.temperature, unit: '°C', status: getVitalStatus('temperature', data.temperature) },
                    { type: '산소포화도', value: data.oxygenSaturation, unit: '%', status: getVitalStatus('oxygenSaturation', data.oxygenSaturation) },
                    { type: '호흡수', value: data.respiratoryRate, unit: '/분', status: 'normal' }
                ],
                vitals: data,
                timestamp: new Date(),
                status: 'active'
            }
        }));
    };

    const getVitalStatus = (type, value) => {
        switch (type) {
            case 'heartRate':
                return value > 100 || value < 60 ? 'warning' : 'normal';
            case 'temperature':
                return value > 37.5 ? 'warning' : 'normal';
            case 'oxygenSaturation':
                return value < 95 ? 'danger' : 'normal';
            default:
                return 'normal';
        }
    };

    const handleBack = () => {
        navigate('/caregiver/main');
    };

    const steps = [
        { id: 'detection', title: '실시간 감지', icon: FaHeartbeat, description: '생체신호 및 관련 데이터 수집' },
        { id: 'analysis', title: '통합 스트림 분석', icon: FaChartLine, description: '실시간 데이터 스트리밍 분석' },
        { id: 'interpretation', title: 'AI 해석', icon: FaBrain, description: '인공지능 기반 의료 해석' },
        { id: 'prediction', title: '예측 및 알림', icon: FaEye, description: '건강 상태 예측 및 알림 발생' }
    ];

    const getStatusText = (status) => {
        switch (status) {
            case 'healthy': return '정상';
            case 'warning': return '주의';
            case 'error': return '오류';
            case 'idle': return '대기중';
            case 'active': return '실행중';
            case 'processing': return '분석중';
            case 'interpreting': return '해석중';
            case 'predicting': return '예측중';
            default: return status;
        }
    };

    return (
        <div className={styles.carePulseTracker}>
            {/* 헤더 */}
            <div className={styles.trackerHeader}>
                <div className={styles.headerLeft}>
                    <button onClick={handleBack} className={styles.backBtn}>
                        <FaArrowLeft /> 뒤로가기
                    </button>
                    <div className={styles.headerContent}>
                        <h1>
                            <FaHeartbeat className={styles.headerIcon} />
                            케어펄스 트래커
                        </h1>
                        <p>생체신호 통합 모니터링 및 AI 건강 분석 시스템</p>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.patientSelector}>
                        <label htmlFor="patient-select">
                            <FaUserMd /> 환자 선택:
                        </label>
                        <select 
                            id="patient-select"
                            value={selectedPatient}
                            onChange={(e) => handlePatientChange(e.target.value)}
                            className={styles.patientSelect}
                        >
                            {patients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name} (방 {patient.room})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.headerControls}>
                        <button 
                            onClick={handleStart} 
                            disabled={isRunning}
                            className={`${styles.controlBtn} ${styles.startBtn}`}
                        >
                            <FaPlay /> 모니터링 시작
                        </button>
                        <button 
                            onClick={handleStop} 
                            disabled={!isRunning}
                            className={`${styles.controlBtn} ${styles.stopBtn}`}
                        >
                            <FaPause /> 일시정지
                        </button>
                        <button 
                            onClick={handleReset}
                            className={`${styles.controlBtn} ${styles.resetBtn}`}
                        >
                            <FaSync /> 초기화
                        </button>
                    </div>
                </div>
            </div>

            {/* 시스템 상태 */}
            {systemStatus && (
                <div className={styles.systemStatus}>
                    <h3>
                        <FaShieldAlt /> 시스템 상태 현황
                    </h3>
                    <div className={styles.statusGrid}>
                        <div className={styles.statusItem}>
                            <div className={styles.statusLabel}>메시지 스트리밍</div>
                            <div className={`${styles.statusValue} ${styles[systemStatus.kafka.status]}`}>
                                {getStatusText(systemStatus.kafka.status)}
                            </div>
                            <div className={styles.statusDetail}>
                                클러스터: {systemStatus.kafka.clusters}개, 토픽: {systemStatus.kafka.topics}개
                            </div>
                        </div>
                        <div className={styles.statusItem}>
                            <div className={styles.statusLabel}>실시간 분석 엔진</div>
                            <div className={`${styles.statusValue} ${styles[systemStatus.flink.status]}`}>
                                {getStatusText(systemStatus.flink.status)}
                            </div>
                            <div className={styles.statusDetail}>
                                실행 중인 작업: {systemStatus.flink.jobsRunning}개
                            </div>
                        </div>
                        <div className={styles.statusItem}>
                            <div className={styles.statusLabel}>AI 분석 서비스</div>
                            <div className={`${styles.statusValue} ${styles[systemStatus.openai.status]}`}>
                                {getStatusText(systemStatus.openai.status)}
                            </div>
                            <div className={styles.statusDetail}>
                                응답시간: {systemStatus.openai.responseTime}ms
                            </div>
                        </div>
                        {systemStatus.influxdb && (
                            <div className={styles.statusItem}>
                                <div className={styles.statusLabel}>데이터 저장소</div>
                                <div className={`${styles.statusValue} ${styles[systemStatus.influxdb.status]}`}>
                                    {getStatusText(systemStatus.influxdb.status)}
                                </div>
                                <div className={styles.statusDetail}>
                                    응답시간: {systemStatus.influxdb.responseTime}ms
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 파이프라인 시각화 */}
            <div className={styles.pipelineContainer}>
                <div className={styles.pipelineHeader}>
                    <h3>실시간 분석 파이프라인</h3>
                    <p>4단계 실시간 건강 모니터링 프로세스</p>
                </div>
                <div className={styles.pipelineFlow}>
                    {steps.map((step, index) => (
                        <div key={step.id} className={styles.pipelineStepContainer}>
                            <div className={`${styles.pipelineStep} ${currentStep === index ? styles.active : ''} ${styles[pipelineData[step.id].status]}`}>
                                <div className={styles.stepIcon}>
                                    <step.icon />
                                </div>
                                <div className={styles.stepInfo}>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                    <div className={styles.stepStatus}>
                                        상태: {getStatusText(pipelineData[step.id].status)}
                                    </div>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`${styles.pipelineArrow} ${currentStep > index ? styles.active : ''}`}>
                                    →
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 단계별 상세 정보 */}
            <div className={styles.pipelineDetails}>
                <div className={styles.detailsGrid}>
                    {/* 감지 단계 - 실시간 감지 컴포넌트 통합 */}
                    <div className={`${styles.detailCard} ${styles.detectionCard}`}>
                        <h3><FaHeartbeat /> 1단계: 실시간 생체신호 감지</h3>
                        {isRunning ? (
                            <RealTimeDetection 
                                patientId={selectedPatient}
                                onDataUpdate={handleRealtimeDataUpdate}
                            />
                        ) : (
                            <div className={styles.detectionInactive}>
                                <div className={styles.inactiveMessage}>
                                    <FaHeartbeat />
                                    <p>모니터링을 시작하여 실시간 생체신호 감지를 활성화하세요.</p>
                                </div>
                                <div className={styles.sensorData}>
                                    {pipelineData.detection.sensors.map((sensor, index) => (
                                        <div key={index} className={styles.sensorItem}>
                                            <span className={styles.sensorType}>{sensor.type}</span>
                                            <span className={styles.sensorValue}>{sensor.value} {sensor.unit}</span>
                                            <span className={`${styles.sensorStatus} ${styles[sensor.status]}`}>
                                                {sensor.status === 'normal' ? '정상' : sensor.status === 'warning' ? '주의' : '위험'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {pipelineData.detection.timestamp && (
                                    <div className={styles.timestamp}>
                                        마지막 업데이트: {pipelineData.detection.timestamp.toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 분석 단계 */}
                    <div className={`${styles.detailCard} ${styles.analysisCard}`}>
                        <h3><FaChartLine /> 2단계: 통합 스트림 분석</h3>
                        <div className={styles.analysisMetrics}>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>처리된 메시지</span>
                                <span className={styles.metricValue}>{pipelineData.analysis.kafkaMessages.toLocaleString()}개</span>
                            </div>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>분석 처리율</span>
                                <span className={styles.metricValue}>{pipelineData.analysis.flinkProcessing}%</span>
                            </div>
                        </div>
                        <div className={styles.patterns}>
                            <h4>패턴 분석 결과</h4>
                            {pipelineData.analysis.patterns.map((pattern, index) => (
                                <div key={index} className={styles.patternItem}>
                                    <span className={styles.patternType}>{pattern.type}</span>
                                    <span className={styles.patternConfidence}>신뢰도 {pattern.confidence}%</span>
                                    <span className={`${styles.patternTrend} ${styles[pattern.trend === '안정' ? 'stable' : pattern.trend === '개선' ? 'improving' : 'declining']}`}>
                                        {pattern.trend}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 해석 단계 */}
                    <div className={`${styles.detailCard} ${styles.interpretationCard}`}>
                        <h3><FaBrain /> 3단계: AI 의료진 해석</h3>
                        {pipelineData.interpretation.aiAnalysis ? (
                            <div className={styles.aiAnalysis}>
                                <div className={styles.aiSummary}>
                                    <h4>AI 분석 요약</h4>
                                    <p>{pipelineData.interpretation.aiAnalysis.summary}</p>
                                    <div className={styles.confidenceScore}>
                                        <FaShieldAlt />
                                        분석 신뢰도: {pipelineData.interpretation.aiAnalysis.confidence}%
                                    </div>
                                </div>
                                <div className={styles.insights}>
                                    <h4>주요 의료진 소견</h4>
                                    {pipelineData.interpretation.insights.map((insight, index) => (
                                        <div key={index} className={`${styles.insightItem} ${styles[insight.priority]}`}>
                                            <span className={styles.insightType}>{insight.type}</span>
                                            <span className={styles.insightMessage}>{insight.message}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.recommendations}>
                                    <h4>권장 조치사항</h4>
                                    {pipelineData.interpretation.recommendations.map((rec, index) => (
                                        <div key={index} className={`${styles.recommendationItem} ${styles[rec.priority]}`}>
                                            <span className={styles.recAction}>{rec.action}</span>
                                            <span className={styles.recReason}>{rec.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.inactiveMessage}>
                                <FaBrain />
                                <p>AI 분석이 진행 중입니다. 잠시만 기다려주세요.</p>
                            </div>
                        )}
                    </div>

                    {/* 예측 단계 */}
                    <div className={`${styles.detailCard} ${styles.predictionCard}`}>
                        <h3><FaEye /> 4단계: 건강 상태 예측 및 알림</h3>
                        <div className={styles.riskScore}>
                            <div className={styles.riskGauge}>
                                <div className={styles.gaugeLabel}>위험도 평가</div>
                                <div className={styles.gaugeValue}>{pipelineData.prediction.riskScore}%</div>
                                <div className={styles.gaugeStatus}>
                                    {pipelineData.prediction.riskScore < 30 ? '낮음' : 
                                     pipelineData.prediction.riskScore < 70 ? '보통' : '높음'}
                                </div>
                            </div>
                        </div>
                        <div className={styles.predictions}>
                            <h4>건강 상태 예측</h4>
                            {pipelineData.prediction.predictions.map((pred, index) => (
                                <div key={index} className={styles.predictionItem}>
                                    <span className={styles.predType}>{pred.type}</span>
                                    <span className={styles.predResult}>
                                        {pred.prediction === 'low' ? '낮음' :
                                         pred.prediction === 'medium' ? '보통' :
                                         pred.prediction === 'high' ? '높음' :
                                         pred.prediction === 'stable' ? '안정' :
                                         pred.prediction === 'slightly_increasing' ? '약간 상승' :
                                         pred.prediction === 'improving' ? '개선' :
                                         pred.prediction === 'increasing' ? '증가' : pred.prediction}
                                    </span>
                                    <span className={styles.predProbability}>확률 {pred.probability}%</span>
                                    <span className={styles.predTimeframe}>{pred.timeframe}</span>
                                </div>
                            ))}
                        </div>
                        {pipelineData.prediction.alerts.length > 0 && (
                            <div className={styles.alerts}>
                                <h4>실시간 알림</h4>
                                {pipelineData.prediction.alerts.map((alert, index) => (
                                    <div key={index} className={`${styles.alertItem} ${styles[alert.type]}`}>
                                        <FaExclamationTriangle />
                                        <span className={styles.alertMessage}>{alert.message}</span>
                                        <span className={styles.alertTime}>{alert.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarePulseTracker; 