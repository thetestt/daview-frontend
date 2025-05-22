import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCaregivers } from "../api/caregiver";
import "../styles/components/MainList.css";

function CaregiverList() {
  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    getCaregivers().then((res) => setCaregivers(res.data));
  }, []);

  return (
    <div className="facility-list">
      {caregivers.map((item) => (
        <Link
          key={item.caregiverId}
          to={`/caregiver/${item.caregiverId}`}
          className="facility-card"
        >
          <h2 className="caregiver-name-box">
            <span className="caregiver-name">
              {item.username || "이름 미정"}
            </span>
            <span className={`caregiver-gender ${item.userGender}`}>
              {item.userGender === "male"
                ? "남"
                : item.userGender === "female"
                ? "여"
                : "미정"}
            </span>
          </h2>
          <p>
            {item.hopeWorkAreaLocation} {item.hopeWorkAreaCity}
          </p>
          <p>근무형태: {item.hopeWorkType}</p>
          <p>자격증: {item.certificates?.join(", ")}</p>
          <p>경력: {item.career?.length || 0}건</p>
        </Link>
      ))}
    </div>
  );
}

export default CaregiverList;
