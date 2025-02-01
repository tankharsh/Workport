import React from "react";

const Popup = ({ message, type, onClose }) => {
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-80 text-center relative 
        ${type === "error" ? "animate-shake" : ""}`}
      >
        {/* Success (✔) or Error (❌) Icon */}
        <div className="flex justify-center mb-3">
          <div
            className={`rounded-full p-3 ${
              type === "success"
                ? "bg-green-500 animate-pulse"
                : "bg-red-500 animate-bounce"
            }`}
          >
            {type === "success" ? (
              <svg
                className="w-10 h-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M20.292 5.293a1 1 0 0 1 1.415 1.415l-11 11a1 1 0 0 1-1.415 0l-5-5a1 1 0 0 1 1.415-1.415l4.292 4.292 10.293-10.292z"
                />
              </svg>
            ) : (
              <svg
                className="w-10 h-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 10.586L7.707 6.293a1 1 0 0 0-1.414 1.414L10.586 12l-4.293 4.293a1 1 0 0 0 1.414 1.414L12 13.414l4.293 4.293a1 1 0 0 0 1.414-1.414L13.414 12l4.293-4.293a1 1 0 0 0-1.414-1.414L12 10.586z"
                />
              </svg>
            )}
          </div>
        </div>

        <h2 className={`text-xl font-bold ${type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message}
        </h2>

        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded text-white ${
            type === "success" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
