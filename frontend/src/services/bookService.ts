// bookService.ts
import { api } from './api';
import { deleteReviewsByBookId } from './reviewService';

export async function fetchBooks() {
  const response = await api.get('/books');
  return response.data;
}

export async function fetchBookById(id: string) {
  const response = await api.get(`/books/${id}`);
  return response.data;
}

export async function createBook(book: {
  title: string;
  publicationYear: number;
  authorId: string;
}) {
  const response = await api.post('/books', book);
  return response.data;
}

export async function updateBook(id: string, updatedData: {
  title?: string;
  publicationYear?: number;
  authorId?: string;
  price?: number;
}) {
  const response = await api.put(`/books/${id}`, updatedData);
  return response.data;
}

// Supprime un livre et toutes ses critiques associées
export async function deleteBook(id: string) {
  try {
    // Supprime uniquement le livre, les avis sont supprimés en cascade dans le backend
    const response = await api.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting book and its reviews:", error);
    throw error;
  }
}
