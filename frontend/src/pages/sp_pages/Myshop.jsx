import React, { useState } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { FaUser, FaStore, FaPhone, FaList, FaMapMarkerAlt, FaFileImage } from 'react-icons/fa';

const Myshop = () => {
  const [shopLogo, setShopLogo] = useState(null);
  const [shopBanner, setShopBanner] = useState(null);

  // Handle image change
  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen mt-16">
        <div className="text-3xl font-bold text-center prof pt-5">Shop Registration</div>
        <div className="flex m-5 rounded-lg flex-col-reverse lg:flex-row justify-evenly mt-10">
          <form className="flex flex-col lg:flex-row justify-between gap-14 w-full p-5">
            <div className="w-full bg-white p-5 rounded-lg lg:w-1/2">
              <p className="text-black font-semibold mb-2 capitalize">Shop Details</p>

              {/* Owner Name */}
              <div className="flex w-full items-center border border-gray-700 p-2 rounded-md">
                <FaUser className="mr-2 text-gray-700" />
                <input type="text" name="spName" placeholder="Owner Name" className="w-full outline-none text-black placeholder-gray-700" required />
              </div>

              {/* Shop Name */}
              <div className="flex w-full mt-3 items-center border border-gray-700 p-2 rounded-md">
                <FaStore className="mr-2 text-gray-700" />
                <input type="text" name="spShopName" placeholder="Shop Name" className="w-full outline-none text-black placeholder-gray-700" required />
              </div>

              {/* Shop Contact */}
              <div className="flex w-full mt-3 items-center border border-gray-700 p-2 rounded-md">
                <FaPhone className="mr-2 text-gray-700" />
                <input type="tel" name="spContact" placeholder="Shop Contact" className="w-full outline-none text-black placeholder-gray-700" required />
              </div>

              {/* Category */}
              <div className="flex w-full mt-3 items-center border border-gray-700 p-2 rounded-md">
                <FaList className="mr-2 text-gray-700" />
                <input type="text" name="spCategories" placeholder="Shop Category" className="w-full outline-none text-black placeholder-gray-700" required />
              </div>

              {/* Shop Description */}
              <div className="mt-3">
                <textarea name="spDescription" placeholder="Shop Description" className="w-full border border-gray-700 p-2 rounded-md text-black placeholder-gray-700" rows="3" required></textarea>
              </div>

              <p className="text-black font-semibold mt-3">Shop Address</p>

              {/* Block No */}
              <input type="text" name="spBlockNo" placeholder="Block No." className="w-full border border-gray-700 p-2 rounded-md text-black placeholder-gray-700 mt-2" required />

              {/* Area */}
              <input type="text" name="spArea" placeholder="Area" className="w-full border border-gray-700 p-2 rounded-md text-black placeholder-gray-700 mt-2" required />

              {/* Pincode */}
              <input type="text" name="spPincode" placeholder="Pincode" className="w-full border border-gray-700 p-2 rounded-md text-black placeholder-gray-700 mt-2" required />

              {/* City */}
              <input type="text" name="spCity" placeholder="City" className="w-full border border-gray-700 p-2 rounded-md text-black placeholder-gray-700 mt-2" required />

              {/* Shop Logo Upload */}
              <p className="text-black font-semibold mt-3">Upload Shop Image</p>
              <label className="flex items-center cursor-pointer border border-gray-700 p-2 rounded-md mt-2">
                <FaFileImage className="mr-2 text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  name="spShopImage"
                  onChange={(e) => handleImageChange(e, setShopLogo)} className="hidden"
                  required />
                <span className="text-black">Choose Image</span>
              </label>

              {/* Shop Banner Upload */}
              <p className="text-black font-semibold mt-3">Upload Shop Banner</p>
              <label className="flex items-center cursor-pointer border border-gray-700 p-2 rounded-md mt-2">
                <FaFileImage className="mr-2 text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  name="spShopBannerImage"
                  onChange={(e) => handleImageChange(e, setShopBanner)} className="hidden"
                  required
                />
                <span className="text-black">Choose Banner</span>
              </label>

              {/* Submit Button */}
              <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-3 w-full">
                Register Shop
              </button>
            </div>

            {/* Image Previews */}
            <div className="w-1/2 flex flex-col items-center justify-center gap-4">
              {shopLogo && (
                <div className="flex flex-col items-center">
                  <p className="text-white font-semibold">Shop Logo Preview</p>
                  <img src={shopLogo} alt="Shop Logo" className="w-96 h-96 object-conatiner rounded-md border-2 border-green-600" />
                </div>
              )}

              {shopBanner && (
                <div className="flex flex-col items-center">
                  <p className="text-white font-semibold">Shop Banner Preview</p>
                  <img src={shopBanner} alt="Shop Banner" className="w-96 h-56 object-cover rounded-md border-2 border-green-600" />
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Myshop;
