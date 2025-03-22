import { api } from './api';

export async function fetchAuthors() {
  const response = await api.get('/authors');
  return response.data;
}

export async function fetchAuthorById(id: string) {
  const response = await api.get(`/authors/${id}`);
  return response.data;
}

export async function createAuthor(author: {
  name: string;
  bio?: string;
  photo?: string;
}) {
  const response = await api.post('/authors', author);
  return response.data;
}

export async function updateAuthor(
  id: string,
  updatedData: { name: string; bio?: string; photo?: string }
) {
  const response = await api.put(`/authors/${id}`, updatedData);
  return response.data;
}

export async function deleteAuthor(id: string) {
  const response = await api.delete(`/authors/${id}`);
  return response.data;
}

