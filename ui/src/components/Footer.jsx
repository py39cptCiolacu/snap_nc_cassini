import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} SnapNC
      </p>
    </footer>
  );
}

export default Footer;