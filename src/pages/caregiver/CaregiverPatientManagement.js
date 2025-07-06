import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/CaregiverPatientManagement.module.css';

const CaregiverPatientManagement = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showCareModal, setShowCareModal] = useState(false);
  const [careRecord, setCareRecord] = useState({
    date: '',
    time: '',
    type: '',
    content: ''
  });

  // 더미 환자 데이터
  const dummyPatients = [
    {
      id: 1,
      name: '김영희',
      age: 82,
      gender: '여성',
      room: '203호',
      medicalCondition: '치매 초기, 당뇨병',
      emergencyContact: '김철수 (아들) - 010-1234-5678',
      admissionDate: '2024-01-15',
      careLevel: '3등급',
      notes: '식사 도움 필요, 투약 시간 준수 필요',
      recentCareRecords: [
        { date: '2025-01-23', time: '09:00', type: '식사 도움', content: '아침 식사 완료 (밥 반공기)' },
        { date: '2025-01-23', time: '14:00', type: '투약', content: '당뇨약 복용 확인' },
        { date: '2025-01-22', time: '20:00', type: '취침 준비', content: '세면 도움 후 취침' }
      ]
    },
    {
      id: 2,
      name: '박정수',
      age: 78,
      gender: '남성',
      room: '105호',
      medicalCondition: '파킨슨병, 고혈압',
      emergencyContact: '박미영 (딸) - 010-9876-5432',
      admissionDate: '2024-03-20',
      careLevel: '2등급',
      notes: '보행 도움 필요, 혈압 정기 체크',
      recentCareRecords: [
        { date: '2025-01-23', time: '08:30', type: '혈압 측정', content: '130/80 mmHg (정상)' },
        { date: '2025-01-23', time: '10:00', type: '보행 도움', content: '복도 산책 30분' },
        { date: '2025-01-22', time: '19:00', type: '투약', content: '혈압약 복용 확인' }
      ]
    },
    {
      id: 3,
      name: '이순자',
      age: 85,
      gender: '여성',
      room: '304호',
      medicalCondition: '알츠하이머, 관절염',
      emergencyContact: '이민호 (아들) - 010-5555-7777',
      admissionDate: '2023-11-10',
      careLevel: '4등급',
      notes: '24시간 관찰 필요, 관절 마사지 정기 실시',
      recentCareRecords: [
        { date: '2025-01-23', time: '07:00', type: '기상 도움', content: '안전하게 기상, 컨디션 양호' },
        { date: '2025-01-23', time: '15:00', type: '물리치료', content: '관절 마사지 20분' },
        { date: '2025-01-22', time: '21:00', type: '안전 확인', content: '취침 전 안전 확인 완료' }
      ]
    }
  ];

  useEffect(() => {
    setPatients(dummyPatients);
  }, []);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleAddCareRecord = () => {
    if (!selectedPatient) return;
    
    const newRecord = {
      date: careRecord.date,
      time: careRecord.time,
      type: careRecord.type,
      content: careRecord.content
    };
    
    // 실제로는 서버에 전송
    console.log('케어 기록 추가:', newRecord);
    
    // 더미 데이터 업데이트
    setPatients(prev => prev.map(p => 
      p.id === selectedPatient.id 
        ? { ...p, recentCareRecords: [newRecord, ...p.recentCareRecords] }
        : p
    ));
    
    setSelectedPatient(prev => ({
      ...prev,
      recentCareRecords: [newRecord, ...prev.recentCareRecords]
    }));
    
    setShowCareModal(false);
    setCareRecord({ date: '', time: '', type: '', content: '' });
    alert('케어 기록이 추가되었습니다.');
  };

  const getCareTypeColor = (type) => {
    switch (type) {
      case '식사 도움': return '#28a745';
      case '투약': return '#dc3545';
      case '혈압 측정': return '#007bff';
      case '보행 도움': return '#fd7e14';
      case '물리치료': return '#6f42c1';
      case '취침 준비': return '#6c757d';
      case '기상 도움': return '#20c997';
      case '안전 확인': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getCareLevelColor = (level) => {
    switch (level) {
      case '1등급': return '#dc3545';
      case '2등급': return '#fd7e14';
      case '3등급': return '#ffc107';
      case '4등급': return '#28a745';
      case '5등급': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>환자 관리</h1>
        <button onClick={() => navigate('/caregiver/main')} className={styles.backBtn}>
          뒤로가기
        </button>
      </div>

      <div className={styles.mainContent}>
        {/* 환자 목록 */}
        <div className={styles.patientList}>
          <h2>담당 환자 목록</h2>
          {patients.map(patient => (
            <div
              key={patient.id}
              className={`${styles.patientCard} ${selectedPatient?.id === patient.id ? styles.selected : ''}`}
              onClick={() => handlePatientSelect(patient)}
            >
              <div className={styles.patientInfo}>
                <h3>{patient.name}</h3>
                <div className={styles.patientDetails}>
                  <span>{patient.age}세 · {patient.gender}</span>
                  <span className={styles.room}>{patient.room}</span>
                  <span 
                    className={styles.careLevel}
                    style={{ backgroundColor: getCareLevelColor(patient.careLevel) }}
                  >
                    {patient.careLevel}
                  </span>
                </div>
              </div>
              <div className={styles.patientCondition}>
                <span>{patient.medicalCondition}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 환자 상세 정보 */}
        {selectedPatient && (
          <div className={styles.patientDetail}>
            <div className={styles.detailHeader}>
              <h2>{selectedPatient.name} 환자 상세 정보</h2>
              <button 
                onClick={() => setShowCareModal(true)}
                className={styles.addRecordBtn}
              >
                케어 기록 추가
              </button>
            </div>

            <div className={styles.patientInfoSection}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>나이</label>
                  <span>{selectedPatient.age}세</span>
                </div>
                <div className={styles.infoItem}>
                  <label>성별</label>
                  <span>{selectedPatient.gender}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>방</label>
                  <span>{selectedPatient.room}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>등급</label>
                  <span 
                    className={styles.careLevel}
                    style={{ backgroundColor: getCareLevelColor(selectedPatient.careLevel) }}
                  >
                    {selectedPatient.careLevel}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <label>입소일</label>
                  <span>{selectedPatient.admissionDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>의학적 상태</label>
                  <span>{selectedPatient.medicalCondition}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>응급 연락처</label>
                  <span>{selectedPatient.emergencyContact}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>특이사항</label>
                  <span>{selectedPatient.notes}</span>
                </div>
              </div>
            </div>

            <div className={styles.careRecordsSection}>
              <h3>최근 케어 기록</h3>
              <div className={styles.careRecords}>
                {selectedPatient.recentCareRecords.map((record, index) => (
                  <div key={index} className={styles.careRecord}>
                    <div className={styles.recordHeader}>
                      <span className={styles.recordDate}>{record.date}</span>
                      <span className={styles.recordTime}>{record.time}</span>
                      <span 
                        className={styles.recordType}
                        style={{ backgroundColor: getCareTypeColor(record.type) }}
                      >
                        {record.type}
                      </span>
                    </div>
                    <div className={styles.recordContent}>
                      {record.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 케어 기록 추가 모달 */}
      {showCareModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>케어 기록 추가</h3>
              <button 
                onClick={() => setShowCareModal(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>날짜</label>
                <input
                  type="date"
                  value={careRecord.date}
                  onChange={(e) => setCareRecord({...careRecord, date: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>시간</label>
                <input
                  type="time"
                  value={careRecord.time}
                  onChange={(e) => setCareRecord({...careRecord, time: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>케어 유형</label>
                <select
                  value={careRecord.type}
                  onChange={(e) => setCareRecord({...careRecord, type: e.target.value})}
                >
                  <option value="">선택하세요</option>
                  <option value="식사 도움">식사 도움</option>
                  <option value="투약">투약</option>
                  <option value="혈압 측정">혈압 측정</option>
                  <option value="보행 도움">보행 도움</option>
                  <option value="물리치료">물리치료</option>
                  <option value="취침 준비">취침 준비</option>
                  <option value="기상 도움">기상 도움</option>
                  <option value="안전 확인">안전 확인</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>내용</label>
                <textarea
                  value={careRecord.content}
                  onChange={(e) => setCareRecord({...careRecord, content: e.target.value})}
                  rows="4"
                  placeholder="케어 내용을 상세히 기록하세요..."
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                onClick={handleAddCareRecord}
                className={styles.saveBtn}
                disabled={!careRecord.date || !careRecord.time || !careRecord.type || !careRecord.content}
              >
                저장
              </button>
              <button 
                onClick={() => setShowCareModal(false)}
                className={styles.cancelBtn}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverPatientManagement; 