import React from "react";
import mainButtonData from "../data/MainButtonImages";
import "../styles/components/MainButton.css";

function MainButton() {
  return (
    <div className="main-button-container">
      {mainButtonData.map((item) => (
        <div key={item.id} className="button-wrapper">
          <a href={item.url} className="button-link">
            <img src={item.image} alt={item.alt} className="button-image" />
          </a>
          <a href={item.url} className="button-text">
            {item.alt}
          </a>
        </div>
      ))}
    </div>
  );
}

export default MainButton;
