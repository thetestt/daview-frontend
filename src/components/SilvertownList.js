import React from "react";
import silvertowns from "../data/silvertowns";
import "./SilvertownList.css";
import { Link } from "react-router-dom";

function SilvertownList() {
  return (
    <div className="facility-list">
      {silvertowns.map((town) => (
        <Link key={town.facility_id} to={`/silvertown/${town.facility_id}`} className="facility-card-link">
          <div className="facility-card">
            <img src={town.photos[0]} alt={town.facility_name} className="card-thumbnail" />
            <h3>{town.facility_name}</h3>
            <p>{town.facility_address_location} {town.facility_address_city}</p>
            <p>{town.facility_charge.toLocaleString()}원/월</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SilvertownList;