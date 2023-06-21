import React from 'react';

function RadarScanner() {
  return (
    <div>
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" stroke="blue" strokeWidth="2" fill="none" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="blue" strokeWidth="2">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="3s"
            repeatCount="indefinite"
          />
        </line>
      </svg>
    </div>
  );
}

export default RadarScanner;



