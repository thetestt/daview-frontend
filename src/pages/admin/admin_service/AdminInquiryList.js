import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../../styles/admin/AdminInquiryList.module.css';

const AdminInquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 상태 옵션
  const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'pending', label: '대기중' },
    { value: 'processing', label: '처리중' },
    { value: 'completed', label: '완료' },
    { value: 'closed', label: '닫힘' }
  ];

  // 문의 목록 로드
  const loadInquiries = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/inquiries', {
        params: {
          page: currentPage,
          size: pageSize,
          search: searchKeyword.trim() || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }
      });

      if (response.data) {
        setInquiries(response.data);
        setTotalElements(response.data.length); // 실제로는 백엔드에서 총 개수를 별도로 받아야 함
      }
    } catch (error) {
      console.error('문의 목록 로드 실패:', error);
      alert('문의 목록을 불러오는데 실패했습니다.');
      
      // 에러 발생 시 임시 데이터 사용
      const sampleInquiries = [
        {
          chatroomId: 'room-001',
          senderName: '김철수',
          receiverName: '관리자',
          lastMessage: '서비스 이용 중 문제가 발생했습니다.',
          lastTime: '2025-01-01 10:30:00',
          status: 'pending',
          unreadCount: 2,
          createdAt: '2025-01-01 10:30:00'
        },
        {
          chatroomId: 'room-002',
          senderName: '이영희',
          receiverName: '관리자',
          lastMessage: '결제 취소를 원합니다.',
          lastTime: '2024-12-30 14:20:00',
          status: 'completed',
          unreadCount: 0,
          createdAt: '2024-12-30 14:20:00'
        }
      ];
      setInquiries(sampleInquiries);
      setTotalElements(sampleInquiries.length);
    } finally {
      setLoading(false);
    }
  };

  // 검색
  const handleSearch = () => {
    setCurrentPage(0);
    loadInquiries();
  };

  // 상태 변경
  const handleStatusChange = async (chatroomId, newStatus) => {
    try {
      await axios.put(`/api/admin/inquiries/${chatroomId}/status`, {
        status: newStatus
      });

      alert('상태가 변경되었습니다.');
      loadInquiries();
      if (selectedInquiry && selectedInquiry.chatroomId === chatroomId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 채팅 메시지 로드
  const loadChatMessages = async (chatroomId) => {
    try {
      const adminId = 1; // 실제로는 현재 로그인한 관리자 ID를 사용해야 함
      const response = await axios.get(`/api/admin/inquiries/${chatroomId}/messages`, {
        params: { adminId }
      });

      if (response.data) {
        setChatMessages(response.data);
      }
    } catch (error) {
      console.error('채팅 메시지 로드 실패:', error);
      alert('채팅 메시지를 불러오는데 실패했습니다.');
    }
  };

  // 관리자 답변 전송
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedInquiry) return;

    try {
      const adminId = 1; // 실제로는 현재 로그인한 관리자 ID를 사용해야 함
      await axios.post(`/api/admin/inquiries/${selectedInquiry.chatroomId}/reply`, {
        adminId,
        content: newMessage
      });

      setNewMessage('');
      loadChatMessages(selectedInquiry.chatroomId); // 메시지 새로고침
      loadInquiries(); // 목록도 새로고침
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    }
  };

  // 상세 보기
  const handleViewDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailModal(true);
  };

  // 채팅 열기
  const handleOpenChat = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowChatModal(true);
    loadChatMessages(inquiry.chatroomId);
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 페이지 크기 변경
  const handlePageSizeChange = (newSize) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(0);
  };

  // 상태 배지 스타일
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'pending', text: '대기중' },
      processing: { class: 'processing', text: '처리중' },
      completed: { class: 'completed', text: '완료' },
      closed: { class: 'closed', text: '닫힘' }
    };
    
    const config = statusConfig[status] || { class: 'pending', text: '알수없음' };
    return <span className={`${styles['status-badge']} ${styles[config.class]}`}>{config.text}</span>;
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalElements / pageSize);

  useEffect(() => {
    loadInquiries();
  }, [currentPage, pageSize]);

  return (
    <div className={styles['inquiry-list-container']}>
      {/* 헤더 */}
      <div className={styles['admin-header']}>
        <h2>💬 1:1 문의관리</h2>
        <div className={styles['header-info']}>
          <div className={styles['total-count']}>
            총 {totalElements}건의 문의
          </div>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className={styles['filter-section']}>
        <div className={styles['filter-row']}>
          <div className={styles['filter-group']}>
            <label>상태</label>
            <select 
              className={styles['status-filter']}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles['filter-group']}>
            <label>검색</label>
            <div className={styles['search-container']}>
              <input
                type="text"
                className={styles['search-input']}
                placeholder="제목, 작성자, 내용으로 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                className={styles['search-btn']}
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? '🔄' : '🔍'} {loading ? '검색 중...' : '검색'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className={styles['table-container']}>
        <table className={styles['inquiry-table']}>
          <thead>
            <tr>
              <th>채팅방ID</th>
              <th>작성자</th>
              <th>최근 메시지</th>
              <th>상태</th>
              <th>미읽음</th>
              <th>생성일</th>
              <th>최근 활동</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className={styles['loading-cell']}>
                  <div className={styles['loading-spinner']}>데이터를 불러오는 중...</div>
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles['empty-cell']}>
                  문의 내역이 없습니다.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry, index) => (
                <tr key={`inquiry-${inquiry.chatroomId || index}`}>
                  <td>{inquiry.chatroomId}</td>
                  <td>{inquiry.senderName || '-'}</td>
                  <td className={styles['message-cell']}>
                    <span className={styles['message-preview']}>
                      {inquiry.lastMessage || '메시지 없음'}
                    </span>
                  </td>
                  <td>{getStatusBadge(inquiry.status || 'pending')}</td>
                  <td>
                    {inquiry.unreadCount > 0 && (
                      <span className={styles['unread-badge']}>
                        {inquiry.unreadCount}
                      </span>
                    )}
                  </td>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <td>{formatDate(inquiry.lastTime)}</td>
                  <td>
                    <div className={styles['action-buttons']}>
                      <button
                        className={styles['chat-btn']}
                        onClick={() => handleOpenChat(inquiry)}
                      >
                        채팅
                      </button>
                      <button
                        className={styles['view-btn']}
                        onClick={() => handleViewDetail(inquiry)}
                      >
                        상세
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className={styles["pagination-wrapper"]}>
        {/* 왼쪽: 표시 개수 정보 */}
        <div className={styles["pagination-info"]}>
          {totalElements > 0 && (
            <span className={styles["showing-text"]}>
              총 {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)}개 표시
            </span>
          )}
        </div>

        {/* 중앙: 페이지 버튼들 */}
        {totalPages > 1 && (
          <div className={styles["pagination-center"]}>
            <button 
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`${styles["pagination-btn"]} ${styles["nav-btn"]}`}
            >
              ◀ 이전
            </button>
            
            <div className={styles["page-numbers"]}>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                const pageNum = startPage + index;
                
                if (pageNum >= totalPages) return null;
                
                return (
                  <button
                    key={`inquiry-page-${pageNum}`}
                    onClick={() => handlePageChange(pageNum)}
                    className={`${styles["page-btn"]} ${pageNum === currentPage ? styles["active"] : ''}`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className={`${styles["pagination-btn"]} ${styles["nav-btn"]}`}
            >
              다음 ▶
            </button>
          </div>
        )}

        {/* 오른쪽: 페이지당 표시 개수 선택 */}
        <div className={styles["pagination-controls"]}>
          <span className={styles["control-label"]}>페이지당 표시</span>
          <select 
            value={pageSize} 
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className={styles["page-size-select"]}
          >
            <option value={10}>10개</option>
            <option value={20}>20개</option>
            <option value={50}>50개</option>
          </select>
        </div>
      </div>

      {/* 상세 정보 모달 */}
      {showDetailModal && selectedInquiry && (
        <div className={styles['modal-backdrop']} onClick={() => setShowDetailModal(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>문의 상세 정보</h3>
              <button 
                className={styles['modal-close']}
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles['modal-body']}>
              <div className={styles['detail-section']}>
                <h4>기본 정보</h4>
                <div className={styles['detail-grid']}>
                  <div className={styles['detail-item']}>
                    <label>채팅방 ID:</label>
                    <span>{selectedInquiry.chatroomId}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>작성자:</label>
                    <span>{selectedInquiry.senderName}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>상태:</label>
                    <span>{getStatusBadge(selectedInquiry.status)}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>생성일:</label>
                    <span>{formatDate(selectedInquiry.createdAt)}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>최근 활동:</label>
                    <span>{formatDate(selectedInquiry.lastTime)}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>미읽음 수:</label>
                    <span>{selectedInquiry.unreadCount || 0}개</span>
                  </div>
                </div>
              </div>

              <div className={styles['detail-section']}>
                <h4>최근 메시지</h4>
                <div className={styles['content-area']}>
                  {selectedInquiry.lastMessage || '메시지 없음'}
                </div>
              </div>
            </div>

            <div className={styles['modal-footer']}>
              <div className={styles['action-buttons']}>
                <div className={styles['status-change-section']}>
                  <label>상태 변경:</label>
                  <select 
                    className={styles['status-select']}
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.chatroomId, e.target.value)}
                  >
                    {statusOptions.filter(option => option.value !== 'all').map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  className={styles['chat-btn']}
                  onClick={() => {
                    setShowDetailModal(false);
                    handleOpenChat(selectedInquiry);
                  }}
                >
                  채팅하기
                </button>
                
                <button 
                  className={styles['close-btn']}
                  onClick={() => setShowDetailModal(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 채팅 모달 */}
      {showChatModal && selectedInquiry && (
        <div className={styles['modal-backdrop']} onClick={() => setShowChatModal(false)}>
          <div className={styles['chat-modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>1:1 채팅 - {selectedInquiry.senderName}</h3>
              <button 
                className={styles['modal-close']}
                onClick={() => setShowChatModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles['chat-messages']}>
              {chatMessages.length === 0 ? (
                <div className={styles['no-messages']}>메시지가 없습니다.</div>
              ) : (
                chatMessages.map((message, index) => (
                  <div 
                    key={index}
                    className={`${styles['message']} ${message.senderId === 1 ? styles['admin-message'] : styles['user-message']}`}
                  >
                    <div className={styles['message-content']}>
                      {message.content}
                    </div>
                    <div className={styles['message-time']}>
                      {formatDate(message.sentAt)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={styles['chat-input-area']}>
              <input
                type="text"
                className={styles['chat-input']}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                className={styles['send-btn']}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiryList; 