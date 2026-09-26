'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';

export default function PunjabiCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const colors = [product.color];
  const imageUrl = product.imageUrl;

  return (
    <Link href={`/punjabi/${product._id}`}>
      <div 
        className="group cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3 sm:mb-4 aspect-square flex-shrink-0">
          {/* NEW Badge */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
            <span className="bg-gray-300 text-gray-700 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
              NEW
            </span>
          </div>

          {/* Image */}
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              priority
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33.33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Hover Overlay - Hidden on mobile, visible on sm and up */}
          {isHovered && (
            <div className="hidden sm:flex absolute inset-0 bg-black bg-opacity-5 items-center justify-center transition-all duration-300">
              <button className="bg-white text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <FiShoppingBag className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-grow flex flex-col">
          {/* Title */}
          <h3 className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.title.toUpperCase()}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-gray-500 mb-2 sm:mb-3 capitalize">
            {product.color}
          </p>

          {/* Color Selector */}
          <div className="flex gap-2 mb-3 sm:mb-4">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(index);
                }}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all ${
                  selectedColor === index 
                    ? 'border-gray-900' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: getColorCode(color),
                }}
                title={color}
              />
            ))}
          </div>

          {/* Price and Stock */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                  ${product.price}
                </p>
                {product.discount > 0 && (
                  <p className="text-xs text-red-600">
                    {product.discount}% Off
                  </p>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <p className={`text-xs ${product.stock > 0 ? 'text-gray-400' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>

        {/* Mobile Add Button */}
        <button className="sm:hidden mt-3 w-full bg-gray-900 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          <FiShoppingBag className="w-4 h-4" />
          Add
        </button>
      </div>
    </Link>
  );
}

function getColorCode(color) {
  const colorMap = {
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ef4444',
    'blue': '#3b82f6',
    'green': '#22c55e',
    'gray': '#6b7280',
    'golden': '#d4af37',
    'maroon': '#800000',
    'navy': '#000080',
    'orange': '#ff8c00',
    'pink': '#ff69b4',
    'purple': '#800080',
    'cream': '#fffdd0',
  };

  return colorMap[color.toLowerCase()] || '#e5e7eb';
}