import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        {/* Placeholder for the logo */}
        {/* <img src="/path-to-logo/logo.png" alt="Logo" /> */}
        <h1>YourAppName</h1>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/form">Form</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;