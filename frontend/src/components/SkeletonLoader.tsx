// components/SkeletonLoader.tsx
import React from 'react';

interface SkeletonLoaderProps {
  mode: 'grid' | 'list';
}

export default function SkeletonLoader({ mode }: SkeletonLoaderProps): JSX.Element {
  return (
    <div
      className={`animate-pulse ${
        mode === 'grid' ? 'w-full p-4 rounded-lg shadow-md bg-gray-100' : 'flex items-center space-x-4 p-4 border rounded-lg bg-gray-100'
      }`}
    >
      {/* Image Placeholder */}
      <div
        className={`${
          mode === 'grid' ? 'h-40 w-full mb-4' : 'h-16 w-16 rounded-full'
        } bg-gray-300`}
      ></div>

      {/* Text Placeholder */}
      <div className="flex-1 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );
}
