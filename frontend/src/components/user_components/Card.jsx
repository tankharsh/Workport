import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaCheckDouble } from 'react-icons/fa';
import { GiShop } from 'react-icons/gi';


const Card = () => {
    gsap.registerPlugin(ScrollTrigger);
    const cardsData = [
        {
            icon: <GiShop />,
            title: "Local Shops",
            description:
                "Discover the best local shops near you offering quality products at affordable prices.",
        },
        {
            icon: <GiShop />,
            title: "Home Services",
            description:
                "Find reliable home services including plumbing, electrical, and cleaning at your convenience.",
        },
        {
            icon: <GiShop />,
            title: "Restaurants",
            description:
                "Explore top-rated restaurants and enjoy delicious cuisines from around the world.",
        },
        {
            icon: <GiShop />,
            title: "Fitness Centers",
            description:
                "Stay fit by joining the best fitness centers with expert trainers and modern equipment.",
        },
        {
            icon: <GiShop />,
            title: "Beauty Salons",
            description:
                "Pamper yourself with luxurious treatments at nearby beauty salons and spas.",
        },
        {
            icon: <GiShop />,
            title: "Automotive Services",
            description:
                "Keep your vehicle in top condition with trusted automotive services in your area.",
        },
        {
            icon: <GiShop />,
            title: "Pet Care",
            description:
                "Provide the best care for your pets with expert veterinarians and grooming services.",
        },
    ];

    const sectionRef = useRef(null);
    const leftContentRef = useRef(null);
    const rightImageRef = useRef(null);
    useEffect(() => {
      const section = sectionRef.current;
  
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: 1, // Smooth scrubbing
        },
      })
        .fromTo(
          leftContentRef.current,
          {
            x: -100,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1
          }
        )
        .fromTo(
          rightImageRef.current,
          {
            x: 100,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1
          },
          "-=0.5"
        );
    }, []);

    return (
        <div
        ref={sectionRef}
        className=" mt-5 p-5 bg-[#192B3C] flex flex-col justify-center items-center">
            <div
            ref={leftContentRef}
            className=" bg-white p-5">
                <h1 className="text-xl font-semibold flex gap-5 title">
                    <span className="mt-2">
                        <FaCheckDouble />
                    </span>
                    One-Stop for All Local Businesses, Services, & Stores
                </h1>
                <div
                ref={rightImageRef}
                className="flex gap-5 flex-wrap justify-center mt-10 cards-container">
                    {cardsData.map((card, index) => (
                        <div
                            key={index}
                            className="card h-48 w-80 mt-3 flex gap-3 items-start p-3 border rounded-lg shadow-lg bg-gray-100"
                        >
                            <span className="text-4xl text-red-500">{card.icon}</span>
                            <div>
                                <h2 className="font-bold text-lg">{card.title}</h2>
                                <p>{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Card