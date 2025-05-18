import React from "react";
import { Link } from "react-router-dom";
import nursingHomes from "../data/nursingHomes";
import "./NursingHomeList.css";

function NursingHomeList() {
  return (
    <div className="facility-list">
      {nursingHomes.map((item) => (
        <Link key={item.facility_id} to={`/nursinghome/${item.facility_id}`} className="card-link">
          <div className="facility-card">
            <h3>{item.facility_name}</h3>
            <p>{item.facility_address_city} | {item.facility_theme}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default NursingHomeList;