import { useEffect, useState } from "react";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

const VerificationModal = ({ isModalOpen, setIsModalOpen }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);


   // Disable background scroll when modal is open
   useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  // Send OTP to user's phone
  const sendOtp = async () => {
    if (!name) return alert("Please enter your name");
    if (!contact) return alert("Please enter your phone number");

    try {
      const response = await fetch("http://localhost:4000/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: contact }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        alert("Error sending OTP: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP");

    try {
      const response = await fetch("http://localhost:4000/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: contact, otp }),
      });

      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        alert("Phone number verified successfully!");
        setIsModalOpen(false);
      } else {
        alert("OTP verification failed!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <h2 className="text-xl text-black font-bold mb-4">
            Releted for Enquiry
          </h2>

          {/* Name Input */}
          <div className="flex items-center mt-2 border p-2 rounded-md">
            <FaUser className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full outline-none text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Phone Input & OTP Send Button */}
          <div className="flex items-center mt-2 border p-2 rounded-md">
            <FaPhone className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Contact Number"
              className="w-full outline-none text-black"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            {!otpSent && (
              <button
                onClick={sendOtp}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Send OTP
              </button>
            )}
          </div>

          {/* OTP Input & Verify Button */}
          {otpSent && !isVerified && (
            <div className="flex items-center mt-2 border p-2 rounded-md">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full outline-none text-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                onClick={verifyOtp}
                className="ml-2 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Email Input */}
          <div className="flex items-center mt-2 border p-2 rounded-md">
            <FaEnvelope className="mr-2 text-gray-500" />
            <input
              type="email"
              placeholder="Email (Optional)"
              className="w-full outline-none text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex mt-4 justify-center gap-7">
          <div className="flex mt-4 justify-center">
            <button
              disabled={!isVerified} // Only allow submission after verification
              className={`py-2 px-6 rounded-lg transition duration-300 ${
                isVerified
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              Check Availability
            </button>
          </div>

           {/* Submit Button */}
           <div className="flex mt-4 justify-center">
            <button
            //   disabled={!isVerified} // Only allow submission after verification
            onClick={() => setIsModalOpen(false)}
              className={`py-2 px-6 rounded-lg transition duration-300 bg-gray-500 text-white hover:bg-gray-600`}
            >
              cancel
            </button>
          </div>
          </div>
        </div>
      </div>
    )
  );
};

export default VerificationModal;
