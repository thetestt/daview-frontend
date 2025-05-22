import React, { useEffect, useState } from "react";
// import { fetchCaregiverProfile, fetchCaregiverPatients } from "../../api/caregiverApi";

const CaregiverDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // ✅ 실제 API 연결 시 아래 주석 해제
    // fetchCaregiverProfile().then(res => setProfile(res.data));
    // fetchCaregiverPatients().then(res => setPatients(res.data));

    // ✅ 더미 데이터 삽입 (프론트 테스트용)
    setProfile({
      name: "홍길동",
      careerYears: 5,
      intro: "성실하고 책임감 있는 요양사입니다.",
    });

    setPatients([
      { id: 1, name: "김환자", gender: "여", age: 82, room: 101 },
      { id: 2, name: "이환자", gender: "남", age: 79, room: 102 },
    ]);
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>요양사 대시보드</h2>
      <p><strong>이름:</strong> {profile.name}</p>
      <p><strong>경력:</strong> {profile.careerYears}년</p>
      <p><strong>소개:</strong> {profile.intro}</p>

      <h3 style={{ marginTop: "20px" }}>담당 입소자 목록</h3>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            {p.name} ({p.gender}, {p.age}세) - {p.room}호
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaregiverDashboard;
