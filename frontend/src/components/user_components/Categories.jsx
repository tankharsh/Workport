import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

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
        <div className="relative py-16">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
                    Top Categories
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Explore our most popular service categories trusted by thousands of customers
                </p>
            </div>

            <div className="relative px-4 md:px-8">
                {/* Left Scroll Button */}
                <button
                    onClick={scrollLeft}
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white text-emerald-800 p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10"
                    aria-label="Scroll left"
                >
                    <IoIosArrowBack size={24} />
                </button>

                {/* Scrollable Category List */}
                <div 
                    ref={sliderRef} 
                    className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-4"
                    style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}
                >
                    {categories.map((category) => (
                        <div 
                            key={category._id} 
                            onClick={() => navigate(`/User-Dashboard?category=${category._id}`)}
                            className="flex-none"
                        >
                            <CatCard category={category} />
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={scrollRight}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-emerald-800 p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10"
                    aria-label="Scroll right"
                >
                    <IoIosArrowForward size={24} />
                </button>
            </div>
        </div>
    );
};

const CatCard = ({ category }) => {
    return (
        <div className="group w-72 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
                <img
                    src={`http://localhost:4000/uploads/${category.categoryImage}`}
                    alt={category.categoryName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-emerald-900 capitalize mb-3 group-hover:text-emerald-700 transition-colors">
                    {category.categoryName}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {category.categoryDescription}
                </p>
                
                {/* View Details Link */}
                <div className="mt-4 flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-500">
                    View Services
                    <IoIosArrowForward className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};

export default Categories;
