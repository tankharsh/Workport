import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
    const sliderRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/categories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    return (
        <div className="text-white mt-6 h-auto relative">
            <h1 className="bg-txt text-center pt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold">
                Top Categories
            </h1>

            <div className="relative p-6 md:p-12">
                {/* Left Scroll Button */}
                <button
                    onClick={scrollLeft}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
                >
                    &#8592;
                </button>

                {/* Scrollable Category List */}
                <div ref={sliderRef} className="flex gap-6 overflow-x-scroll scrollbar-hide snap-x snap-mandatory">
                    {categories.map((category) => (
                        <div key={category._id} onClick={() => navigate(`/User-Dashboard?category=${category._id}`)}>
                            <CatCard category={category} />
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button */}
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

const CatCard = ({ category }) => {
    return (
        <div className="txt flex justify-center items-center cursor-pointer">
            <div className="w-80 bg-[#52796F] rounded-xl shadow-lg overflow-hidden">
                <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-100 shadow-md">
                        <img
                            src={`http://localhost:4000/uploads/${category.categoryImage}`}
                            alt={category.categoryName}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-center text-white mb-4">{category.categoryName}</h2>
                    <p className="text-white text-center text-sm leading-relaxed">
                        {category.categoryDescription}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Categories;
