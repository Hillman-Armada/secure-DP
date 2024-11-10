'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const categories = [
  'All',
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
];

export default function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <nav className="mb-8">
      <ul className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={category === 'All' ? '/products' : `/products?category=${category}`}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
} 