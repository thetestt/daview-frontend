import React from "react";
import mainButtonData from "../data/MainButtonImages";
import "./MainButton.css";

function MainButton() {
  return (
    <div className="main-button-container">
      {mainButtonData.map((item) => (
        <a href={item.url} key={item.id} className="button-link">
          <img src={item.image} alt={item.alt} className="button-image" />
        </a>
      ))}
    </div>
  );
}

export default MainButton;
