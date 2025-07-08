# Care Pulse Tracker 설정 가이드

## 📋 개요

Care Pulse Tracker는 **React + Spring Boot 3 + Kafka + Flink 2 + OpenAI LLM**을 사용하여 구축된 실시간 생체신호 모니터링 및 분석 시스템입니다.

## 🚀 Docker Compose 인프라 구성

### 포함된 서비스들

| 서비스 | 포트 | 용도 |
|--------|------|------|
| **Apache Flink** | 8081 | 실시간 스트리밍 데이터 처리 |
| **Kafka** | 9092 | 메시지 스트리밍 및 이벤트 처리 |
| **InfluxDB** | 8086 | 시계열 데이터 저장 (생체신호) |
| **PostgreSQL** | 5432 | 관계형 데이터 저장 |
| **MinIO** | 9000, 9001 | 객체 스토리지 (파일, 모델) |
| **Redis** | 6379 | 캐싱 및 세션 관리 |
| **MongoDB** | 27017 | 문서 데이터베이스 |
| **Elasticsearch** | 9200 | 로그 검색 및 분석 |
| **Kibana** | 5601 | 로그 시각화 |
| **Grafana** | 3001 | 메트릭 대시보드 |
| **Prometheus** | 9090 | 메트릭 수집 |
| **Jaeger** | 16686 | 분산 트레이싱 |
| **Kafka UI** | 8080 | Kafka 관리 UI |

### 🛠️ 설치 및 실행

1. **Docker Compose 실행**
   ```bash
   # 전체 인프라 시작
   docker-compose up -d
   
   # 특정 서비스만 시작
   docker-compose up -d kafka flink-jobmanager flink-taskmanager influxdb postgres
   
   # 서비스 상태 확인
   docker-compose ps
   ```

2. **서비스 상태 확인**
   ```bash
   # 로그 확인
   docker-compose logs -f flink-jobmanager
   docker-compose logs -f kafka
   docker-compose logs -f influxdb
   
   # 개별 서비스 재시작
   docker-compose restart flink-jobmanager
   ```

3. **인프라 정리**
   ```bash
   # 서비스 중지
   docker-compose down
   
   # 데이터 볼륨까지 삭제
   docker-compose down -v
   ```

## ⚙️ 환경 변수 설정

### .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 설정을 추가하세요:

```env
# ===== 개발/프로덕션 모드 설정 =====
NODE_ENV=development
# development: 시뮬레이션 모드 (기본값)
# production: 실제 인프라 연결 모드

# ===== Care Pulse Tracker API 설정 =====
REACT_APP_CARE_PULSE_API_URL=http://localhost:8080

# ===== 인프라 서비스 URL 설정 =====
REACT_APP_FLINK_URL=http://localhost:8081
REACT_APP_KAFKA_REST_URL=http://localhost:8082
REACT_APP_INFLUXDB_URL=http://localhost:8086
REACT_APP_POSTGRES_URL=http://localhost:5432

# ===== InfluxDB 설정 =====
REACT_APP_INFLUXDB_ORG=care-pulse
REACT_APP_INFLUXDB_BUCKET=vital-signs
REACT_APP_INFLUXDB_TOKEN=care-pulse-token-123456789

# ===== OpenAI LLM 설정 =====
REACT_APP_OPENAI_API_KEY=your-openai-api-key-here
REACT_APP_OPENAI_MODEL=gpt-4-turbo

# ===== 기타 설정 =====
REACT_APP_DEBUG_MODE=true
REACT_APP_LOG_LEVEL=info
REACT_APP_DATA_REFRESH_INTERVAL=5000
```

### 환경별 설정

#### 개발 환경 (시뮬레이션 모드)
```env
NODE_ENV=development
# 또는 REACT_APP_CARE_PULSE_API_URL을 설정하지 않음
```

#### 프로덕션 환경 (실제 인프라 연결)
```env
NODE_ENV=production
REACT_APP_CARE_PULSE_API_URL=http://your-backend-server:8080
REACT_APP_OPENAI_API_KEY=sk-your-actual-openai-key
```

## 🔧 개별 서비스 설정

### 1. Apache Flink 설정

**JobManager 웹 UI 접속**: http://localhost:8081

**Flink 작업 제출**:
```bash
# Flink 컨테이너 접속
docker exec -it flink-jobmanager bash

# 작업 제출 예시
./bin/flink run -c com.daview.flink.PulseAnalyzerJob /path/to/your-job.jar
```

### 2. InfluxDB 설정

**웹 UI 접속**: http://localhost:8086

**초기 설정**:
- Username: `admin`
- Password: `adminpass`
- Organization: `care-pulse`
- Bucket: `vital-signs`
- Token: `care-pulse-token-123456789`

**CLI 사용**:
```bash
# InfluxDB CLI 접속
docker exec -it influxdb influx

# 데이터 쿼리 예시
> SELECT * FROM vital_signs WHERE time > now() - 1h
```

### 3. Kafka 설정

**Kafka UI 접속**: http://localhost:8080

**토픽 생성**:
```bash
# Kafka 컨테이너 접속
docker exec -it kafka bash

# 토픽 생성
kafka-topics.sh --create --topic care-pulse-vitals --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# 토픽 목록 확인
kafka-topics.sh --list --bootstrap-server localhost:9092
```

### 4. PostgreSQL 설정

**연결 정보**:
- Host: `localhost:5432`
- Database: `care_pulse_db`
- Username: `care_pulse_user`
- Password: `care_pulse_pass`

**테이블 생성**:
```sql
-- 환자 테이블
CREATE TABLE patients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER,
    room VARCHAR(20),
    condition VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 알림 테이블
CREATE TABLE alerts (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    type VARCHAR(50),
    message TEXT,
    priority VARCHAR(20),
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. MinIO 설정

**관리 콘솔 접속**: http://localhost:9001

**로그인 정보**:
- Username: `care-pulse-admin`
- Password: `care-pulse-password`

**버킷 생성**:
- `care-pulse-models`: AI 모델 파일 저장
- `care-pulse-reports`: 보고서 파일 저장
- `care-pulse-backups`: 백업 파일 저장

## 📊 모니터링 및 관제

### 1. Grafana 대시보드

**접속**: http://localhost:3001

**기본 대시보드**:
- Care Pulse System Overview
- Kafka Metrics
- Flink Processing Metrics
- InfluxDB Performance
- Application Metrics

### 2. Prometheus 메트릭

**접속**: http://localhost:9090

**주요 메트릭**:
- `kafka_broker_topic_messages_in_total`
- `flink_jobmanager_job_uptime`
- `influxdb_database_numSeries`
- `care_pulse_patient_count`
- `care_pulse_alert_count`

### 3. Jaeger 트레이싱

**접속**: http://localhost:16686

**추적 가능한 서비스**:
- care-pulse-api
- flink-processing
- kafka-consumer
- openai-client

## 🔍 개발 및 디버깅

### 1. 로그 모니터링

```bash
# 전체 서비스 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f flink-jobmanager kafka influxdb

# 로그 필터링
docker-compose logs -f | grep ERROR
```

### 2. 서비스 상태 점검

```bash
# 헬스체크 스크립트
#!/bin/bash
echo "=== Care Pulse Infrastructure Health Check ==="

# Flink JobManager
echo "Flink JobManager: $(curl -s http://localhost:8081/overview | jq -r '.["jobs-running"]') jobs running"

# Kafka
echo "Kafka: $(curl -s http://localhost:8080/api/clusters | jq -r '.[0].name') cluster active"

# InfluxDB
echo "InfluxDB: $(curl -s http://localhost:8086/health | jq -r '.status')"

# PostgreSQL
echo "PostgreSQL: $(docker exec postgres pg_isready -U care_pulse_user | grep 'accepting connections')"

# MinIO
echo "MinIO: $(curl -s http://localhost:9000/minio/health/live | grep 'OK')"
```

### 3. 개발 도구

**VS Code 확장 프로그램**:
- Docker
- Kubernetes
- Apache Kafka
- InfluxDB
- PostgreSQL

**유용한 도구**:
- `kafkacat`: Kafka 클라이언트
- `influx`: InfluxDB CLI
- `psql`: PostgreSQL CLI
- `mc`: MinIO CLI

## 🚨 트러블슈팅

### 일반적인 문제들

1. **포트 충돌**
   ```bash
   # 포트 사용 중인 프로세스 확인
   lsof -i :8081
   netstat -tulpn | grep :8081
   ```

2. **메모리 부족**
   ```bash
   # Docker 메모리 사용량 확인
   docker stats
   
   # 시스템 메모리 확인
   free -h
   ```

3. **디스크 공간 부족**
   ```bash
   # Docker 볼륨 정리
   docker system prune -a -f
   docker volume prune -f
   ```

4. **네트워크 연결 문제**
   ```bash
   # 네트워크 상태 확인
   docker network ls
   docker network inspect care-pulse-network
   ```

### 서비스별 문제 해결

#### Flink 관련 문제

```bash
# TaskManager 연결 문제
docker logs flink-taskmanager

# 작업 재시작
docker exec flink-jobmanager ./bin/flink cancel <job-id>
docker exec flink-jobmanager ./bin/flink run -c YourJobClass /path/to/job.jar
```

#### Kafka 관련 문제

```bash
# 토픽 삭제 후 재생성
kafka-topics.sh --delete --topic care-pulse-vitals --bootstrap-server localhost:9092
kafka-topics.sh --create --topic care-pulse-vitals --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

#### InfluxDB 관련 문제

```bash
# 데이터베이스 리셋
docker exec influxdb influx delete --bucket vital-signs --start '1970-01-01T00:00:00Z' --stop $(date -u +"%Y-%m-%dT%H:%M:%SZ")
```

## 🔐 보안 고려사항

### 1. 인증 및 권한

- JWT 토큰 기반 인증
- 서비스별 개별 인증 설정
- RBAC (Role-Based Access Control)

### 2. 네트워크 보안

```yaml
# docker-compose.yml에 네트워크 격리 추가
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
  database:
    driver: bridge
    internal: true
```

### 3. 데이터 암호화

- 전송 중 암호화 (TLS/SSL)
- 저장 데이터 암호화
- 환경 변수 보안

## 📈 성능 최적화

### 1. 메모리 최적화

```yaml
# docker-compose.yml에 메모리 제한 추가
services:
  flink-jobmanager:
    mem_limit: 1g
    memswap_limit: 1g
```

### 2. 네트워크 최적화

```yaml
# 네트워크 설정 최적화
networks:
  default:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1500
```

### 3. 스토리지 최적화

```yaml
# 볼륨 성능 최적화
volumes:
  influxdb_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /fast/ssd/path
```

## 🤝 기여 가이드

### 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-org/care-pulse-tracker.git
   cd care-pulse-tracker
   ```

2. **개발 환경 실행**
   ```bash
   # 인프라 실행
   docker-compose up -d
   
   # 프론트엔드 실행
   npm install
   npm start
   ```

3. **테스트 실행**
   ```bash
   # 단위 테스트
   npm test
   
   # 통합 테스트
   npm run test:integration
   ```

### 코드 기여 프로세스

1. 이슈 생성 및 할당
2. 기능 브랜치 생성
3. 코드 작성 및 테스트
4. Pull Request 생성
5. 코드 리뷰 및 머지

## 📚 추가 자료

- [Apache Flink 공식 문서](https://flink.apache.org/docs/)
- [Apache Kafka 공식 문서](https://kafka.apache.org/documentation/)
- [InfluxDB 공식 문서](https://docs.influxdata.com/)
- [OpenAI API 문서](https://platform.openai.com/docs/)
- [Spring Boot 3 공식 문서](https://spring.io/projects/spring-boot)

## 🆘 지원 및 문의

- **이슈 리포트**: GitHub Issues
- **개발자 커뮤니티**: Discord 또는 Slack
- **기술 문서**: Wiki 페이지
- **API 문서**: Swagger UI (http://localhost:8080/swagger-ui.html)

---

🎯 **Care Pulse Tracker**는 최신 기술 스택을 활용한 실시간 헬스케어 모니터링 솔루션입니다. 

본 가이드를 통해 손쉽게 개발 환경을 구축하고 실제 운영 환경에 배포할 수 있습니다! 