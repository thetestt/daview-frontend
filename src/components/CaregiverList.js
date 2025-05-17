import React from "react";
import caregivers from "../data/caregivers";
import "./CaregiverList.css";

function CaregiverList() {
  return (
    <div className="facility-list">
      {caregivers.map((caregiver) => (
        <div key={caregiver.id} className="facility-card">
          <h3>{caregiver.name}</h3>
          <p>{caregiver.description}</p>
        </div>
      ))}
    </div>
  );
}

export default CaregiverList;