import React from 'react';
import { MdStorefront, MdHomeRepairService, MdRestaurant } from 'react-icons/md';
import { FaDumbbell, FaSpinner, FaCar, FaDog } from 'react-icons/fa';

const Card = () => {
    const cardsData = [
        {
            icon: <MdStorefront className="w-7 h-7" />,
            title: "Local Shops",
            description:
                "Discover the best local shops near you offering quality products at affordable prices.",
        },
        {
            icon: <MdHomeRepairService className="w-7 h-7" />,
            title: "Home Services",
            description:
                "Find reliable home services including plumbing, electrical, and cleaning at your convenience.",
        },
        {
            icon: <MdRestaurant className="w-7 h-7" />,
            title: "Restaurants",
            description:
                "Explore top-rated restaurants and enjoy delicious cuisines from around the world.",
        },
        {
            icon: <FaDumbbell className="w-7 h-7" />,
            title: "Fitness Centers",
            description:
                "Stay fit by joining the best fitness centers with expert trainers and modern equipment.",
        },
        {
            icon: <FaSpinner className="w-7 h-7" />,
            title: "Beauty Salons",
            description:
                "Pamper yourself with luxurious treatments at nearby beauty salons and spas.",
        },
        {
            icon: <FaCar className="w-7 h-7" />,
            title: "Automotive Services",
            description:
                "Keep your vehicle in top condition with trusted automotive services in your area.",
        },
        {
            icon: <FaDog className="w-7 h-7" />,
            title: "Pet Care",
            description:
                "Provide the best care for your pets with expert veterinarians and grooming services.",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
                        One-Stop for <span className="text-amber-500">All Local</span> Services
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover and connect with the best local businesses, services, and stores in your area
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cardsData.map((card, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                        {card.icon}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-emerald-900 group-hover:text-emerald-700 mb-2 transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Effect Indicator */}
                            <div className="mt-4 flex items-center text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span>Learn More</span>
                                <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Card;