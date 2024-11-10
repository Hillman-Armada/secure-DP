'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  privatizeRating, 
  privatizeViews, 
  privatizePriceRecommendation,
  privatizeAggregate 
} from '@/lib/differentialPrivacy';

export default function DifferentialPrivacyDemo() {
  const [originalRating, setOriginalRating] = useState(4.5);
  const [privatizedRating, setPrivatizedRating] = useState(4.5);
  const [epsilon, setEpsilon] = useState(0.1);
  const [iterations, setIterations] = useState(0);
  const [averageError, setAverageError] = useState(0);

  // Demonstrate privacy preservation
  const demonstratePrivacy = () => {
    const newPrivatizedRating = privatizeRating(originalRating, epsilon);
    setPrivatizedRating(newPrivatizedRating);
    
    // Calculate error
    const error = Math.abs(originalRating - newPrivatizedRating);
    setAverageError(prev => (prev * iterations + error) / (iterations + 1));
    setIterations(prev => prev + 1);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Differential Privacy Demonstration</h2>
      
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Original Rating: {originalRating}</p>
          <p className="font-semibold">Privatized Rating: {privatizedRating.toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            Average Error after {iterations} iterations: {averageError.toFixed(4)}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Privacy Parameter (ε):
            <input
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

        <Button onClick={demonstratePrivacy}>
          Apply Differential Privacy
        </Button>

        <div className="mt-4 text-sm text-gray-600">
          <h3 className="font-semibold">How it works:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Original data is modified with carefully calibrated noise</li>
            <li>Privacy parameter ε controls the privacy-utility trade-off</li>
            <li>Each user's data has plausible deniability</li>
            <li>Aggregate statistics remain approximately accurate</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 