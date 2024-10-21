import React from 'react';
import image from "../assets/images/headphones.jpg"; // Correct way to import the image

const Hero = () => {
  return (
    <div className="bg-gray-100 py-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Great Deals on Headphones
          </h1>
          <p className="mb-6 text-gray-600 text-lg">
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full">
              View More
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full">
              Buy Incubator
            </button>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:w-1/2">
          <img 
            src={image}  // Use the imported image variable here
            alt="Headphones" 
            className="w-full h-auto object-contain" 
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
