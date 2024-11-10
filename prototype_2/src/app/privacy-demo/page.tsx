'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  privatizeRating, 
  privatizeViews, 
  privatizePriceRecommendation,
  privatizeAggregate 
} from '@/lib/differentialPrivacy';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyDemoPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [epsilon, setEpsilon] = useState(0.1);
  const [iterations, setIterations] = useState(100);
  const [results, setResults] = useState<any[]>([]);
  const [averageError, setAverageError] = useState<Record<string, any>>({});

  const runPrivacyDemo = () => {
    if (cartItems.length === 0) {
      alert('Please add some items to cart first!');
      return;
    }

    const newResults = [];
    let totalError: Record<string, any> = {};

    // Initialize total error object for each product
    cartItems.forEach(item => {
      totalError[item._id] = {
        price: 0,
        quantity: 0
      };
    });

    for (let i = 0; i < iterations; i++) {
      const iterationResult: Record<string, any> = {};

      cartItems.forEach(item => {
        // Apply differential privacy to price and quantity
        const privatizedPrice = privatizeAggregate(item.price, epsilon);
        const privatizedQuantity = privatizeAggregate(item.quantity, epsilon);

        iterationResult[item._id] = {
          price: privatizedPrice,
          quantity: privatizedQuantity,
          errors: {
            price: Math.abs(privatizedPrice - item.price),
            quantity: Math.abs(privatizedQuantity - item.quantity)
          }
        };

        // Accumulate errors
        totalError[item._id].price += iterationResult[item._id].errors.price;
        totalError[item._id].quantity += iterationResult[item._id].errors.quantity;
      });

      newResults.push(iterationResult);
    }

    // Calculate average errors
    const newAverageError: Record<string, any> = {};
    Object.keys(totalError).forEach(itemId => {
      newAverageError[itemId] = {
        price: totalError[itemId].price / iterations,
        quantity: totalError[itemId].quantity / iterations
      };
    });

    setResults(newResults);
    setAverageError(newAverageError);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cart Data Privacy Demonstration</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md text-black">
          <p className="text-lg text-gray-600 mb-4">
            Please add some items to your cart to see the privacy demonstration.
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
          {/* Controls Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Privacy Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Privacy Budget (ε):
                  <Input
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={epsilon}
                    onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{epsilon}</span>
                </label>
                <p className="text-xs text-gray-500">
                  Lower ε = More Privacy, Less Accuracy
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of Iterations:
                  <Input
                    type="number"
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value))}
                    min="1"
                    max="1000"
                    className="w-full"
                  />
                </label>
              </div>

              <Button onClick={runPrivacyDemo} className="w-full">
                Run Privacy Demo
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="relative w-12 h-12 mr-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <h3 className="font-medium">{item.name}</h3>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>Original Price: ${item.price.toFixed(2)}</p>
                    <p>Original Quantity: {item.quantity}</p>
                    
                    {results.length > 0 && (
                      <>
                        <p>Latest Privatized Price: ${results[results.length - 1][item._id].price.toFixed(2)}</p>
                        <p>Latest Privatized Quantity: {Math.round(results[results.length - 1][item._id].quantity)}</p>
                      </>
                    )}
                    
                    {averageError[item._id] && (
                      <div className="mt-2 text-gray-600">
                        <p>Average Price Error: ${averageError[item._id].price.toFixed(2)}</p>
                        <p>Average Quantity Error: {averageError[item._id].quantity.toFixed(1)} units</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation Section */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">How Differential Privacy Protects Your Cart Data</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This demonstration shows how differential privacy can protect your shopping behavior while maintaining useful analytics:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Your actual purchase quantities are obscured with carefully calibrated noise</li>
                <li>Price information is protected while maintaining approximate totals</li>
                <li>The privacy parameter (ε) controls how much protection vs accuracy you want</li>
                <li>Even with privacy protection, the store can still analyze overall shopping patterns</li>
                <li>Your individual shopping habits remain private while allowing aggregate analysis</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 