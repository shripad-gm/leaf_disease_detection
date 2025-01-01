// eslint-disable-next-line no-unused-vars
import React from 'react'
import Navbar from './Navbar'
import './About.css'

function About() {
  return (
    <div>
        <Navbar/>
        <div className="main">

      {/* Main Content */}
      <main className="about-main">
        <section className="team-section">
          <h2 className="team-title">MEET OUR TEAM</h2>
          <h3 className="team-subtitle">ALGORITHM ALCHEMISTS</h3>
          <div className="team-grid">
            <div className="team-member">
            <div className="profile-pic-cover">
              <div className="profile-pic">
                <img src={""} alt="Team Icon" />
              </div>
                </div>
              <p className="member-name">SHRIPAD MARADI</p>
              <p className="member-role">CSE-CD</p>
            </div>
            <div className="team-member">
                <div className="profile-pic-cover">
              <div className="profile-pic">
                <img src={""} alt="Team Icon" />
              </div>
                </div>
              <p className="member-name">AMOGH A P</p>
              <p className="member-role">AIML</p>
            </div>
            <div className="team-member">
            <div className="profile-pic-cover">
              <div className="profile-pic">
                <img src={""} alt="Team Icon" />
              </div>
                </div>
              <p className="member-name">PREETHAM M R</p>
              <p className="member-role">CSE-IS</p>
            </div>
            <div className="team-member">
            <div className="profile-pic-cover">
              <div className="profile-pic">
                <img src={""} alt="Team Icon" />
              </div>
                </div>
              <p className="member-name">ROHAN GOWDA</p>
              <p className="member-role">CSE-IS</p>
            </div>
            <div className="team-member">
            <div className="profile-pic-cover">
              <div className="profile-pic">
                <img src={""} alt="Team Icon" />
              </div>
                </div>
              <p className="member-name">NAVYA HEBBAR</p>
              <p className="member-role">CSE-CD</p>
            </div>
          </div>
        </section>

        <section className="about-details">
          <p>
            We are a team of innovators committed to making agriculture smarter
            and more sustainable.
          </p>
          <p>
            Our project addresses <strong>Turcicum Leaf Blight (TLB)</strong>, a
            fungal disease that threatens crops like maize and sorghum, causing
            significant yield losses for farmers worldwide.
          </p>
          <ul>
            <li><strong>Detect TLB Instantly:</strong> Analyze leaf images to identify the disease with high accuracy.</li>
            <li><strong>Get Actionable Insights:</strong> Access tailored treatment recommendations to prevent further spread.</li>
            <li><strong>Monitor Plant Health:</strong> Save reports and track progress over time.</li>
          </ul>
          <p>
            Our goal is to bridge the gap between farmers and technology,
            ensuring that disease detection is accessible, affordable, and
            effective. By reducing crop losses and improving productivity, we
            aim to contribute to global food security and sustainable farming
            practices.
          </p>
        </section>
      </main>


        </div>
      
    </div>
  )
}

export default About
