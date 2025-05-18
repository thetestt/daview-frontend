import React from "react";
import caregivers from "../data/caregivers";
import "./CaregiverList.css";
import { Link } from "react-router-dom";

function CaregiverList() {
  return (
    <div className="facility-list">
      {caregivers.map((caregiver) => (
        <Link key={caregiver.id} to={`/caregiver/${caregiver.id}`}>
        <div key={caregiver.id} className="facility-card">
          <h3>{caregiver.name}</h3>
          <p>{caregiver.description}</p>
        </div>
        </Link>
      ))}
    </div>
  );
}

export default CaregiverList;