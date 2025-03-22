'use client';
import { useState, useEffect } from 'react';
import { useBookProvider } from '../../providers/useBookProvider';
import { useAuthorProvider } from '../../providers/useAuthorProvider';
import ButtonPrimary from '../../components/ButtonPrimary';
import Breadcrumb from '../../components/Breadcrumb';
import CreateBookModal from '../../components/CreateBookModal';
import EditBookModal from '../../components/EditBookModal';
import ListCard from '../../components/ListCard';
import DeleteConfirmation from '../../components/DeleteConfirmationModal';
import Alert from '../../components/Alert';
import SkeletonLoader from '../../components/SkeletonLoader';
import StarIcon from '@mui/icons-material/Star';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

type SortOption = 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc' | 'date-added';

export default function BookList(): JSX.Element {
  const { books, addBook, removeBook, editBook } = useBookProvider();
  const { authors } = useAuthorProvider();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('title-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [bookToEdit, setBookToEdit] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading effect
  useState(() => {
    setTimeout(() => setLoading(false), 200); // Replace this with actual data loading logic
  });

  // Utilise l'ID de l'auteur pour récupérer l'image correspondante
  const getAuthorImage = (authorId: string) => {
    const author = authors.find((author) => author.id === authorId);
    return author ? author.photo : null; // Assure la gestion des auteurs sans photo
  };

  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlert({ message, type });
  };

  const handleCreateBook = (bookData) => {
    addBook(bookData);
    showAlert('Book created successfully!', 'success');
    setIsModalOpen(false);
  };

  const handleEditBook = (bookId, updatedData) => {
    editBook(bookId, updatedData);
    showAlert('Book updated successfully!', 'success');
    setBookToEdit(null);
  };

  const handleDeleteConfirmation = (bookId) => {
    setBookToDelete(bookId);
  };

  const confirmDeleteBook = async () => {
    if (bookToDelete) {
      try {
        await removeBook(bookToDelete);
        showAlert('Book deleted successfully!', 'success');
        setBookToDelete(null);
      } catch (err) {
        console.error("Error deleting book:", err);
        showAlert("Failed to delete the book. Please try again.", 'error');
      }
    }
  };

  const sortedBooks = [...books]
    .filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortOption) {
        case 'title-asc': return a.title.localeCompare(b.title);
        case 'title-desc': return b.title.localeCompare(a.title);
        case 'price-asc': return (a.price ?? 0) - (b.price ?? 0);
        case 'price-desc': return (b.price ?? 0) - (a.price ?? 0);
        case 'rating-asc': return (a.averageRating ?? 0) - (b.averageRating ?? 0);
        case 'rating-desc': return (b.averageRating ?? 0) - (a.averageRating ?? 0);
        case 'date-added': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

  return (
    <div className="relative p-4 sm:p-6">
      <Breadcrumb />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 animate-fade-in">Books</h1>

      {/* Alert component */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Search, Sort, and View Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex items-center w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <SearchIcon className="absolute left-3 text-gray-400" />
        </div>
        <ButtonPrimary onClick={() => setIsModalOpen(true)} className="flex items-center w-full sm:w-auto animate-fade-in-up">
          <AddIcon className="mr-2" /> Add New Book
        </ButtonPrimary>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Sort By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="p-2 border rounded transition duration-200 hover:shadow-lg w-full sm:w-auto"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating-asc">Rating (Low to High)</option>
            <option value="rating-desc">Rating (High to Low)</option>
            <option value="date-added">Date Added (Newest First)</option>
          </select>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-2 border rounded transition duration-200 hover:shadow-lg flex items-center"
        >
          {viewMode === 'grid' ? <ViewListIcon /> : <GridViewIcon />}
        </button>
      </div>

      {/* Book List with Skeleton Loader */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <SkeletonLoader key={index} mode={viewMode} />
          ))}
        </div>
      ) : (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} animate-fade-in-up`}>
          {sortedBooks.map((book) => (
            <ListCard
              key={book.id}
              title={book.title}
              subtitle={`Author: ${book.author.name}`}
              description={`Published in ${book.publicationYear} - Price: $${book.price?.toFixed(2) ?? 'N/A'}`}
              authorImage={getAuthorImage(book.author.id)} // Passe l'image de l'auteur
              link={`/books/${book.id}`}
              onEdit={() => setBookToEdit(book)}
              onDelete={() => handleDeleteConfirmation(book.id)}
              viewMode={viewMode}
            >
              {book.averageRating !== undefined && book.averageRating !== null ? (
                <div className="flex items-center mt-2">
                  <p className="text-gray-600 mr-2">Average Rating:</p>
                  <div className="flex items-center">
                    {[...Array(Math.round(book.averageRating))].map((_, i) => (
                      <StarIcon key={i} className="text-yellow-500" />
                    ))}
                    <p className="ml-1 text-gray-700">({book.averageRating.toFixed(1)})</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No reviews yet</p>
              )}
            </ListCard>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBook}
        authors={authors}
      />

      {bookToDelete && (
        <DeleteConfirmation
          isOpen={Boolean(bookToDelete)}
          onClose={() => setBookToDelete(null)}
          onConfirm={confirmDeleteBook}
          message="Are you sure you want to delete this book and all its reviews?"
        />
      )}

      {bookToEdit && (
        <EditBookModal
          isOpen={Boolean(bookToEdit)}
          onClose={() => setBookToEdit(null)}
          bookData={bookToEdit}
          onSubmit={handleEditBook}
          authors={authors}
        />
      )}

      <style jsx>{`
        .animate-fade-in { animation: fade-in 0.5s ease-in; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
