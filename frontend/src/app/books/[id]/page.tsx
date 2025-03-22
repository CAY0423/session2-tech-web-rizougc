'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchBookById, deleteBook, updateBook } from '../../../services/bookService';
import { fetchReviews } from '../../../services/reviewService';
import Breadcrumb from '../../../components/Breadcrumb';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import EditBookModal from '../../../components/EditBookModal';
import { Drawer, Button, IconButton, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import Alert from '../../../components/Alert';
import Link from 'next/link';
import { useAuthorProvider } from '../../../providers/useAuthorProvider';

interface Author {
  id: string;
  name: string;
  photo?: string;
}

interface Book {
  id: string;
  title: string;
  price: number;
  publicationYear: number;
  author: Author;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export default function BookDetail(): JSX.Element {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { authors } = useAuthorProvider();
  useEffect(() => {
    if (id) {
      fetchBookById(id)
        .then(setBook)
        .catch(() => setAlert({ message: 'Failed to load book details.', type: 'error' }));
      loadReviews();
    }
  }, [id]);

  const getAuthorImage = (authorId: string) => {
    const author = authors.find((author) => author.id === authorId);
    return author ? author.photo : null; // Assure la gestion des auteurs sans photo
  };
  const loadReviews = async (): Promise<void> => {
    try {
      const fetchedReviews = await fetchReviews(id);
      setReviews(fetchedReviews);
    } catch {
      setAlert({ message: 'Failed to load reviews.', type: 'error' });
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteBook(id);
      setAlert({ message: 'Book deleted successfully.', type: 'success' });
      router.push('/books');
    } catch {
      setAlert({ message: 'Failed to delete the book.', type: 'error' });
    }
  };

  const handleEditBook = async (bookId: string, updatedData: Partial<Book>): Promise<void> => {
    try {
      await updateBook(bookId, updatedData);
      setAlert({ message: 'Book updated successfully.', type: 'success' });
      setEditModalOpen(false);
      fetchBookById(id).then(setBook); // Refresh book data
    } catch {
      setAlert({ message: 'Failed to update book.', type: 'error' });
    }
  };

  const toggleDrawer = (): void => setDrawerOpen(!isDrawerOpen);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!book) {
    return <p className="text-center text-gray-600">Book details not available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Breadcrumb />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center space-x-6">
            <img
              src={getAuthorImage(book.author.id) || ''}
                
              alt={book.author.name}
              className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-gray-300"
            />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
            <Link href={`/authors/${book.author.id}`} className="text-blue-500 hover:underline">
              {book.author.name}
            </Link>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-lg text-gray-700 font-bold">Price: <span className="font-medium">${book.price}</span></p>
          <p className="text-lg text-gray-700 font-bold">Publication Year: <span className="font-medium">{book.publicationYear}</span></p>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button
            variant="contained"
            color="primary"
            onClick={toggleDrawer}
          >
            View Reviews
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setModalOpen(true)}
          >
            Delete Book
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setEditModalOpen(true)}
          >
            Edit Book
          </Button>
        </div>
      </div>

      {/* Drawer for Reviews */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
        <div className="p-4 w-80 bg-gray-50 h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Reviews</h2>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </div>
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="bg-white p-3 rounded shadow hover:shadow-md transition"
              >
                <div className="flex items-center">
                  {[...Array(review.rating)].map((_, index) => (
                    <StarIcon key={index} className="text-yellow-500" />
                  ))}
                  <p className="ml-2 text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {review.comment && <p className="mt-2 text-gray-700">{review.comment}</p>}
              </li>
            ))}
          </ul>
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this book? This action cannot be undone."
      />

      {/* Edit Book Modal */}
      {editModalOpen && (
        <EditBookModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          bookData={book}
          onSubmit={handleEditBook}
        />
      )}

      {/* Alert */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.6s ease-in-out;
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
