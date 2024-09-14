import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import logo from '/logo.jpg';
import { MDBTypography } from 'mdb-react-ui-kit';

function Header() {
  return (
    <header className="app-header">
      <div className="logo-title-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-image" />
          <MDBTypography tag="span" variant="h4" className="app-title">
            SnapNC
          </MDBTypography>
        </Link>
      </div>
      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        <NavLink
          to="/form"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Generator
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;