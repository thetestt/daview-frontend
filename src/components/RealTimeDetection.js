import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaThermometerHalf, FaLungs, FaTint, FaWifi, FaBatteryFull, FaWalking } from 'react-icons/fa';
import './RealTimeDetection.module.css';

const RealTimeDetection = ({ patientId, onDataUpdate }) => {
    const [sensorData, setSensorData] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [lastUpdate, setLastUpdate] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // 실시간 데이터 시뮬레이션
        const interval = setInterval(() => {
            const newData = generateRealtimeData();
            setSensorData(newData);
            setLastUpdate(new Date());
            setConnectionStatus('connected');
            
            // 상위 컴포넌트로 데이터 전달
            if (onDataUpdate) {
                onDataUpdate(newData);
            }

            // 알림 체크
            checkAlerts(newData);
        }, 2000);

        return () => clearInterval(interval);
    }, [patientId, onDataUpdate]);

    const generateRealtimeData = () => {
        const baseHeartRate = 70 + (Math.random() - 0.5) * 20;
        const baseBloodPressure = {
            systolic: 120 + (Math.random() - 0.5) * 30,
            diastolic: 80 + (Math.random() - 0.5) * 20
        };
        const baseTemperature = 36.5 + (Math.random() - 0.5) * 2;
        const baseOxygenSaturation = 98 + (Math.random() - 0.5) * 4;
        const baseRespiratoryRate = 16 + (Math.random() - 0.5) * 6;

        return {
            timestamp: new Date().toISOString(),
            patientId: patientId || 'patient_001',
            vitals: {
                heartRate: Math.round(Math.max(50, Math.min(120, baseHeartRate))),
                bloodPressure: {
                    systolic: Math.round(Math.max(90, Math.min(180, baseBloodPressure.systolic))),
                    diastolic: Math.round(Math.max(60, Math.min(110, baseBloodPressure.diastolic)))
                },
                temperature: Math.max(35.0, Math.min(39.0, baseTemperature)).toFixed(1),
                oxygenSaturation: Math.round(Math.max(90, Math.min(100, baseOxygenSaturation))),
                respiratoryRate: Math.round(Math.max(10, Math.min(25, baseRespiratoryRate)))
            },
            sensors: {
                wearableDevice: {
                    heartRate: Math.round(baseHeartRate),
                    steps: Math.floor(Math.random() * 100),
                    activity: Math.random() > 0.7 ? 'active' : 'rest',
                    batteryLevel: Math.floor(Math.random() * 40 + 60)
                },
                environmentalSensors: {
                    roomTemperature: (Math.random() * 4 + 20).toFixed(1),
                    humidity: Math.floor(Math.random() * 30 + 40),
                    lightLevel: Math.floor(Math.random() * 100),
                    noiseLevel: Math.floor(Math.random() * 60 + 30)
                },
                medicalDevices: {
                    bloodPressure: {
                        systolic: Math.round(baseBloodPressure.systolic),
                        diastolic: Math.round(baseBloodPressure.diastolic)
                    },
                    oxygenSaturation: Math.round(baseOxygenSaturation),
                    temperature: baseTemperature.toFixed(1),
                    respiratoryRate: Math.round(baseRespiratoryRate)
                }
            },
            dataQuality: {
                accuracy: Math.random() * 0.1 + 0.9,
                completeness: Math.random() * 0.1 + 0.9,
                timeliness: Math.random() * 0.1 + 0.9
            }
        };
    };

    const checkAlerts = (data) => {
        const newAlerts = [];
        
        if (data.vitals.heartRate > 100) {
            newAlerts.push({
                type: 'warning',
                message: '심박수가 정상 범위를 초과했습니다',
                value: data.vitals.heartRate,
                timestamp: new Date()
            });
        }
        
        if (data.vitals.heartRate < 60) {
            newAlerts.push({
                type: 'warning',
                message: '심박수가 정상 범위 아래입니다',
                value: data.vitals.heartRate,
                timestamp: new Date()
            });
        }
        
        if (data.vitals.bloodPressure.systolic > 140) {
            newAlerts.push({
                type: 'danger',
                message: '수축기 혈압이 높습니다',
                value: data.vitals.bloodPressure.systolic,
                timestamp: new Date()
            });
        }
        
        if (data.vitals.temperature > 37.5) {
            newAlerts.push({
                type: 'warning',
                message: '체온이 상승했습니다',
                value: data.vitals.temperature,
                timestamp: new Date()
            });
        }
        
        if (data.vitals.oxygenSaturation < 95) {
            newAlerts.push({
                type: 'danger',
                message: '산소포화도가 낮습니다',
                value: data.vitals.oxygenSaturation,
                timestamp: new Date()
            });
        }

        if (newAlerts.length > 0) {
            setAlerts(prev => [...newAlerts, ...prev.slice(0, 4)]);
        }
    };

    const getStatusColor = (vital, value) => {
        switch (vital) {
            case 'heartRate':
                if (value < 60 || value > 100) return 'warning';
                return 'normal';
            case 'bloodPressure':
                if (value.systolic > 140 || value.diastolic > 90) return 'warning';
                return 'normal';
            case 'temperature':
                if (value > 37.5) return 'warning';
                return 'normal';
            case 'oxygenSaturation':
                if (value < 95) return 'danger';
                return 'normal';
            case 'respiratoryRate':
                if (value < 12 || value > 20) return 'warning';
                return 'normal';
            default:
                return 'normal';
        }
    };

    const getDataQualityColor = (quality) => {
        if (quality >= 0.9) return 'excellent';
        if (quality >= 0.8) return 'good';
        if (quality >= 0.7) return 'fair';
        return 'poor';
    };

    if (!sensorData) {
        return (
            <div className="realtime-detection loading">
                <div className="loading-spinner">
                    <FaHeartbeat className="pulse-icon" />
                    <p>관련 데이터 연결 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="realtime-detection">
            {/* 연결 상태 헤더 */}
            <div className="connection-header">
                <div className="connection-status">
                    <FaWifi className={`connection-icon ${connectionStatus}`} />
                    <span className={`status-text ${connectionStatus}`}>
                        {connectionStatus === 'connected' ? '연결됨' : '연결 끊김'}
                    </span>
                </div>
                <div className="last-update">
                    마지막 업데이트: {lastUpdate?.toLocaleTimeString()}
                </div>
            </div>

            {/* 주요 생체신호 카드 */}
            <div className="vital-cards">
                <div className={`vital-card ${getStatusColor('heartRate', sensorData.vitals.heartRate)}`}>
                    <div className="vital-icon">
                        <FaHeartbeat />
                    </div>
                    <div className="vital-info">
                        <div className="vital-label">심박수</div>
                        <div className="vital-value">{sensorData.vitals.heartRate}</div>
                        <div className="vital-unit">bpm</div>
                    </div>
                    <div className="vital-trend">
                        <div className="trend-line">
                            {/* 간단한 트렌드 표시 */}
                            <div className="trend-point"></div>
                            <div className="trend-point"></div>
                            <div className="trend-point active"></div>
                        </div>
                    </div>
                </div>

                <div className={`vital-card ${getStatusColor('bloodPressure', sensorData.vitals.bloodPressure)}`}>
                    <div className="vital-icon">
                        <FaTint />
                    </div>
                    <div className="vital-info">
                        <div className="vital-label">혈압</div>
                        <div className="vital-value">
                            {sensorData.vitals.bloodPressure.systolic}/{sensorData.vitals.bloodPressure.diastolic}
                        </div>
                        <div className="vital-unit">mmHg</div>
                    </div>
                </div>

                <div className={`vital-card ${getStatusColor('temperature', parseFloat(sensorData.vitals.temperature))}`}>
                    <div className="vital-icon">
                        <FaThermometerHalf />
                    </div>
                    <div className="vital-info">
                        <div className="vital-label">체온</div>
                        <div className="vital-value">{sensorData.vitals.temperature}</div>
                        <div className="vital-unit">°C</div>
                    </div>
                </div>

                <div className={`vital-card ${getStatusColor('oxygenSaturation', sensorData.vitals.oxygenSaturation)}`}>
                    <div className="vital-icon">
                        <FaLungs />
                    </div>
                    <div className="vital-info">
                        <div className="vital-label">SpO2</div>
                        <div className="vital-value">{sensorData.vitals.oxygenSaturation}</div>
                        <div className="vital-unit">%</div>
                    </div>
                </div>

                <div className={`vital-card ${getStatusColor('respiratoryRate', sensorData.vitals.respiratoryRate)}`}>
                    <div className="vital-icon">
                        <FaLungs />
                    </div>
                    <div className="vital-info">
                        <div className="vital-label">호흡수</div>
                        <div className="vital-value">{sensorData.vitals.respiratoryRate}</div>
                        <div className="vital-unit">bpm</div>
                    </div>
                </div>
            </div>

            {/* 센서 상태 */}
            <div className="sensor-status">
                <h4>센서 상태</h4>
                <div className="sensor-grid">
                    <div className="sensor-item">
                        <div className="sensor-label">
                            <FaWalking />
                            웨어러블 기기
                        </div>
                        <div className="sensor-details">
                            <div className="sensor-value">
                                활동: {sensorData.sensors.wearableDevice.activity === 'active' ? '활동중' : '휴식'}
                            </div>
                            <div className="sensor-value">
                                걸음수: {sensorData.sensors.wearableDevice.steps}
                            </div>
                            <div className="sensor-battery">
                                <FaBatteryFull />
                                {sensorData.sensors.wearableDevice.batteryLevel}%
                            </div>
                        </div>
                    </div>

                    <div className="sensor-item">
                        <div className="sensor-label">환경 센서</div>
                        <div className="sensor-details">
                            <div className="sensor-value">
                                실내온도: {sensorData.sensors.environmentalSensors.roomTemperature}°C
                            </div>
                            <div className="sensor-value">
                                습도: {sensorData.sensors.environmentalSensors.humidity}%
                            </div>
                            <div className="sensor-value">
                                소음: {sensorData.sensors.environmentalSensors.noiseLevel}dB
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 데이터 품질 */}
            <div className="data-quality">
                <h4>데이터 품질</h4>
                <div className="quality-metrics">
                    <div className="quality-item">
                        <div className="quality-label">정확도</div>
                        <div className={`quality-value ${getDataQualityColor(sensorData.dataQuality.accuracy)}`}>
                            {(sensorData.dataQuality.accuracy * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div className="quality-item">
                        <div className="quality-label">완전성</div>
                        <div className={`quality-value ${getDataQualityColor(sensorData.dataQuality.completeness)}`}>
                            {(sensorData.dataQuality.completeness * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div className="quality-item">
                        <div className="quality-label">적시성</div>
                        <div className={`quality-value ${getDataQualityColor(sensorData.dataQuality.timeliness)}`}>
                            {(sensorData.dataQuality.timeliness * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* 실시간 알림 */}
            {alerts.length > 0 && (
                <div className="realtime-alerts">
                    <h4>실시간 알림</h4>
                    <div className="alerts-list">
                        {alerts.map((alert, index) => (
                            <div key={index} className={`alert-item ${alert.type}`}>
                                <div className="alert-message">{alert.message}</div>
                                <div className="alert-value">값: {alert.value}</div>
                                <div className="alert-time">
                                    {alert.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealTimeDetection; 