import React, { useRef, useEffect, useState } from 'react';

/**
 * 숲: Care Pulse 시각화를 위한 Canvas 기반 차트 컴포넌트
 * 나무: 실시간 이상 점수를 sparkline으로 표시하여 트렌드 시각화
 */
const PulseChart = ({ 
    data = [], 
    width = 300, 
    height = 100, 
    threshold = 0.7,
    showThreshold = true,
    animate = true,
    className = '' 
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [currentData, setCurrentData] = useState([]);

    /**
     * 숲: 차트 렌더링 메인 함수
     * 나무: Canvas 2D 컨텍스트로 실시간 펄스 차트 그리기
     */
    const drawChart = (ctx, chartData, animationProgress = 1) => {
        // 숲: 캔버스 초기화
        ctx.clearRect(0, 0, width, height);
        
        if (chartData.length === 0) {
            drawEmptyState(ctx);
            return;
        }

        // 숲: 차트 영역 설정
        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // 숲: 데이터 정규화
        const maxValue = Math.max(...chartData.map(d => d.value), 1.0);
        const minValue = Math.min(...chartData.map(d => d.value), 0.0);
        const valueRange = maxValue - minValue || 1;

        // 숲: 배경 그리드 그리기
        drawGrid(ctx, padding, chartWidth, chartHeight);
        
        // 숲: 임계값 라인 그리기
        if (showThreshold) {
            drawThresholdLine(ctx, threshold, minValue, valueRange, padding, chartWidth, chartHeight);
        }
        
        // 숲: 데이터 포인트와 라인 그리기
        drawDataLine(ctx, chartData, minValue, valueRange, padding, chartWidth, chartHeight, animationProgress);
        
        // 숲: 위험 구간 하이라이트
        drawRiskAreas(ctx, chartData, threshold, minValue, valueRange, padding, chartWidth, chartHeight, animationProgress);
    };

    /**
     * 숲: 빈 상태 표시
     * 나무: 데이터가 없을 때 안내 메시지 표시
     */
    const drawEmptyState = (ctx) => {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('데이터 수집 중...', width / 2, height / 2);
    };

    /**
     * 숲: 배경 그리드 그리기
     * 나무: 차트 가독성을 위한 격자 배경
     */
    const drawGrid = (ctx, padding, chartWidth, chartHeight) => {
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        
        // 숲: 수직 그리드 라인 (시간 축)
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const x = padding + (chartWidth / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
        
        // 숲: 수평 그리드 라인 (값 축)
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
    };

    /**
     * 숲: 임계값 라인 그리기
     * 나무: 이상 징후 임계값을 빨간 점선으로 표시
     */
    const drawThresholdLine = (ctx, threshold, minValue, valueRange, padding, chartWidth, chartHeight) => {
        const y = padding + chartHeight - ((threshold - minValue) / valueRange) * chartHeight;
        
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
        
        ctx.setLineDash([]);
        
        // 숲: 임계값 레이블
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`위험: ${threshold}`, padding + chartWidth - 5, y - 5);
    };

    /**
     * 숲: 데이터 라인 그리기
     * 나무: 실제 펄스 데이터를 연결한 라인 차트
     */
    const drawDataLine = (ctx, chartData, minValue, valueRange, padding, chartWidth, chartHeight, animationProgress) => {
        if (chartData.length < 2) return;
        
        const pointsToShow = Math.floor(chartData.length * animationProgress);
        if (pointsToShow < 2) return;
        
        // 숲: 그라데이션 생성 (정상-경고-위험)
        const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
        gradient.addColorStop(0, '#ef4444'); // 위험 (빨강)
        gradient.addColorStop(0.3, '#f59e0b'); // 경고 (주황)
        gradient.addColorStop(1, '#10b981'); // 정상 (초록)
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        
        for (let i = 0; i < pointsToShow; i++) {
            const x = padding + (chartWidth / (chartData.length - 1)) * i;
            const y = padding + chartHeight - ((chartData[i].value - minValue) / valueRange) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // 숲: 데이터 포인트 그리기
        drawDataPoints(ctx, chartData.slice(0, pointsToShow), minValue, valueRange, padding, chartWidth, chartHeight);
    };

    /**
     * 숲: 데이터 포인트 그리기
     * 나무: 각 데이터 포인트를 원으로 표시
     */
    const drawDataPoints = (ctx, chartData, minValue, valueRange, padding, chartWidth, chartHeight) => {
        chartData.forEach((point, i) => {
            const x = padding + (chartWidth / (chartData.length - 1)) * i;
            const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
            
            // 숲: 포인트 색상 결정 (값에 따라)
            let pointColor = '#10b981'; // 정상
            if (point.value > 0.8) {
                pointColor = '#ef4444'; // 위험
            } else if (point.value > 0.6) {
                pointColor = '#f59e0b'; // 경고
            }
            
            ctx.fillStyle = pointColor;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // 숲: 포인트 테두리
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    };

    /**
     * 숲: 위험 구간 하이라이트
     * 나무: 임계값을 초과한 구간을 반투명 빨간색으로 강조
     */
    const drawRiskAreas = (ctx, chartData, threshold, minValue, valueRange, padding, chartWidth, chartHeight, animationProgress) => {
        const pointsToShow = Math.floor(chartData.length * animationProgress);
        let inRiskArea = false;
        let riskAreaStart = 0;
        
        for (let i = 0; i < pointsToShow; i++) {
            const isRisk = chartData[i].value > threshold;
            const x = padding + (chartWidth / (chartData.length - 1)) * i;
            
            if (isRisk && !inRiskArea) {
                // 숲: 위험 구간 시작
                inRiskArea = true;
                riskAreaStart = x;
            } else if (!isRisk && inRiskArea) {
                // 숲: 위험 구간 종료
                drawRiskArea(ctx, riskAreaStart, x, padding, chartHeight);
                inRiskArea = false;
            }
        }
        
        // 숲: 마지막이 위험 구간인 경우
        if (inRiskArea) {
            const endX = padding + (chartWidth / (chartData.length - 1)) * (pointsToShow - 1);
            drawRiskArea(ctx, riskAreaStart, endX, padding, chartHeight);
        }
    };

    /**
     * 숲: 위험 구간 그리기
     * 나무: 지정된 영역을 반투명 빨간색으로 채우기
     */
    const drawRiskArea = (ctx, startX, endX, padding, chartHeight) => {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fillRect(startX, padding, endX - startX, chartHeight);
    };

    /**
     * 숲: 애니메이션 효과
     * 나무: 데이터 변경 시 부드러운 전환 애니메이션
     */
    useEffect(() => {
        if (!animate) {
            setCurrentData(data);
            return;
        }
        
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        
        const startTime = Date.now();
        const duration = 1000; // 1초 애니메이션
        
        const animateData = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 숲: easeOutCubic 이징 함수
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                drawChart(ctx, data, easedProgress);
            }
            
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animateData);
            } else {
                setCurrentData(data);
            }
        };
        
        animateData();
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [data, animate]);

    /**
     * 숲: 정적 렌더링 (애니메이션 없음)
     * 나무: 애니메이션이 비활성화된 경우 즉시 렌더링
     */
    useEffect(() => {
        if (!animate) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                drawChart(ctx, data, 1);
            }
        }
    }, [currentData, width, height, threshold, showThreshold, animate]);

    /**
     * 숲: 마우스 호버 시 툴팁 표시
     * 나무: 데이터 포인트에 마우스 오버 시 상세 정보 표시
     */
    const handleMouseMove = (event) => {
        const canvas = canvasRef.current;
        if (!canvas || data.length === 0) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 숲: 가장 가까운 데이터 포인트 찾기
        const padding = 20;
        const chartWidth = width - padding * 2;
        const pointIndex = Math.round(((x - padding) / chartWidth) * (data.length - 1));
        
        if (pointIndex >= 0 && pointIndex < data.length) {
            const point = data[pointIndex];
            canvas.title = `시간: ${point.timestamp || '알 수 없음'}\n값: ${point.value.toFixed(3)}\n상태: ${point.value > threshold ? '위험' : '정상'}`;
        }
    };

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onMouseMove={handleMouseMove}
                className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-crosshair"
                style={{ display: 'block' }}
            />
            
            {/* 숲: 차트 범례 */}
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span>정상 (0-0.6)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                        <span>경고 (0.6-0.8)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                        <span>위험 (0.8+)</span>
                    </div>
                </div>
                <span className="text-gray-400">{data.length}개 데이터 포인트</span>
            </div>
        </div>
    );
};

export default PulseChart; 