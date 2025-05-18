import React from "react";
import nursingHomes from "../data/nursingHomes";
import "./NursingHomeList.css";
import { Link } from "react-router-dom";

function NursingHomeList() {
  return (
    <div className="facility-list">
      {nursingHomes.map((home) => (
        <Link key={home.id} to={`/nursinghome/${home.id}`}>
        <div key={home.id} className="facility-card">
          <h3>{home.name}</h3>
          <p>{home.description}</p>
        </div>
        </Link>
      ))}
    </div>
  );
}

export default NursingHomeList;