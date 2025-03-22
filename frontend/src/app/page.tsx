'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchAuthors } from '../services/authorService';
import { fetchBooks } from '../services/bookService';
import { useAuthorProvider } from '../providers/useAuthorProvider';
import { useBookProvider } from '../providers/useBookProvider';
import SkeletonLoader from '../components/SkeletonLoader';

export default function HomePage(): JSX.Element {
  const { authors } = useAuthorProvider();
  const { books } = useBookProvider();
  const [stats, setStats] = useState({ totalAuthors: 0, totalBooks: 0, totalReviews: 0 });
  const [recentAuthors, setRecentAuthors] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatsAndRecentItems = async () => {
      try {
        const [fetchedAuthors, fetchedBooks] = await Promise.all([
          fetchAuthors(),
          fetchBooks(),
        ]);

        setStats({
          totalAuthors: fetchedAuthors.length,
          totalBooks: fetchedBooks.length,
          totalReviews: fetchedBooks.reduce((acc, book) => acc + (book.reviewCount || 0), 0),
        });

        setRecentAuthors(fetchedAuthors.slice(0, 3));
        setRecentBooks(fetchedBooks.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatsAndRecentItems();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 animate-fade-in">
        Welcome to the Library Management System
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Manage your books and authors with ease.
      </p>

      {loading ? (
        <SkeletonLoader mode="summary" />
      ) : (
        <div className="w-full max-w-6xl space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white shadow rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800">Total Authors</h2>
              <p className="text-xl text-blue-500">{stats.totalAuthors}</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800">Total Books</h2>
              <p className="text-xl text-green-500">{stats.totalBooks}</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800">Total Reviews</h2>
              <p className="text-xl text-yellow-500">{stats.totalReviews}</p>
            </div>
          </div>

          {/* Recent Authors Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Authors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentAuthors.map((author) => (
                <div
                  key={author.id}
                  className="p-4 bg-white rounded shadow hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{author.name}</h3>
                  <p className="text-sm text-gray-600">{author.bio || 'No biography available.'}</p>
                  <Link
                    href={`/authors/${author.id}`}
                    className="text-blue-500 hover:underline mt-2 block"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Books Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-4 bg-white rounded shadow hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    Published: {book.publicationYear}
                  </p>
                  <p className="text-sm text-gray-600">
                    Reviews: {book.reviewCount || 0}
                  </p>
                  <Link
                    href={`/books/${book.id}`}
                    className="text-green-500 hover:underline mt-2 block"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <Link
              href="/books"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Manage Books
            </Link>
            <Link
              href="/authors"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Manage Authors
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
