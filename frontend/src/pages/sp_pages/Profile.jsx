import React, { useState } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { MdOutlineAddAPhoto } from "react-icons/md";
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

import avatar1 from '../../assets/avatar1.jpg'
import avatar2 from '../../assets/avatar2.jpg'
import avatar3 from '../../assets/avatar3.jpg'
import avatar4 from '../../assets/avatar4.jpg'
import avatar5 from '../../assets/avatar5.jpg'
import avatar6 from '../../assets/avatar2.jpg'

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

const Profile = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]); // Default to first avatar
  
    // Handle avatar selection
    const handleAvatarSelect = (avatar) => {
      setSelectedAvatar(avatar);
    };
  
    return (
      <>
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-h-screen mt-16">
          <div className="text-3xl font-bold text-center prof pt-5">Profile</div>
          <div className="flex m-5 rounded-lg flex-col-reverse lg:flex-row justify-evenly mt-10">
            <form className="flex bg-white rounded-lg flex-col lg:flex-row justify-between gap-14 w-full p-5 h-96">
              <div className="w-full  p-5 rounded-lg lg:w-1/2">
                <p className="text-black font-semibold mb-2 capitalize">Your Personal Details</p>
  
                {/* Name Field */}
                <div id='fname' className="flex w-full items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                  <FaUser className="mr-2 text-gray-700" />
                  <input type="text" name="sp_name" placeholder="Enter your name" className="w-full outline-none text-black placeholder:text-gray-700" required />
                </div>
  
                {/* Email Field */}
                <div id='email' className="flex w-full mt-3 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                  <FaEnvelope className="mr-2 text-gray-700" />
                  <input type="email" name="sp_email" placeholder="Enter your email" className="w-full outline-none text-black placeholder:text-gray-700" required />
                </div>
  
                {/* Contact Field */}
                <div id='contact' className="flex mt-3 w-full items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                  <FaPhone className="mr-2 text-gray-700" />
                  <input type="tel" name="sp_contact" placeholder="Enter your contact no" className="w-full outline-none text-black placeholder:text-gray-700" required />
                </div>
  
                {/* Avatar Selection */}
                <p className="text-black font-semibold mt-3">Choose Your Avatar</p>
                <div className="flex gap-2 flex-wrap">
                  {avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                        selectedAvatar === avatar ? "border-green-500" : "border-transparent"
                      }`}
                      onClick={() => handleAvatarSelect(avatar)}
                    />
                  ))}
                </div>
  
                {/* Update Button */}
                <button id='profBtn' className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-3 w-full sm:w-auto">
                  Update
                </button>
              </div>
  
              {/* Profile Image Preview */}
              <div className="w-1/2 flex justify-center items-center">
                <img
                  src={selectedAvatar}
                  alt="Profile Avatar"
                  className="w-64 h-64 object-cover border-green-600 rounded-full border-4"
                />
              </div>
            </form>
          </div>
        </main>
      </>
    );
  };
  
  export default Profile;