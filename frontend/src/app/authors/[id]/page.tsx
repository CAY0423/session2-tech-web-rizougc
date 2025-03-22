'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  fetchAuthorById,
  updateAuthor,
  deleteAuthor,
} from '../../../services/authorService';
import { createBook } from '../../../services/bookService';
import Breadcrumb from '../../../components/Breadcrumb';
import EditAuthorModal from '../../../components/EditAuthorModal';
import CreateBookModal from '../../../components/CreateBookModal';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import ListCard from '../../../components/ListCard';
import ButtonPrimary from '../../../components/ButtonPrimary';
import ButtonSecondary from '../../../components/ButtonSecondary';
import Alert from '../../../components/Alert';
import SkeletonLoader from '../../../components/SkeletonLoader';

export default function AuthorDetail(): JSX.Element {
  const { id } = useParams();
  const router = useRouter();
  const [author, setAuthor] = useState<any>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isBookModalOpen, setBookModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchAuthorById(id)
        .then(setAuthor)
        .catch((error) => {
          console.error(error);
          showAlert('Failed to load author details.', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleUpdateAuthor = async (updatedData: { name: string; bio?: string; photo?: string }) => {
    if (!author) return;
    try {
      await updateAuthor(author.id, updatedData);
      fetchAuthorById(author.id).then(setAuthor);
      showAlert('Author updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update author:', error);
      showAlert('Failed to update author. Please check the provided data.', 'error');
    } finally {
      setEditModalOpen(false);
    }
  };

  const handleAddBook = async (newBook: { title: string; publicationYear: number }) => {
    if (!author) return;
    try {
      await createBook({ ...newBook, authorId: author.id });
      fetchAuthorById(author.id).then(setAuthor);
      showAlert('Book added successfully!', 'success');
    } catch (error) {
      console.error('Failed to add book:', error);
      showAlert('Failed to add book.', 'error');
    } finally {
      setBookModalOpen(false);
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      await deleteAuthor(id);
      showAlert('Author deleted successfully!', 'success');
      router.push('/authors');
    } catch (error) {
      console.error('Failed to delete author:', error);
      showAlert('Failed to delete author.', 'error');
    }
  };

  if (loading) {
    return <SkeletonLoader mode="detail" />;
  }

  if (!author) {
    return <p className="text-center text-gray-600">Author details not available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Breadcrumb />
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <div className="bg-white shadow-lg rounded-lg p-6 animate-fade-in">
        <div className="flex items-start">
          {author.photo ? (
            <img
              src={author.photo}
              alt={author.name}
              className="w-32 h-32 rounded-full object-cover mr-6 border shadow"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mr-6 border shadow">
              <span className="text-gray-500">No Image</span>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{author.name}</h1>
            <p className="mt-2 text-gray-600">{author.bio || 'No biography available.'}</p>

            <div className="flex mt-4 space-x-4">
              <ButtonPrimary onClick={() => setEditModalOpen(true)}>Edit Author</ButtonPrimary>
              <ButtonSecondary onClick={() => setDeleteModalOpen(true)}>Delete Author</ButtonSecondary>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-6">Books by {author.name}</h2>
        {author.books && author.books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {author.books.map((book) => (
              <ListCard
                key={book.id}
                title={book.title}
                subtitle={`Published in ${book.publicationYear}`}
                link={`/books/${book.id}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No books available for this author.</p>
        )}

        <ButtonPrimary onClick={() => setBookModalOpen(true)} className="mt-4">
          Add New Book
        </ButtonPrimary>
      </div>

      {/* Modals */}
      <EditAuthorModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateAuthor}
        authorData={author}
      />

      <CreateBookModal
        isOpen={isBookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSubmit={handleAddBook}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAuthor}
        message="Are you sure you want to delete this author? This action cannot be undone."
      />

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
