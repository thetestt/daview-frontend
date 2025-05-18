import React from "react";
import { useParams } from "react-router-dom";
import caregivers from "../data/caregivers";

function CaregiverDetail() {
  const { id } = useParams(); // 주소에서 id 받아오기
  const caregiver = caregivers.find((c) => c.id === parseInt(id));

  if (!caregiver) {
    return <div>존재하지 않는 요양사입니다.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{caregiver.name}</h2>
      <p>{caregiver.description}</p>
      <p>이곳에 더 많은 정보 추가 가능 (예: 경력, 지역, 사진 등)</p>
    </div>
  );
}

export default CaregiverDetail;