import React from 'react'
import Sidebar from '../../components/sp_components/Sidebar'
import react from '../../assets/react.svg'
import { MdAddPhotoAlternate } from "react-icons/md";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Myshop = () => {

  // animation 
  useGSAP(() =>{

    gsap.from(".myshop",{
      y:-50,
      opacity:0,
      delay:0.2,
      duration:0.1
    })

    var animationImages = gsap.timeline();
    animationImages.from(".shopImage",{
      y: -50,
      delay: 0.1,
      opacity: 0,
      duration: 0.2,
    }),

    animationImages.from(".bannerImage",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    })

    var animationForm = gsap.timeline();
    animationForm.from(".oname",{
      y: -50,
      delay: 0.1,
      opacity: 0,
      duration: 0.2,
    }),

    animationForm.from(".sname",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    }),

    animationForm.from(".semail",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    }),

    animationForm.from(".scontact",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    }),

    animationForm.from(".sadd",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    }),

    animationForm.from(".sdesc",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    }),

    animationForm.from(".scat",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    }),

    animationForm.from(".sprice",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    }),

    animationForm.from(".sBtn",{
      y: -50,
      opacity: 0,
      duration: 0.2,
    })
  })


  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 py-2 mt-20">
        <div className="text-3xl font-bold text-center myshop">My Shop</div>
        <div className="flex flex-col-reverse lg:flex-row justify-evenly mt-10 gap-5">
          <form className="flex flex-col lg:flex-row justify-evenly w-full p-5">
            <div className="flex flex-col gap-24 w-full lg:w-1/3">
              {/* Image Profiles */}
              <div className="shopImage flex flex-wrap justify-center">
                <img
                  src={react}
                  alt="profile Photo"
                  className="h-56 w-56 lg:w-72 border-4 border-sky-500 rounded-xl object-cover"
                />
                <div>
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

              {/* Banner Image */}
              <div className="bannerImage flex flex-wrap justify-center">
                <img
                  src={react}
                  alt="Banner"
                  className="h-56 w-56 lg:w-72 border-4 border-sky-500 rounded-xl object-cover"
                />
                <div>
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <div className="text-center flex justify-center items-center gap-2">
                      <MdAddPhotoAlternate aria-hidden="true" className="mx-auto size-8 text-gray-800" />
                      <span>Upload a file here</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Owner Name */}
                <div className="oname w-full md:w-full lg:w-full">
                  <label htmlFor="owner-name" className="block text-sm font-medium text-gray-900">
                    Owner Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="owner-name"
                      name="owner-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full md:w-full lg:w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm mx-2 md:mx-0"
                    />
                  </div>
                </div>
              </div>

              {/* Shop Name */}
              <div className="sname mt-3">
                <label htmlFor="shop-name" className="block text-sm font-medium text-gray-900">
                  Shop Name
                </label>
                <div className="mt-2">
                  <input
                    id="shop-name"
                    name="shop-name"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm mx-2 md:mx-0"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="semail mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm mx-2 md:mx-0"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="scontact mt-4">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-900">
                  Contact
                </label>
                <div className="mt-2">
                  <input
                    id="contact"
                    name="contact"
                    type="number"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm mx-2 md:mx-0"
                  />
                </div>
              </div>

              {/* Shop Address */}
              <div className="sadd mt-4">
                <label htmlFor="shop-address" className="block text-sm font-medium text-gray-900">
                  Shop Address
                </label>
                <div className="mt-2">
                  <textarea
                    id="shop-address"
                    name="shop-address"
                    rows={3}
                    placeholder="Write full address"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm mx-2 md:mx-0"
                  />
                </div>
              </div>

              {/* Shop Description */}
              <div className="sdesc mt-4">
                <label htmlFor="shop-desc" className="block text-sm font-medium text-gray-900">
                  Shop Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="shop-desc"
                    name="shop-desc"
                    rows={3}
                    placeholder="Write About your shop"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm mx-2 md:mx-0"
                  />
                </div>
              </div>

              {/* Shop Category */}
              <div className="scat mt-4">
                <label htmlFor="shop-category" className="block text-sm font-medium text-gray-900">
                  Shop Category
                </label>
                <div className="mt-2">
                  <input
                    id="shop-category"
                    name="shop-category"
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm mx-2 md:mx-0"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="sprice mt-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-900 capitalize">
                  Price
                </label>
                <div className="mt-2">
                  <input
                    id="price"
                    name="price"
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm mx-2 md:mx-0"
                  />
                </div>
              </div>

              {/* Update Button */}
              <button className="sBtn bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-4 w-full sm:w-auto">
                Update
              </button>
            </div>
          </form>
        </div>

      </main>

    </>
  )
}

export default Myshop