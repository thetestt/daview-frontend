import React from "react";
import silvertowns from "../data/silvertowns";
import "./SilvertownList.css";

function SilvertownList() {
  return (
    <div className="facility-list">
      {silvertowns.map((town) => (
        <div key={town.id} className="facility-card">
          <h3>{town.name}</h3>
          <p>{town.description}</p>
        </div>
      ))}
    </div>
  );
}

export default SilvertownList;