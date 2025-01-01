// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
  import "tailwindcss/tailwind.css";
  import "./Home.css"
import { Link } from "react-router-dom";


  const AgriApp = () => {
    // eslint-disable-next-line no-unused-vars
    const [activeSection, setActiveSection] = useState("#banner");

    // eslint-disable-next-line no-unused-vars
    const handleSectionChange = (section) => {
      setActiveSection(section);
    };

    return (
      <div className="font-sans">
        {/* Navbar */}
        <nav className="bg-gray-800 text-white" >
          <div className="container mx-auto flex justify-between items-center py-4">
            <a href="/" className="text-2xl font-bold font-kaushan"  style={{paddingLeft:"1rem"}}>Resilient Roots AI</a>
         
          </div>
        </nav>

        {/* Banner */}
        <section
          id="banner"
          className="sectionbg bg-cover bg-center h-screen flex items-center justify-center text-white text-center bg-[url('D:\program\React Js\learn React\Resellient Roots AI\leaf_disease_detection\frontend\src\pages\home\HomeBG1.jpeg')]"
          
        >
          <div >
            <h1 className="text-6xl font-kaushan" id="title">Resilient Roots AI</h1>
            <p className="text-lg italic">Empowering Farmers with Disease Recognition Technology</p>
            <div className="mt-8 space-x-4">
              <Link
              id="btnDiv"
              to="/detect"
                className="bg-transparent border border-white px-4 py-2 hover:bg-white hover:text-black"
              >
                Predict the Disease
              </Link>
              <a
              id="btnDiv"
                href="#feature"
                className="bg-transparent border border-white px-4 py-2 hover:bg-white hover:text-black"
              >
                 About us
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="feature" className="py-20 bg-gray-100">
          <div className="text-center mb-12">
            <p className="text-green-500 font-bold" id="features">FEATURES</p>
            <h1 className="text-3xl font-bold">WHY IS IT USEFULL</h1>
          </div>
          <div className="container mx-auto grid md:grid-cols-2 gap-8">
            <div >
              <h2 className="text-xl font-bold text-green-500">Quick Diagnosis</h2>
              <p className="mt-2">
                AI models make it possible to identify and treat crop diseases quickly and efficiently.
              </p>
              <h2 className="text-xl font-bold text-green-500 mt-8">Increase Yield</h2>
              <p className="mt-2">
                With our precise recommendations, farmers can easily maximize the yield of their fields.
              </p>
              <h2 className="text-xl font-bold text-green-500 mt-8">Reduce Cost</h2>
              <p className="mt-2">
                No need for agricultural experts or advanced crop management tools, reducing production costs.
              </p>
            </div>
            <div id="pic1">
              
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="homepg" className="py-20">
          <div className="text-center mb-12">
            <p className="text-green-500 font-bold">SERVICES</p>
            <h1 className="text-3xl font-bold">WE PROVIDE</h1>
          </div>
          <div className="container mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-md rounded-lg" id="cards">
            <div className="icondiv" style={{width:"100%",height:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <i className="fa-brands fa-pagelines"></i>
            </div>
              <h2 className="text-xl font-bold text-center">Crop Disease prediction</h2>
              <p className="mt-2 text-center">
                Analyzes soil and weather data to find the best-suited crop.
              </p>
              <div className="icondiv" style={{width:"100%",height:"30%",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <Link to="/detect">
              <button className="NavigateBtn" >Predict</button>
            </Link>
            </div>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg" id="cards">
            <div className="icondiv" style={{width:"100%",height:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <i className="fa-solid fa-suitcase-rolling"></i>
            </div>
              <h2 className="text-xl font-bold text-center">Fertilizer Recommendation</h2>
              <p className="mt-2 text-center">
                Analyzes soil and weather data to find the best-suited crop.
              </p>
              <div className="icondiv" style={{width:"100%",height:"30%",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <Link to="/fertilizer">
              <button className="NavigateBtn">Recommend   </button>
              </Link>
            </div>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg" id="cards">
            <div className="icondiv" style={{width:"100%",height:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <i className="fa-solid fa-cloud"></i>   
            </div>
              <h2 className="text-xl font-bold text-center">Weather prediction</h2>
              <p className="mt-2 text-center">
                Analyzes soil and weather data to find the best-suited crop.
              </p>
              <div className="icondiv" style={{width:"100%",height:"30%",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <Link to="/weather">
              <button className="NavigateBtn">Predict</button>
              </Link>
            </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto grid md:grid-cols-2">
            <div style={{marginLeft:"1rem"}}>
              <h1 className="text-2xl font-kaushan" style={{marginBottom:"1rem"}}>Resilient Roots AI</h1>
              <p>preethammr.is23@rvce.edu.in</p>
              <p>roharngowda.is23@rvce.edu.in</p>
              <p>amoghm.ai23@rvce.edu.in</p>
              <p>navyahebbar.is24@rvce.edu.in</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-kaushan">Contact Us</h1>
              <p>
                Github: <a href="https://github.com/shripad-gm/leaf_disease_detection/" className="text-green-500">Access Our GitHub</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  export default AgriApp;