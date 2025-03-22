'use client';
import Link from 'next/link';

export default function Navigation(): JSX.Element {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <ul className="flex justify-center space-x-8">
        <li>
          <Link
            href="/"
            className="text-white px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/books"
            className="text-white px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Books
          </Link>
        </li>
        <li>
          <Link
            href="/authors"
            className="text-white px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Authors
          </Link>
        </li>
      </ul>
    </nav>
  );
}
