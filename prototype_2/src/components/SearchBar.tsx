'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Close search results when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setLoading(true);
        try {
          const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`);
          const data = await response.json();
          setResults(data);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300); // Debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="search"
          placeholder="Search products..."
          className="w-64 pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </form>

      {showResults && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : results.length > 0 ? (
            <div>
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  onClick={() => setShowResults(false)}
                  className="flex items-center p-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-12 h-12 mr-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  );
} 