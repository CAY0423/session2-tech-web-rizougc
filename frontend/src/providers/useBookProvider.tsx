// useBookProvider.ts
import { useEffect, useState } from 'react';
import { fetchBooks, createBook, deleteBook, updateBook } from '../services/bookService';
import { Book } from '../models';

export const useBookProvider = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const booksData = await fetchBooks();
      setBooks(booksData);
    } catch (err) {
      setError("Failed to load books. Please try again.");
      console.error("Error loading books:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = async (newBook: Omit<Book, 'id'>) => {
    setError(null);
    try {
      await createBook(newBook);
      loadBooks();
    } catch (err) {
      setError("Failed to add the book. Please try again.");
      console.error("Error adding book:", err);
    }
  };

  const removeBook = async (bookId: string) => {
    setError(null);
    try {
      await deleteBook(bookId); // Appel direct à deleteBook
      loadBooks();
    } catch (err) {
      setError("Failed to delete the book and its reviews. Please try again.");
      console.error("Error deleting book and its reviews:", err);
    }
  };

  const editBook = async (bookId: string, updatedData: Partial<Book>) => {
    setError(null);
    try {
      await updateBook(bookId, updatedData);
      loadBooks();
    } catch (err) {
      setError("Failed to edit the book. Please try again.");
      console.error("Error editing book:", err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return {
    books,
    isModalOpen,
    setModalOpen,
    addBook,
    removeBook,
    editBook,
    isLoading,
    error,
  };
};
