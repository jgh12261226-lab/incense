import React, { useState } from 'react';
import './CustomCTA.css';

export default function CustomCTA({ text, onClick }) {
  const [isSquished, setIsSquished] = useState(false);

  const handleMouseEnter = () => {
    setIsSquished(true);
    setTimeout(() => setIsSquished(false), 600);
  };

  const handleTriggerClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="cta-wrapper">
      <button
        className={`jelly-cta-btn ${isSquished ? 'squish-active' : ''}`}
        onMouseEnter={handleMouseEnter}
        onClick={handleTriggerClick}
      >
        <span className="jelly-btn-face">
          <span className="jelly-text-wrap">
            {text}
            <span className="jelly-arrow">→</span>
          </span>
        </span>
        <span className="jelly-btn-depth"></span>
      </button>
    </div>
  );
}
