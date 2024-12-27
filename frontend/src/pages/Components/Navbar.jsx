// eslint-disable-next-line no-unused-vars
import React from 'react'
import './Navbar.css'
function Navbar() {
  return (
    <div>
       <header className="header">
        <div className="logo">
          <h1>RESILIENT ROOTS AI</h1>
        </div>
        <nav className="nav">
            <div className="left">
            <a href="/">HOME</a>
          <a href="#">RESULTS</a>
          <a href="/about">ABOUT</a>
            </div>
            <div className="right">
            <a href="/profile">
            profile picture
            {/* <img
              src="src/assets/profile-icon.png.png" // Corrected image path
              alt="Profile"
              className="profile-icon"
            /> */}
          </a>
            </div>
          
          
        </nav>
        <div></div>
      </header>
    </div>
  )
}

export default Navbar
