'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';

export default function TopCropCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const colors = [product.color];
  const imageUrl = product.imageUrl;

  return (
    <Link href={`/women/topcrop/${product._id}`}>
      <div
        className="group cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container - Shopify-style highlight */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4 aspect-square flex-shrink-0 ring-1 ring-gray-200/60 transition-all duration-300 group-hover:ring-gray-300 group-hover:shadow-lg group-hover:shadow-gray-200/50">
          {/* NEW Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
              NEW
            </span>
          </div>

          {/* Image */}
          <div className="relative w-full h-full p-3 sm:p-4">
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                priority
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33.33vw, 25vw"
                className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Hover Overlay - Hidden on mobile, visible on sm and up */}
          {isHovered && (
            <div className="hidden sm:flex absolute inset-0 bg-black/0 items-end justify-center pb-4 transition-all duration-300">
              <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-gray-800 transition-all duration-200 shadow-lg translate-y-2 group-hover:translate-y-0">
                <FiShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Info - User-friendly layout */}
        <div className="flex-grow flex flex-col px-1">
          {/* Title & Color */}
          <h3 className="text-sm sm:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2 leading-snug group-hover:text-gray-700 transition-colors">
            {product.title.toUpperCase()}
          </h3>

          <p className="text-xs text-gray-500 mb-3 capitalize">
            {product.color}
          </p>

          {/* Color Selector + Price Row */}
          <div className="flex items-center justify-between mb-2">
            {/* Color Selector */}
            <div className="flex gap-1.5">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(index);
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    selectedColor === index
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: getColorCode(color),
                  }}
                  title={color}
                />
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                ${product.price}
              </p>
              {product.discount > 0 && (
                <p className="text-xs font-medium text-red-600">
                  -{product.discount}%
                </p>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mt-auto pt-1">
            {product.stock > 0 ? (
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                {product.stock} in stock
              </p>
            ) : (
              <p className="text-[11px] text-red-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                Out of stock
              </p>
            )}
          </div>
        </div>

        {/* Mobile Add Button */}
        <button className="sm:hidden mt-3 w-full bg-gray-900 text-white py-2.5 rounded-lg text-xs font-medium hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <FiShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

function getColorCode(color) {
  const colorMap = {
    'Black': '#000000',
    'White': '#ffffff',
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Green': '#22c55e',
    'Gray': '#6b7280',
    'Golden': '#d4af37',
    'Maroon': '#800000',
    'Navy': '#000080',
    'Orange': '#ff8c00',
    'Pink': '#ff69b4',
    'Purple': '#800080',
    'Cream': '#fffdd0',
  };

  return colorMap[color] || '#e5e7eb';
}