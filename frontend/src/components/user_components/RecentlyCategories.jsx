import React from 'react'

const RecentlyCategories = () => {
  return (
    <>
      <div
        className="h-auto md:mt-16 pt-5 bg-gradient-to-l from-[#7D84B230]/50 via-[#8FA6CB52]/50 to-[#D5F9DE99]/50"
      >
        <h1 className="bg-txt text-center mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold">
          Recently Added
        </h1>
        <div className='p-12 flex flex-wrap gap-10 justify-center items-center'>
          <RcCat />
          <RcCat />
          <RcCat />
          <RcCat />
          <RcCat />
          <RcCat />
          <RcCat />
          <RcCat />
        </div>
      </div>
    </>
  )
}


const RcCat = () => {
  return (
    <>
      <div className="w-64 h-64 bg-white rounded-xl hover:scale-105 duration-300 shadow-lg overflow-hidden">
        <div className="flex justify-center ">
          <div className="w-64 h-38 overflow-hidden border-4 border-pink-100 shadow-md">
            <img
              src="https://cdn.pixabay.com/photo/2022/11/07/17/20/shear-7576856_640.jpg"
              alt="Hair Salon"
              className="bg-cover w-full h-full"
            />
          </div>
        </div>
        <div className="px-6 py-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Hair Salon</h2>
        </div>
      </div>
    </>
  )
}

export default RecentlyCategories