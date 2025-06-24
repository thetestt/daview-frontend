import React from "react";
import styles from "../styles/components/Footer.module.css";

function Footer() {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer-content"]}>
        <p>ⓒ 2025 DAVIEW. All rights reserved.</p>
        <div className={styles["sns-icons"]}>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
