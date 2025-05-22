import React, { useEffect, useState } from "react";
import { fetchAdminSummary } from "../../api/adminApi";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchAdminSummary().then((res) => {
      setSummary(res.data);
    });
  }, []);

  if (!summary) return <div>관리자 데이터 로딩 중...</div>;

  return (
    <div>
      <h2>관리자 대시보드</h2>
      <div>
        <p>총 가입자 수: {summary.totalUsers}</p>
        <p>요양사 수: {summary.caregiverCount}</p>
        <p>요양원 수: {summary.facilityCount}</p>
        <p>보고서 수: {summary.reportCount}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
