import React from 'react';
import Link from 'next/link';
import ButtonPrimary from './ButtonPrimary';
import ButtonSecondary from './ButtonSecondary';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ListCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  authorImage?: string;
  link: string;
  onEdit: () => void;
  onDelete: () => void;
  date?: string;
  averageRating?: number;
  authorName?: string;
  viewMode: 'grid' | 'list';
  children?: React.ReactNode;
}

export default function ListCard({
  title,
  subtitle,
  description,
  authorImage,
  link,
  onEdit,
  onDelete,
  date,
  averageRating,
  authorName,
  viewMode,
  children,
}: ListCardProps): JSX.Element {
  return (
    <div
      className={`${
        viewMode === 'grid' ? 'flex flex-col h-full' : 'flex flex-col md:flex-row lg-flex-row'
      } items-start bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6 
        space-y-4 md:space-y-0 md:space-x-6 relative border border-gray-200 hover:border-blue-200`}
    >
      {/* Author Image */}
      {authorImage && (
        <img
          src={authorImage}
          alt={`${authorName} author`}
          className={`${
            viewMode === 'grid' ? 'hidden' : 'w-20 h-20'
          } rounded-full object-cover shadow-md border-2 border-gray-200 transition-transform duration-300 transform hover:scale-105`}
        />
      )}

      <div className="flex-1 space-y-3">
        {/* Title and Link */}
        <Link href={link} className="text-blue-600 hover:underline text-2xl font-semibold transition-all duration-300 hover:text-blue-700">
          {title}
        </Link>

        {/* Author Name */}
        {authorName && <p className="text-sm text-gray-500 font-medium">by {authorName}</p>}

        {/* Subtitle */}
        {subtitle && <p className="text-sm text-gray-400 italic">{subtitle}</p>}

        {/* Description */}
        {description && <p className="text-gray-700 mt-2 text-sm leading-relaxed">{description}</p>}

        {/* Date and Rating */}
        <div className="flex items-center space-x-4 text-gray-500 text-sm mt-3">
          {date && (
            <p className="text-gray-400">
              Published on <span className="font-medium text-gray-600">{date}</span>
            </p>
          )}
          {averageRating !== undefined && (
            <div className="flex items-center space-x-1">
              <StarIcon className="text-yellow-500" />
              <p className="font-medium text-gray-600">{averageRating.toFixed(1)}</p>
            </div>
          )}
        </div>

        {/* Extra Content */}
        <div className="mt-4 text-gray-800">{children}</div>
      </div>

      {/* Action Buttons */}
      <div
        className={`${
          viewMode === 'grid'
            ? 'flex justify-between mt-auto pt-4 space-x-2'
            : 'flex flex-col space-y-2 items-stretch md:items-end w-full md:w-auto mt-4 md:mt-0'
        }`}
      >
        <ButtonPrimary onClick={onEdit} className="flex items-center justify-center px-4 py-2 text-sm font-medium shadow transition duration-200 transform hover:scale-105">
          <EditIcon className="mr-2" /> Edit
        </ButtonPrimary>
        <ButtonSecondary onClick={onDelete} className="flex items-center justify-center px-4 py-2 text-sm font-medium shadow transition duration-200 transform bg-red-500 text-white hover:bg-red-600 hover:scale-105">
          <DeleteIcon className="mr-2" /> Delete
        </ButtonSecondary>
      </div>
    </div>
  );
}
