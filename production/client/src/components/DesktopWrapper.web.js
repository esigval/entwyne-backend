import React from 'react';
import '../styles/DesktopWrapper.css'; // Import your CSS file

const DesktopWrapper = ({ children }) => {
  return (
    <div className="container">
      <div className="contentContainer">
        {children}
      </div>
    </div>
  );
};

export default DesktopWrapper;