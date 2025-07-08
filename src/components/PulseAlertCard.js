import React, { useState } from 'react';

/**
 * 숲: Care Pulse 알림 표시를 위한 카드 컴포넌트
 * 나무: 개별 알림의 상세 정보와 액션 버튼을 포함한 UI
 */
const PulseAlertCard = ({ 
    alert, 
    onAcknowledge, 
    onResolve, 
    showActions = true,
    compact = false,
    className = '' 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [responseNotes, setResponseNotes] = useState('');
    const [showResolveModal, setShowResolveModal] = useState(false);

    /**
     * 숲: 심각도에 따른 스타일링
     * 나무: LOW, MEDIUM, HIGH, CRITICAL에 따른 색상 및 아이콘 결정
     */
    const getSeverityConfig = (severity) => {
        const configs = {
            LOW: {
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-800',
                iconColor: 'text-blue-500',
                icon: '🔵',
                label: '낮음'
            },
            MEDIUM: {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                textColor: 'text-yellow-800',
                iconColor: 'text-yellow-500',
                icon: '🟡',
                label: '보통'
            },
            HIGH: {
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200',
                textColor: 'text-orange-800',
                iconColor: 'text-orange-500',
                icon: '🟠',
                label: '높음'
            },
            CRITICAL: {
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-800',
                iconColor: 'text-red-500',
                icon: '🔴',
                label: '긴급'
            }
        };
        
        return configs[severity] || configs.MEDIUM;
    };

    /**
     * 숲: 알림 상태에 따른 스타일링
     * 나무: PENDING, ACKNOWLEDGED, RESOLVED에 따른 시각적 표시
     */
    const getStatusConfig = (status) => {
        const configs = {
            PENDING: {
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                label: '미처리',
                pulse: true
            },
            ACKNOWLEDGED: {
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                label: '확인됨',
                pulse: false
            },
            RESOLVED: {
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                label: '해결됨',
                pulse: false
            }
        };
        
        return configs[status] || configs.PENDING;
    };

    /**
     * 숲: 시간 포맷팅
     * 나무: ISO 문자열을 사용자 친화적 시간으로 변환
     */
    const formatTime = (isoString) => {
        if (!isoString) return '알 수 없음';
        
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        
        if (diffMin < 1) return '방금 전';
        if (diffMin < 60) return `${diffMin}분 전`;
        if (diffMin < 1440) return `${Math.floor(diffMin / 60)}시간 전`;
        
        return date.toLocaleDateString('ko-KR', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    /**
     * 숲: 알림 확인 처리
     * 나무: 사용자가 알림을 확인했을 때 서버에 상태 업데이트
     */
    const handleAcknowledge = async () => {
        if (!onAcknowledge || alert.status !== 'PENDING') return;
        
        setIsProcessing(true);
        try {
            await onAcknowledge(alert.alertId);
        } catch (error) {
            console.error('Error acknowledging alert:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * 숲: 알림 해결 처리
     * 나무: 사용자가 조치를 완료했을 때 해결 상태로 변경
     */
    const handleResolve = async () => {
        if (!onResolve) return;
        
        setIsProcessing(true);
        try {
            await onResolve(alert.alertId, responseNotes);
            setShowResolveModal(false);
            setResponseNotes('');
        } catch (error) {
            console.error('Error resolving alert:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const severityConfig = getSeverityConfig(alert.severity);
    const statusConfig = getStatusConfig(alert.status);

    if (compact) {
        return (
            <div className={`p-3 border-l-4 ${severityConfig.borderColor} ${severityConfig.bgColor} ${className}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg">{severityConfig.icon}</span>
                        <div>
                            <p className={`text-sm font-medium ${severityConfig.textColor}`}>
                                {alert.interpretation || '이상 징후가 감지되었습니다.'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatTime(alert.timestamp)} • 점수: {(alert.anomalyScore || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        {statusConfig.label}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow ${severityConfig.bgColor} ${severityConfig.borderColor} ${className}`}>
            {/* 숲: 카드 헤더 */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">{severityConfig.icon}</span>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className={`text-lg font-semibold ${severityConfig.textColor}`}>
                                    {severityConfig.label} 수준 알림
                                </h3>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                                    {statusConfig.label}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                {formatTime(alert.timestamp)} • 이상 점수: {(alert.anomalyScore || 0).toFixed(3)}
                            </p>
                        </div>
                    </div>
                    
                    {/* 숲: 위험도 표시 */}
                    {alert.riskScore && (
                        <div className="text-right">
                            <p className="text-sm text-gray-600">24시간 위험도</p>
                            <p className={`text-lg font-bold ${alert.riskScore >= 0.8 ? 'text-red-600' : alert.riskScore >= 0.6 ? 'text-orange-600' : 'text-green-600'}`}>
                                {(alert.riskScore * 100).toFixed(1)}%
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 숲: 카드 본문 */}
            <div className="p-4">
                {/* 숲: 해석 내용 */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">상황 해석</h4>
                    <p className="text-gray-800 leading-relaxed">
                        {alert.interpretation || '시스템이 이상 징후를 감지했습니다. 전문가 확인이 필요합니다.'}
                    </p>
                </div>

                {/* 숲: 추정 원인 */}
                {alert.possibleCauses && alert.possibleCauses.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">추정 원인</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            {alert.possibleCauses.map((cause, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-gray-400 mr-2">•</span>
                                    <span>{cause}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 숲: 권장 조치사항 */}
                {alert.recommendations && alert.recommendations.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">권장 조치</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            {alert.recommendations.map((recommendation, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>{recommendation}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 숲: 상세 정보 토글 */}
                {(alert.triggerData || alert.relatedTasks) && (
                    <div className="mb-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            {isExpanded ? '상세 정보 숨기기' : '상세 정보 보기'} 
                            <span className={`ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        
                        {isExpanded && (
                            <div className="mt-3 p-3 bg-gray-50 rounded border text-xs">
                                <pre className="whitespace-pre-wrap text-gray-600 overflow-x-auto">
                                    {JSON.stringify({
                                        triggerData: alert.triggerData,
                                        relatedTasks: alert.relatedTasks
                                    }, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* 숲: 응답 메모 표시 */}
                {alert.responseNotes && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                        <h4 className="text-sm font-medium text-green-800 mb-1">처리 내용</h4>
                        <p className="text-sm text-green-700">{alert.responseNotes}</p>
                        {alert.acknowledgedBy && (
                            <p className="text-xs text-green-600 mt-1">
                                처리자: {alert.acknowledgedBy} • {formatTime(alert.acknowledgedAt)}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 숲: 액션 버튼 */}
            {showActions && alert.status !== 'RESOLVED' && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
                    {alert.status === 'PENDING' && (
                        <button
                            onClick={handleAcknowledge}
                            disabled={isProcessing}
                            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? '처리 중...' : '확인'}
                        </button>
                    )}
                    
                    {alert.status === 'ACKNOWLEDGED' && (
                        <button
                            onClick={() => setShowResolveModal(true)}
                            disabled={isProcessing}
                            className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors disabled:opacity-50"
                        >
                            해결 완료
                        </button>
                    )}
                </div>
            )}

            {/* 숲: 해결 완료 모달 */}
            {showResolveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">알림 해결 완료</h3>
                        <p className="text-gray-600 mb-4">
                            이 알림에 대한 조치를 완료하셨나요? 처리 내용을 간단히 기록해 주세요.
                        </p>
                        
                        <textarea
                            value={responseNotes}
                            onChange={(e) => setResponseNotes(e.target.value)}
                            placeholder="처리 내용을 입력해 주세요... (선택사항)"
                            className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 text-sm"
                        />
                        
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowResolveModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleResolve}
                                disabled={isProcessing}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? '처리 중...' : '해결 완료'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PulseAlertCard; 