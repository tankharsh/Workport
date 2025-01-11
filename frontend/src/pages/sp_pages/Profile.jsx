import React from 'react'
import Sidebar from '../../components/sp_components/Sidebar'
import react from '../../assets/react.svg'
import { MdOutlineAddAPhoto } from "react-icons/md";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


const Profile = () => {
  // animation 
  useGSAP(() => {
    gsap.from(".prof", {
      opacity: 0,
      y: -50,
      delay: 0.2
    })

    gsap.from("#profImg", {
      y: 50,
      delay: 0.2,
      opacity: 0,
      duration: 0.2
    })

    var t1 = gsap.timeline();

    t1.from("#fname", {
      y: -50,
      delay: 0.1,
      opacity: 0,
      duration: 0.2,
    }),

      t1.from("#lname", {
        y: -50,
        opacity: 0,
        duration: 0.2
      }),

      t1.from("#email", {
        y: -50,
        opacity: 0,
        duration: 0.2
      }),

      t1.from("#contact", {
        y: -50,
        opacity: 0,
        duration: 0.2
      }),

      t1.from("#add", {
        y: -50,
        opacity: 0,
        duration: 0.2
      }),

      t1.from("#profBtn", {
        y: -50,
        opacity: 0,
        duration: 0.2
      })

  })


  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 py-2 mt-20">
        <div className='text-3xl font-bold text-center prof'>Profile</div>
        <div className="flex flex-col-reverse lg:flex-row justify-evenly mt-10 gap-5">
          <form className="flex flex-col lg:flex-row justify-evenly gap-10 w-full p-5">
            <div className="w-full lg:w-2/3">
              <div className="flex flex-col md:flex-row gap-4">
                {/* First Name */}
                <div id='fname' className="w-full md:w-1/2">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div id='lname' className="w-full md:w-1/2">
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-900">
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div id='email' className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {/* Contact */}
              <div id='contact' className="mt-4">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-900">
                  Contact
                </label>
                <div className="mt-2">
                  <input
                    id="contact"
                    name="contact"
                    type="number"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {/* Address */}
              <div id='add' className="mt-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-900">
                  Address
                </label>
                <div className="mt-2">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Write full address"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {/* Update Button */}
              <button id='profBtn' className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-4 w-full sm:w-auto">
                Update
              </button>
            </div>
            {/* Image Profile */}
            <div id='profImg' className="flex flex-wrap justify-center lg:justify-between w-full lg:w-1/3">
              <img
                src={react}
                alt="Profile"
                className="h-72 w-72 rounded-xl object-cover border-4 border-sky-500"
              />
              <div className=''>
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <div className="text-center flex justify-center items-center gap-2">
                    <MdOutlineAddAPhoto aria-hidden="true" className="mx-auto size-8 text-gray-800" />
                    <span>Upload a file here</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

      </main >
    </>
  )
}

export default Profile