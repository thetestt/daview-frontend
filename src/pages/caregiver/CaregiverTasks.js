import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskCompletion, getTodayTasks } from '../../api/caregiverTasks';
import styles from '../../styles/pages/CaregiverTasks.module.css';

const CaregiverTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    taskDate: '',
    taskTime: '',
    taskType: '',
    completed: false
  });
  const [activeTab, setActiveTab] = useState('today'); // today, all
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'today') {
      loadTodayTasks();
    } else {
      loadTasks();
    }
  }, [currentPage, activeTab]);

  useEffect(() => {
    // 컴포넌트 마운트 시 오늘 날짜로 기본값 설정
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      taskDate: today
    }));
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(currentPage, 10);
      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setError('일정 목록을 불러오는데 실패했습니다.');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayTasks = async () => {
    try {
      setLoading(true);
      const data = await getTodayTasks();
      setTodayTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('오늘 일정을 불러오는데 실패했습니다.');
      console.error('Error loading today tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({ taskDate: '', taskTime: '', taskType: '', completed: false });
      if (activeTab === 'today') {
        loadTodayTasks();
      } else {
        loadTasks();
      }
    } catch (error) {
      setError('일정 저장에 실패했습니다.');
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      taskDate: task.taskDate,
      taskTime: task.taskTime || '',
      taskType: task.taskType || '',
      completed: task.completed || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      try {
        await deleteTask(id);
        if (activeTab === 'today') {
          loadTodayTasks();
        } else {
          loadTasks();
        }
      } catch (error) {
        setError('일정 삭제에 실패했습니다.');
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleToggleCompletion = async (id, completed) => {
    try {
      await toggleTaskCompletion(id, !completed);
      if (activeTab === 'today') {
        loadTodayTasks();
      } else {
        loadTasks();
      }
    } catch (error) {
      setError('일정 상태 변경에 실패했습니다.');
      console.error('Error toggling completion:', error);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '시간 미설정';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const getTaskTypeColor = (taskType) => {
    switch (taskType) {
      case '약물관리': return '#007bff';
      case '식사지원': return '#28a745';
      case '운동보조': return '#ffc107';
      case '개인위생': return '#17a2b8';
      case '상담': return '#6f42c1';
      case '기타': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const renderTaskList = (taskList) => (
    <div className={styles.tasksGrid}>
      {taskList.length === 0 ? (
        <div className={styles.emptyState}>
          <p>일정이 없습니다.</p>
        </div>
      ) : (
        taskList.map((task) => (
          <div 
            key={task.id} 
            className={`${styles.taskCard} ${task.completed ? styles.completed : ''}`}
          >
            <div className={styles.taskHeader}>
              <div className={styles.taskDateTime}>
                <span className={styles.date}>{task.taskDate}</span>
                <span className={styles.time}>{formatTime(task.taskTime)}</span>
              </div>
              <span 
                className={styles.taskTypeBadge}
                style={{ backgroundColor: getTaskTypeColor(task.taskType) }}
              >
                {task.taskType || '일반'}
              </span>
            </div>
            <div className={styles.taskContent}>
              <div className={styles.completionToggle}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={task.completed || false}
                    onChange={() => handleToggleCompletion(task.id, task.completed)}
                  />
                  <span className={styles.checkmark}></span>
                  <span className={task.completed ? styles.completedText : ''}>
                    {task.completed ? '완료됨' : '미완료'}
                  </span>
                </label>
              </div>
            </div>
            <div className={styles.taskActions}>
              <button 
                onClick={() => handleEdit(task)}
                className={styles.editBtn}
              >
                수정
              </button>
              <button 
                onClick={() => handleDelete(task.id)}
                className={styles.deleteBtn}
              >
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>일정 관리</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className={styles.addBtn}
        >
          새 일정 추가
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={() => setError('')} className={styles.closeError}>×</button>
        </div>
      )}

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'today' ? styles.active : ''}`}
          onClick={() => setActiveTab('today')}
        >
          오늘 일정
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          전체 일정
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : activeTab === 'today' ? (
          renderTaskList(todayTasks)
        ) : (
          <>
            {renderTaskList(tasks)}
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
          </>
        )}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingTask ? '일정 수정' : '새 일정 추가'}</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingTask(null);
                  setFormData({ taskDate: '', taskTime: '', taskType: '', completed: false });
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
                  value={formData.taskDate}
                  onChange={(e) => setFormData({ ...formData, taskDate: e.target.value })}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>시간</label>
                <input
                  type="time"
                  value={formData.taskTime}
                  onChange={(e) => setFormData({ ...formData, taskTime: e.target.value })}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>일정 유형</label>
                <select
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                  className={styles.formSelect}
                  required
                >
                  <option value="">유형 선택</option>
                  <option value="약물관리">약물관리</option>
                  <option value="식사지원">식사지원</option>
                  <option value="운동보조">운동보조</option>
                  <option value="개인위생">개인위생</option>
                  <option value="상담">상담</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.completed}
                    onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                  />
                  완료됨
                </label>
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn} disabled={loading}>
                  {loading ? '저장 중...' : '저장'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setFormData({ taskDate: '', taskTime: '', taskType: '', completed: false });
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

export default CaregiverTasks; 