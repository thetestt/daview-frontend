import React, { useEffect, useState } from "react";
// import { fetchFacilitySummary, fetchFacilityLogs } from "../../api/facilityApi";

const FacilityDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // ✅ 실제 API 연결 시 아래 주석 해제
    // fetchFacilitySummary().then(res => setSummary(res.data));
    // fetchFacilityLogs().then(res => setLogs(res.data));

    // ✅ 더미 데이터 삽입 (프론트 테스트용)
    setSummary({
      patientCount: 20,
      staffCount: 12,
      scheduleCount: 4,
      mealCount: 3,
    });

    setLogs([
      { id: 1, date: "2025-05-21", time: "09:30", activity: "건강 체크", staff: "김간호사" },
      { id: 2, date: "2025-05-21", time: "14:00", activity: "목욕 서비스", staff: "박요양사" },
    ]);
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>요양원 대시보드</h2>

      <div>
        <p><strong>총 입소자:</strong> {summary.patientCount}명</p>
        <p><strong>총 직원:</strong> {summary.staffCount}명</p>
        <p><strong>오늘 일정:</strong> {summary.scheduleCount}건</p>
        <p><strong>오늘 식단:</strong> {summary.mealCount}건</p>
      </div>

      <h3 style={{ marginTop: "20px" }}>최근 활동</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {log.date} {log.time} - {log.activity} ({log.staff})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacilityDashboard;
