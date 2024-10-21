import React from 'react';

const Features = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
          <div className="text-5xl font-bold text-blue-600">500+</div>
          <div className="text-gray-600 text-xl mb-4">Computers</div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
            Browse Now
          </button>
        </div>
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
          <div className="text-5xl font-bold text-blue-600">120+</div>
          <div className="text-gray-600 text-xl mb-4">Electronics</div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
            Browse Now
          </button>
        </div>
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
          <div className="text-5xl font-bold text-blue-600">30+</div>
          <div className="text-gray-600 text-xl mb-4">Gadgets</div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
            Browse Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;
