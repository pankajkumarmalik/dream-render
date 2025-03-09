import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loading-text">
        Generating<span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
      <div className="loading-bar-background">
        <div className="loading-bar">
          <div className="white-bars-container">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="white-bar"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
