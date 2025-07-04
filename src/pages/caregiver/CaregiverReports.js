import React, { useState, useEffect } from 'react';
import { getReports, createReport, updateReport, deleteReport, getReportByDate } from '../../api/caregiverReports';
import styles from '../../styles/pages/CaregiverReports.module.css';

const CaregiverReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    reportDate: '',
    content: '',
    status: 'pending'
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, [currentPage]);

  useEffect(() => {
    // 컴포넌트 마운트 시 오늘 날짜로 기본값 설정
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      reportDate: today
    }));
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getReports(currentPage, 10);
      setReports(data.reports || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setError('보고서 목록을 불러오는데 실패했습니다.');
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingReport) {
        await updateReport(editingReport.id, formData);
      } else {
        await createReport(formData);
      }
      setShowModal(false);
      setEditingReport(null);
      setFormData({ reportDate: '', content: '', status: 'pending' });
      loadReports();
    } catch (error) {
      setError('보고서 저장에 실패했습니다.');
      console.error('Error saving report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      reportDate: report.reportDate,
      content: report.content,
      status: report.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 보고서를 삭제하시겠습니까?')) {
      try {
        await deleteReport(id);
        loadReports();
      } catch (error) {
        setError('보고서 삭제에 실패했습니다.');
        console.error('Error deleting report:', error);
      }
    }
  };

  const handleDateSearch = async () => {
    if (!selectedDate) return;
    
    try {
      setLoading(true);
      const report = await getReportByDate(selectedDate);
      if (report) {
        setReports([report]);
        setTotalPages(1);
        setCurrentPage(0);
      } else {
        setReports([]);
        setTotalPages(0);
      }
    } catch (error) {
      setError('날짜별 보고서 조회에 실패했습니다.');
      console.error('Error searching by date:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSelectedDate('');
    setCurrentPage(0);
    loadReports();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'submitted': return '#007bff';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'submitted': return '제출됨';
      case 'approved': return '승인됨';
      case 'rejected': return '반려됨';
      default: return '알 수 없음';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>보고서 관리</h1>
        <div className={styles.headerActions}>
          <div className={styles.searchSection}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
            />
            <button onClick={handleDateSearch} className={styles.searchBtn}>
              검색
            </button>
            <button onClick={resetSearch} className={styles.resetBtn}>
              전체보기
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className={styles.addBtn}
          >
            새 보고서 작성
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={() => setError('')} className={styles.closeError}>×</button>
        </div>
      )}

      <div className={styles.reportsGrid}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : reports.length === 0 ? (
          <div className={styles.emptyState}>
            <p>보고서가 없습니다.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <h3>{report.reportDate}</h3>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(report.status) }}
                >
                  {getStatusText(report.status)}
                </span>
              </div>
              <div className={styles.reportContent}>
                <p>{report.content ? report.content.substring(0, 100) + '...' : '내용 없음'}</p>
              </div>
              <div className={styles.reportActions}>
                <button 
                  onClick={() => handleEdit(report)}
                  className={styles.editBtn}
                >
                  수정
                </button>
                <button 
                  onClick={() => handleDelete(report.id)}
                  className={styles.deleteBtn}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
            className={styles.pageBtn}
          >
            이전
          </button>
          <span className={styles.pageInfo}>
            {currentPage + 1} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className={styles.pageBtn}
          >
            다음
          </button>
        </div>
      )}

      {/* 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingReport ? '보고서 수정' : '새 보고서 작성'}</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingReport(null);
                  setFormData({ reportDate: '', content: '', status: 'pending' });
                }}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>날짜</label>
                <input
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>보고서 내용</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="보고서 내용을 작성해주세요"
                  rows="10"
                  required
                  className={styles.formTextarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>상태</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="pending">대기중</option>
                  <option value="submitted">제출됨</option>
                  <option value="approved">승인됨</option>
                  <option value="rejected">반려됨</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn} disabled={loading}>
                  {loading ? '저장 중...' : '저장'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    setEditingReport(null);
                    setFormData({ reportDate: '', content: '', status: 'pending' });
                  }}
                  className={styles.cancelBtn}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverReports; 