import React from "react";
import "../styles/components//Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>ⓒ 2025 DAVIEW. All rights reserved.</p>
        <div className="sns-icons">
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
