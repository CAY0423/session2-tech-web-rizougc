'use client';
import { useEffect, useState } from 'react';
import { fetchAuthors, createAuthor, updateAuthor, deleteAuthor } from '../services/authorService';
import { Author } from '../models/Author';

export const useAuthorProvider = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const loadAuthors = async () => {
    try {
      const data = await fetchAuthors();
      setAuthors(data);
    } catch (error) {
      console.error('Failed to load authors:', error);
    }
  };

  const addAuthor = async (newAuthor: Omit<Author, 'id' | 'bookCount'>) => {
    try {
      await createAuthor(newAuthor);
      loadAuthors();
    } catch (error) {
      console.error('Failed to add author:', error);
    }
  };

  const editAuthor = async (id: string, updatedData: Omit<Author, 'id' | 'bookCount'>) => {
    try {
      await updateAuthor(id, updatedData);
      loadAuthors();
    } catch (error) {
      console.error('Failed to update author:', error);
    }
  };

  

  const removeAuthor = async (id: string) => {
    try {
      await deleteAuthor(id);
      loadAuthors();
    } catch (error) {
      console.error('Failed to delete author:', error);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  return {
    authors,
    isModalOpen,
    setModalOpen,
    addAuthor,
    editAuthor,
    removeAuthor,
  };
};
