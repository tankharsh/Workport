import React from "react";
import loading from "../assets/pre.svg";

const Loader = ({ show }) => {
  if (!show) return null; // Prevents unwanted rendering
  return (
    <div className="loading-container">
      <img src={loading} alt="Loading..." className="loading-animation" />
    </div>
  );
};

export default Loader;
