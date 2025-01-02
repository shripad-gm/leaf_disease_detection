// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Resilient Roots AI</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/report">Result</Link></li>
        <li><Link to="/weather">Weather</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;