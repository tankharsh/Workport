import React, { useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { toast } from "react-toastify";
import { PiMapPinAreaFill } from "react-icons/pi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { BiSolidCity } from "react-icons/bi";

const Cartpage = () => {
  const { cartItems, removeFromCart } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    if (!address.trim()) {
      toast.error("⚠️ Please enter your address!", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    toast.success("✅ Order Placed Successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      <div className="container mx-auto p-4 flex gap-10">
        {cartItems.length === 0 ? (
          <p className="text-center mx-auto text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-[#52796F] p-2 hover:scale-105 duration-300 transition-all shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[250px] object-cover"
                />
                <div className="p-4 flex flex-wrap justify-between">
                  <h2 className="font-semibold text-left text-2xl mb-2">{item.name}</h2>
                  <p className=" mb-4 text-xl font-semibold flex items-center">
                    <FaRupeeSign className="mr-1" /> {item.price}
                  </p>
                  <button
                    onClick={() => {
                      removeFromCart(index);
                      toast.error("❌ Item Removed From Cart", {
                        position: "bottom-center",
                        autoClose: 1500,
                      });
                    }}
                    className="w-full bg-red-500 font-bold text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="mt-8 p-4 bg-[#52796F] rounded-lg w-1/4 h-40">
            <div className="flex justify-between items-center flex-wrap">
              <span className="text-xl font-bold w-full mb-2">Total Items : 13</span>
              <span className="text-xl font-bold">Total :</span>
              <span className="text-xl font-bold flex items-center">
                <FaRupeeSign className="mr-1" /> {calculateTotal()}
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 w-full bg-green-500 font-bold text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Address Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[550px]">
            <h2 className="text-xl text-black font-bold mb-4">Enter Your Address</h2>

              <div className="flex items-center mt-2 border p-2 rounded-md">
                <PiMapPinAreaFill className="mr-2 text-gray-500" />
                <input
                  type="text"
                  name="sp_area"
                  placeholder="Shop Area"
                  className="w-full outline-none text-black"
                  required
                />
              </div>
              <div className="flex items-center mt-2 border p-2 rounded-md">
                <FaMapLocationDot className="mr-2 text-gray-500" />
                <input
                  type="text"
                  name="sp_block_no"
                  placeholder="Block No"
                  className="w-full outline-none text-black"
                  required
                />
              </div>

            {/* SP Pincode  */}
              <div className="flex items-center mt-2 border p-2 rounded-md">
                <TbMapPinCode className="mr-2 text-gray-500" />
                <input
                  type="text"
                  name="sp_pincode"
                  placeholder="Pincode"
                  className="w-full outline-none text-black"
                  required
                />
              </div>
              <div className="flex items-center mt-2 border p-2 rounded-md">
                <BiSolidCity className="mr-2 text-gray-500" />
                <input
                  type="text"
                  name="sp_city"
                  placeholder="City"
                  className="w-full outline-none text-black"
                  required
                />
              </div>

            <div className="flex mt-2 justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Cartpage;
