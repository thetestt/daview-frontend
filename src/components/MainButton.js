import React from "react";
import mainButtonData from "../data/MainButtonImages";
import styles from "../styles/components/MainButton.module.css";

function MainButton() {
  return (
    <div className={styles["main-button-container"]}>
      {mainButtonData.map((item) => (
        <div key={item.id} className={styles["button-wrapper"]}>
          <a href={item.url} className={styles["button-link"]}>
            <img
              src={item.image}
              alt={item.alt}
              className={styles["button-image"]}
            />
          </a>
          <a href={item.url} className={styles["button-text"]}>
            {item.alt}
          </a>
        </div>
      ))}
    </div>
  );
}

export default MainButton;
