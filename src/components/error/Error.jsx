import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./ErrorPage.css"; // We'll create this CSS file

export default function ErrorPage() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="error-container">
      <div className="error-animation">
        <div className="orbit">
          <div className="planet"></div>
          <div className="moon"></div>
        </div>
        <div className="astronaut">
          <div className="helmet"></div>
          <div className="body"></div>
        </div>
        <div className="four first">4</div>
        <div className="zero">
          <div className="crater"></div>
        </div>
        <div className="four second">4</div>
      </div>

      <h1 className="error-title">Lost in Space?</h1>
      <p className="error-message">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <button
        className={`error-button ${isHovered ? "hover" : ""}`}
        onClick={handleGoHome}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Return to Earth
        <span className="rocket">🚀</span>
      </button>

      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="star" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.5 + 0.5
          }}></div>
        ))}
      </div>
    </div>
  );
}