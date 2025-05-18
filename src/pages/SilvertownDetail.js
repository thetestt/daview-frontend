import React from "react";
import { useParams } from "react-router-dom";
import silvertowns from "../data/silvertowns";

function SilvertownDetail() {
  const { id } = useParams();
  const town = silvertowns.find((t) => t.id === parseInt(id));

  if (!town) {
    return <div>존재하지 않는 실버타운입니다.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{town.name}</h2>
      <p>{town.description}</p>
      <p>실버타운 상세정보를 여기에 표시합니다.</p>
    </div>
  );
}

export default SilvertownDetail;