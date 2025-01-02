// eslint-disable-next-line no-unused-vars
import React from "react";
import "./HeroSection.css";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-text">
        <h1>Resilient Roots AI</h1>
        <p>Empowering Farmers with Disease Recognition Technology</p>
        <div className="hero-btns">
         <Link to='/'><a className="btn">Home</a></Link>
         {/* <Link to='/login'><a className="btn">Login</a></Link>        */}
          </div>
      </div>
    </section>
  );
};

export default HeroSection;