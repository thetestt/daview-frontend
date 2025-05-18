import React from "react";
import silvertowns from "../data/silvertowns";
import "./SilvertownList.css";
import { Link } from "react-router-dom";

function SilvertownList() {
  return (
    <div className="facility-list">
      {silvertowns.map((town) => (
        <Link key={town.id} to={`/silvertown/${town.id}`}>
        <div key={town.id} className="facility-card">
          <h3>{town.name}</h3>
          <p>{town.description}</p>
        </div>
        </Link>
      ))}
    </div>
  );
}

export default SilvertownList;