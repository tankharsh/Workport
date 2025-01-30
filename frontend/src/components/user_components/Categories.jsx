import React, { useRef } from "react";

const Categories = () => {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        sliderRef.current.scrollBy({
            left: -300, // Adjust this value based on your card width
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({
            left: 300, // Adjust this value based on your card width
            behavior: "smooth",
        });
    };

    return (
        <div className="bg-[#DAD4EDB5]/75 mt-12 h-auto relative">
            {/* Heading */}
            <h1 className="bg-txt text-center pt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold">
                Top Categories
            </h1>

            {/* Slider Container */}
            <div className="relative p-6 md:p-12">
                {/* Left Button */}
                <button
                    onClick={scrollLeft}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
                >
                    &#8592;
                </button>

                {/* Scrollable Cards */}
                <div
                    ref={sliderRef}
                    className="flex gap-6 overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
                >

                    <CatCard/>
                    <CatCard/>
                    <CatCard/>
                    <CatCard/>




                </div>

                {/* Right Button */}
                <button
                    onClick={scrollRight}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
                >
                    &#8594;
                </button>
            </div>
        </div>
    );
};


const CatCard = () => {
    return (
        <>
            <div className="txt flex justify-center items-center bg-gray-100">
                <div className="w-80 bg-[#EDC2C1] rounded-xl shadow-lg overflow-hidden">
                    <div className="flex justify-center ">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-100 shadow-md">
                            <img
                                src="https://cdn.pixabay.com/photo/2022/11/07/17/20/shear-7576856_640.jpg"
                                alt="Hair Salon"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    <div className="px-6 py-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Hair Salon</h2>
                        <p className="text-gray-600 text-center text-sm leading-relaxed">
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                            unknown printer took a of type and scramb.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Categories;



