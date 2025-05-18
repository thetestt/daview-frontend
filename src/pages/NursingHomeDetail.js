import React from "react";
import { useParams } from "react-router-dom";
import nursingHomes from "../data/nursingHomes";

function NursingHomeDetail() {
  const { id } = useParams();
  const home = nursingHomes.find((h) => h.id === parseInt(id));

  if (!home) {
    return <div>존재하지 않는 요양원입니다.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{home.name}</h2>
      <p>{home.description}</p>
      <p>요양원 상세정보를 여기에 표시합니다.</p>
    </div>
  );
}

export default NursingHomeDetail;