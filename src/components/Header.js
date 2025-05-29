import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/img1.png" alt="Logo" className="header-logo" />
      </div>
      <div className="header-center">
        Remoteworker
      </div>
      <nav className="header-right">
        <Link to="/login" className="header-link">Login</Link>
        <Link to="/register" className="header-link">Register</Link>
      </nav>
    </header>
  );
}
