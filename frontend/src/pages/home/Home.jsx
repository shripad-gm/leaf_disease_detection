// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
  import "tailwindcss/tailwind.css";
  import "./Home.css"

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
        <nav className="bg-gray-800 text-white">
          <div className="container mx-auto flex justify-between items-center py-4">
            <a href="/" className="text-2xl font-bold font-kaushan">AgriGo</a>
            <div className="hidden md:flex space-x-4">
              <a href="/" className="hover:text-green-500">Home</a>
              <div className="relative group">
                <button className="hover:text-green-500">Services</button>
                <div className="absolute left-0 hidden mt-2 w-48 bg-white text-gray-800 shadow-lg group-hover:block">
                  <a
                    href="/crop-disease"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Crop Diseases
                  </a>
                  <a
                    href="/fertilizer-recommendation"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Fertilizer Recommendation
                  </a>
                  <a
                    href="/crop-recommendation"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Crop Disease Prediction
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Banner */}
        <section
          id="banner"
          className="sectionbg bg-cover bg-center h-screen flex items-center justify-center text-white text-center bg-[url('./HomeBG.jpg')]"
  
        >
          <div>
            <h1 className="text-6xl font-kaushan">AgriGo</h1>
            <p className="text-lg italic">Leverage AI power to grow your field to the maximum</p>
            <div className="mt-8 space-x-4">
              <a
                href="#services"
                className="bg-transparent border border-white px-4 py-2 hover:bg-white hover:text-black"
              >
                Find Out
              </a>
              <a
                href="#feature"
                className="bg-transparent border border-white px-4 py-2 hover:bg-white hover:text-black"
              >
                Read More
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="feature" className="py-20 bg-gray-100">
          <div className="text-center mb-12">
            <p className="text-green-500 font-bold">FEATURES</p>
            <h1 className="text-3xl font-bold">WHY CHOOSE US</h1>
          </div>
          <div className="container mx-auto grid md:grid-cols-2 gap-8">
            <div>
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
            <div>
              <img
                src=""
                alt="Features"
                
                className=" rounded-lg shadow-lg mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20">
          <div className="text-center mb-12">
            <p className="text-green-500 font-bold">SERVICES</p>
            <h1 className="text-3xl font-bold">WE PROVIDE</h1>
          </div>
          <div className="container mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-md rounded-lg">
              <img
                src="/images/service-1.jpg"
                alt="Crop Recommendation"
                className="rounded-md mb-4"
              />
              <h2 className="text-xl font-bold text-center">Crop Disease prediction</h2>
              <p className="mt-2 text-center">
                Analyzes soil and weather data to find the best-suited crop.
              </p>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <img
                src="/images/service-3.jpg"
                alt="Fertilizer Recommendation"
                className="rounded-md mb-4"
              />
              <h2 className="text-xl font-bold text-center">Fertilizer Recommendation</h2>
              <p className="mt-2 text-center">
                Analyzes soil and crop type to find the best fertilizer for your crop.
              </p>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <img
                src="/images/service-2.jpg"
                alt="Crop Disease Prediction"
                className="rounded-md mb-4"
              />
              <h2 className="text-xl font-bold text-center">Weather prediction</h2>
              <p className="mt-2 text-center">
                From the images of your crops, our models can check their health.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto grid md:grid-cols-2">
            <div>
              <h1 className="text-2xl font-kaushan">AgriGo</h1>
              <p>Email: AymenMir1001@gmail.com</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-kaushan">AgriGo</h1>
              <p>
                Github: <a href="https://github.com/Aymen1001" className="text-green-500">Aymen1001</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  export default AgriApp;