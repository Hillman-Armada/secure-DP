'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';

interface ProductDetailProps {
  product: Product;
  size?: 'small' | 'large';
}

export default function ProductDetail({ product, size = 'small' }: ProductDetailProps) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  // Dimensions based on size prop
  const dimensions = {
    small: {
      width: 250,
      height: 300,
      containerClass: 'w-[250px]',
      buttonSize: 'sm' as const,
    },
    large: {
      width: 400,
      height: 500,
      containerClass: 'w-full max-w-[400px]',
      buttonSize: 'default' as const,
    },
  };

  const { width, height, containerClass, buttonSize } = dimensions[size];

  return (
    <div className={`${containerClass} rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white`}>
      <Link href={`/products/${product._id}`}>
        <div className="relative">
          <Image
            src={product.image}
            alt={product.name}
            width={width}
            height={height}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors" />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4">
          {product.description.substring(0, size === 'small' ? 100 : 200)}...
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">₹{product.price.toFixed(2)}</span>
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm">In Stock</span>
            ) : (
              <span className="text-red-600 text-sm">Out of Stock</span>
            )}
          </div>
          
          {product.ratings && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product?.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.numReviews} reviews)
              </span>
            </div>
          )}
          
          <Button 
            onClick={handleAddToCart}
            size={buttonSize}
            variant="default"
            disabled={product.stock === 0}
            className="w-full"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
} 