import React from "react";
import { Link } from "react-router-dom";
import caregivers from "../data/caregivers";
import "../styles/components/MainList.css";

function CaregiverList() {
  return (
    <div className="facility-list">
      {caregivers.map((item) => (
        <Link
          key={item.caregiver_id}
          to={`/caregiver/${item.caregiver_id}`}
          className="facility-card"
        >
          <h3>{item.name}</h3>
          <p>
            {item.education_level} / {item.hope_work_place}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default CaregiverList;
