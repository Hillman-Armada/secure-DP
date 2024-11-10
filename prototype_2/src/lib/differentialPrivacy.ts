// Laplace Mechanism for numerical values
export function addLaplaceNoise(value: number, sensitivity: number, epsilon: number): number {
  const scale = sensitivity / epsilon;
  const noise = laplaceSample(scale);
  return value + noise;
}

// Exponential Mechanism for categorical values
export function exponentialMechanism<T>(
  options: T[],
  utilityScores: number[],
  sensitivity: number,
  epsilon: number
): T {
  const probabilities = utilityScores.map(score => 
    Math.exp((epsilon * score) / (2 * sensitivity))
  );
  const sumProb = probabilities.reduce((a, b) => a + b, 0);
  const normalizedProbs = probabilities.map(p => p / sumProb);
  
  const rand = Math.random();
  let cumSum = 0;
  for (let i = 0; i < normalizedProbs.length; i++) {
    cumSum += normalizedProbs[i];
    if (rand <= cumSum) return options[i];
  }
  return options[options.length - 1];
}

// Helper function to generate Laplace noise
function laplaceSample(scale: number): number {
  const u = Math.random() - 0.5;
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}

// Function to add noise to product ratings
export function privatizeRating(rating: number, epsilon: number = 0.1): number {
  const sensitivity = 1; // One user can change rating by at most 1
  return addLaplaceNoise(rating, sensitivity, epsilon);
}

// Function to add noise to product views/popularity
export function privatizeViews(views: number, epsilon: number = 0.5): number {
  const sensitivity = 1; // One user contributes one view
  return Math.round(addLaplaceNoise(views, sensitivity, epsilon));
}

// Function to privatize price recommendations
export function privatizePriceRecommendation(
  prices: number[],
  utilities: number[],
  epsilon: number = 0.1
): number {
  return exponentialMechanism(prices, utilities, 1, epsilon);
}

// Function to add noise to aggregate statistics
export function privatizeAggregate(value: number, epsilon: number = 0.1): number {
  const sensitivity = 1;
  return addLaplaceNoise(value, sensitivity, epsilon);
} 