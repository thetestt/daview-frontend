import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/CompanyInquiryManagement.module.css';

const CompanyInquiryManagement = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('all'); // all, new, processing, completed
  const [categoryFilter, setCategoryFilter] = useState('all'); // all, general, facility, payment, complaint
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // 더미 문의 데이터
  const dummyInquiries = [
    {
      id: 1,
      customerName: '김영희',
      customerEmail: 'kim@email.com',
      customerPhone: '010-1234-5678',
      category: 'facility',
      title: '시설 견학 문의',
      content: '안녕하세요. 어머니 요양을 위해 시설 견학을 하고 싶습니다. 언제 방문 가능한지 알려주세요. 특히 치매 환자를 위한 프로그램이 있는지 궁금합니다.',
      status: 'new',
      priority: 'medium',
      createdAt: '2025-01-20T14:30:00',
      updatedAt: '2025-01-20T14:30:00',
      reply: null
    },
    {
      id: 2,
      customerName: '박철수',
      customerEmail: 'park@email.com',
      customerPhone: '010-9876-5432',
      category: 'payment',
      title: '결제 관련 문의',
      content: '이번 달 결제 내역을 확인하고 싶습니다. 청구서에 추가 요금이 있는데 무엇인지 설명해주세요. 또한 결제 방법을 변경하고 싶습니다.',
      status: 'processing',
      priority: 'high',
      createdAt: '2025-01-18T10:15:00',
      updatedAt: '2025-01-19T09:00:00',
      reply: {
        content: '안녕하세요. 추가 요금은 물리치료 서비스 이용료입니다. 결제 방법 변경은 사무실로 연락주시면 도와드리겠습니다.',
        author: '고객서비스팀',
        createdAt: '2025-01-19T09:00:00'
      }
    },
    {
      id: 3,
      customerName: '최미영',
      customerEmail: 'choi@email.com',
      customerPhone: '010-5555-1234',
      category: 'complaint',
      title: '서비스 개선 요청',
      content: '식사 시간이 너무 이르고 메뉴가 단조롭습니다. 또한 간병인분들이 자주 바뀌어서 어머니가 불안해하십니다. 개선 부탁드립니다.',
      status: 'completed',
      priority: 'high',
      createdAt: '2025-01-15T16:45:00',
      updatedAt: '2025-01-16T11:30:00',
      reply: {
        content: '소중한 의견 감사합니다. 식사 시간 조정과 메뉴 다양화를 검토하겠습니다. 간병인 배치도 안정적으로 관리하도록 개선하겠습니다.',
        author: '시설관리팀',
        createdAt: '2025-01-16T11:30:00'
      }
    },
    {
      id: 4,
      customerName: '이정수',
      customerEmail: 'lee@email.com',
      customerPhone: '010-7777-8888',
      category: 'general',
      title: '면회 시간 변경 요청',
      content: '평일 오후에 면회하기가 어려워서 저녁 시간이나 주말에 면회가 가능한지 문의드립니다. 가족 모두 직장 때문에 낮 시간에 오기 힘듭니다.',
      status: 'new',
      priority: 'medium',
      createdAt: '2025-01-12T13:20:00',
      updatedAt: '2025-01-12T13:20:00',
      reply: null
    },
    {
      id: 5,
      customerName: '한수진',
      customerEmail: 'han@email.com',
      customerPhone: '010-3333-4444',
      category: 'facility',
      title: '프로그램 참여 문의',
      content: '아버지가 미술을 좋아하시는데 미술 프로그램이 있는지 궁금합니다. 또한 외부 강사가 오시는 프로그램도 있는지 알려주세요.',
      status: 'processing',
      priority: 'low',
      createdAt: '2025-01-10T11:00:00',
      updatedAt: '2025-01-11T14:00:00',
      reply: {
        content: '매주 화요일과 금요일에 미술 프로그램이 있습니다. 외부 강사 프로그램도 월 2회 진행되고 있습니다.',
        author: '프로그램팀',
        createdAt: '2025-01-11T14:00:00'
      }
    },
    {
      id: 6,
      customerName: '윤민호',
      customerEmail: 'yoon@email.com',
      customerPhone: '010-2222-3333',
      category: 'complaint',
      title: '시설 청소 상태 불만',
      content: '최근 방 청소 상태가 좋지 않습니다. 화장실 청소도 제대로 되지 않고 있어서 위생이 걱정됩니다. 즉시 개선이 필요합니다.',
      status: 'new',
      priority: 'high',
      createdAt: '2025-01-08T09:30:00',
      updatedAt: '2025-01-08T09:30:00',
      reply: null
    },
    {
      id: 7,
      customerName: '조은영',
      customerEmail: 'jo@email.com',
      customerPhone: '010-6666-7777',
      category: 'general',
      title: '의료진 상담 요청',
      content: '어머니 건강 상태에 대해 의료진과 상담하고 싶습니다. 언제 상담 가능한지 알려주세요. 특히 약물 복용에 대해 궁금한 점이 있습니다.',
      status: 'completed',
      priority: 'medium',
      createdAt: '2025-01-05T15:45:00',
      updatedAt: '2025-01-06T10:15:00',
      reply: {
        content: '의료진 상담은 매주 수요일 오후에 가능합니다. 약물 관련 상담도 함께 진행하겠습니다.',
        author: '의료팀',
        createdAt: '2025-01-06T10:15:00'
      }
    },
    {
      id: 8,
      customerName: '강민수',
      customerEmail: 'kang@email.com',
      customerPhone: '010-8888-9999',
      category: 'payment',
      title: '보험 적용 문의',
      content: '장기요양보험 적용이 가능한지 문의드립니다. 어떤 서비스가 보험 적용 대상인지 자세히 알려주세요.',
      status: 'new',
      priority: 'medium',
      createdAt: '2025-01-03T12:00:00',
      updatedAt: '2025-01-03T12:00:00',
      reply: null
    }
  ];

  useEffect(() => {
    setInquiries(dummyInquiries);
  }, []);

  const getFilteredInquiries = () => {
    let filtered = inquiries;

    // 상태별 필터링
    if (filter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === filter);
    }

    // 카테고리별 필터링
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.category === categoryFilter);
    }

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(inquiry => 
        inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const handleStatusChange = (inquiryId, newStatus) => {
    const updatedInquiries = inquiries.map(inquiry =>
      inquiry.id === inquiryId
        ? { ...inquiry, status: newStatus, updatedAt: new Date().toISOString() }
        : inquiry
    );
    setInquiries(updatedInquiries);
  };

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    const updatedInquiries = inquiries.map(inquiry =>
      inquiry.id === selectedInquiry.id
        ? {
            ...inquiry,
            status: 'completed',
            reply: {
              content: replyText,
              author: '고객서비스팀',
              createdAt: new Date().toISOString()
            },
            updatedAt: new Date().toISOString()
          }
        : inquiry
    );

    setInquiries(updatedInquiries);
    setShowReplyModal(false);
    setReplyText('');
    setSelectedInquiry(null);
    alert('답변이 등록되었습니다.');
  };

  const getCategoryName = (category) => {
    const categories = {
      general: '일반 문의',
      facility: '시설 문의',
      payment: '결제 문의',
      complaint: '불만 사항'
    };
    return categories[category] || category;
  };

  const getStatusName = (status) => {
    const statuses = {
      new: '신규',
      processing: '처리 중',
      completed: '답변 완료'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#dc3545',
      processing: '#ffc107',
      completed: '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#dc3545',
      medium: '#ffc107',
      low: '#28a745'
    };
    return colors[priority] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR') + ' ' + 
           new Date(dateString).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const getInquiryStats = () => {
    const total = inquiries.length;
    const newCount = inquiries.filter(i => i.status === 'new').length;
    const processingCount = inquiries.filter(i => i.status === 'processing').length;
    const completedCount = inquiries.filter(i => i.status === 'completed').length;
    const highPriorityCount = inquiries.filter(i => i.priority === 'high').length;

    return { total, newCount, processingCount, completedCount, highPriorityCount };
  };

  const stats = getInquiryStats();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>문의 관리</h1>
          <div className={styles.stats}>
            <span className={styles.statItem}>전체: {stats.total}건</span>
            <span className={styles.statItem}>신규: {stats.newCount}건</span>
            <span className={styles.statItem}>처리 중: {stats.processingCount}건</span>
            <span className={styles.statItem}>완료: {stats.completedCount}건</span>
            <span className={styles.statItem}>긴급: {stats.highPriorityCount}건</span>
          </div>
        </div>
        <button onClick={() => navigate('/company/main')} className={styles.backBtn}>
          뒤로가기
        </button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterRow}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="제목, 고객명, 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label>상태</label>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                전체
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'new' ? styles.active : ''}`}
                onClick={() => setFilter('new')}
              >
                신규 ({stats.newCount})
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'processing' ? styles.active : ''}`}
                onClick={() => setFilter('processing')}
              >
                처리 중 ({stats.processingCount})
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'completed' ? styles.active : ''}`}
                onClick={() => setFilter('completed')}
              >
                완료 ({stats.completedCount})
              </button>
            </div>
          </div>
          
          <div className={styles.filterGroup}>
            <label>카테고리</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">전체 카테고리</option>
              <option value="general">일반 문의</option>
              <option value="facility">시설 문의</option>
              <option value="payment">결제 문의</option>
              <option value="complaint">불만 사항</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.inquiryList}>
        {getFilteredInquiries().map(inquiry => (
          <div key={inquiry.id} className={styles.inquiryCard}>
            <div className={styles.cardHeader}>
              <div className={styles.inquiryInfo}>
                <h3>{inquiry.title}</h3>
                <div className={styles.meta}>
                  <span className={styles.customer}>{inquiry.customerName}</span>
                  <span className={styles.category}>{getCategoryName(inquiry.category)}</span>
                  <span className={styles.date}>{formatDate(inquiry.createdAt)}</span>
                </div>
              </div>
              <div className={styles.statusInfo}>
                <span 
                  className={`${styles.status} ${styles[inquiry.status]}`}
                  style={{ backgroundColor: getStatusColor(inquiry.status) }}
                >
                  {getStatusName(inquiry.status)}
                </span>
                <span 
                  className={`${styles.priority} ${styles[inquiry.priority]}`}
                  style={{ backgroundColor: getPriorityColor(inquiry.priority) }}
                >
                  {inquiry.priority === 'high' ? '긴급' : inquiry.priority === 'medium' ? '보통' : '낮음'}
                </span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <p>{inquiry.content.substring(0, 100)}...</p>
              {inquiry.reply && (
                <div className={styles.replyPreview}>
                  <span className={styles.replyLabel}>답변:</span>
                  <span className={styles.replyContent}>{inquiry.reply.content.substring(0, 50)}...</span>
                </div>
              )}
            </div>

            <div className={styles.cardActions}>
              <button
                onClick={() => {
                  setSelectedInquiry(inquiry);
                  setShowDetailModal(true);
                }}
                className={styles.detailBtn}
              >
                상세보기
              </button>
              
              {inquiry.status === 'new' && (
                <button
                  onClick={() => handleStatusChange(inquiry.id, 'processing')}
                  className={styles.processingBtn}
                >
                  처리 중으로 변경
                </button>
              )}
              
              {!inquiry.reply && (
                <button
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    setShowReplyModal(true);
                  }}
                  className={styles.replyBtn}
                >
                  답변하기
                </button>
              )}
            </div>
          </div>
        ))}

        {getFilteredInquiries().length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📝</span>
            <p>해당하는 문의가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      {showDetailModal && selectedInquiry && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>문의 상세보기</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.inquiryDetail}>
                <div className={styles.detailHeader}>
                  <h3>{selectedInquiry.title}</h3>
                  <div className={styles.detailMeta}>
                    <span 
                      className={styles.status}
                      style={{ backgroundColor: getStatusColor(selectedInquiry.status) }}
                    >
                      {getStatusName(selectedInquiry.status)}
                    </span>
                    <span 
                      className={styles.priority}
                      style={{ backgroundColor: getPriorityColor(selectedInquiry.priority) }}
                    >
                      {selectedInquiry.priority === 'high' ? '긴급' : selectedInquiry.priority === 'medium' ? '보통' : '낮음'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.customerInfo}>
                  <h4>고객 정보</h4>
                  <p><strong>이름:</strong> {selectedInquiry.customerName}</p>
                  <p><strong>이메일:</strong> {selectedInquiry.customerEmail}</p>
                  <p><strong>전화번호:</strong> {selectedInquiry.customerPhone}</p>
                  <p><strong>카테고리:</strong> {getCategoryName(selectedInquiry.category)}</p>
                  <p><strong>접수일:</strong> {formatDate(selectedInquiry.createdAt)}</p>
                </div>
                
                <div className={styles.inquiryContent}>
                  <h4>문의 내용</h4>
                  <p>{selectedInquiry.content}</p>
                </div>
                
                {selectedInquiry.reply && (
                  <div className={styles.replySection}>
                    <h4>답변 내용</h4>
                    <div className={styles.replyDetail}>
                      <div className={styles.replyMeta}>
                        <span className={styles.replyAuthor}>{selectedInquiry.reply.author}</span>
                        <span className={styles.replyDate}>{formatDate(selectedInquiry.reply.createdAt)}</span>
                      </div>
                      <p className={styles.replyContent}>{selectedInquiry.reply.content}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              {!selectedInquiry.reply && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowReplyModal(true);
                  }}
                  className={styles.replyBtn}
                >
                  답변하기
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className={styles.closeModalBtn}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 답변 작성 모달 */}
      {showReplyModal && selectedInquiry && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>답변 작성</h2>
              <button 
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.originalInquiry}>
                <h4>원본 문의</h4>
                <div className={styles.inquirySummary}>
                  <h5>{selectedInquiry.title}</h5>
                  <p><strong>고객:</strong> {selectedInquiry.customerName}</p>
                  <p><strong>내용:</strong> {selectedInquiry.content}</p>
                </div>
              </div>
              
              <div className={styles.replyForm}>
                <h4>답변 내용</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="고객에게 전달할 답변을 작성해주세요..."
                  rows="8"
                  className={styles.replyTextarea}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={handleReplySubmit}
                className={styles.submitBtn}
                disabled={!replyText.trim()}
              >
                답변 등록
              </button>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
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

export default CompanyInquiryManagement; 