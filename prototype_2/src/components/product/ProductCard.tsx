'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { privatizeRating, privatizeViews } from '@/lib/differentialPrivacy';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [privatizedRating, setPrivatizedRating] = useState(product.ratings || 0);
  const [privatizedViews, setPrivatizedViews] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    // Apply differential privacy to ratings and views
    setPrivatizedRating(privatizeRating(product.ratings || 0));
    setPrivatizedViews(privatizeViews(Math.floor(Math.random() * 1000))); // Demo views
  }, [product.ratings]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-48">
          <Image
            src={imageError ? '/placeholder-product.jpg' : product.image}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      </Link>
      <div className="p-4 text-black">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {product.description.substring(0, 100)}...
        </p>
        <div className="flex items-center justify-between text-black">
          <div>
            <span className="font-bold">${product.price.toFixed(2)}</span>
            <div className="text-sm text-gray-500">
              Rating: {privatizedRating.toFixed(1)} ★
              <span className="ml-2">{privatizedViews} views</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
} 