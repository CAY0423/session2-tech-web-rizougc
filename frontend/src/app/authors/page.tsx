'use client';

import { useState, useEffect } from 'react';
import { useAuthorProvider } from '../../providers/useAuthorProvider';
import CreateAuthorModal from '../../components/CreateAuthorModal';
import EditAuthorModal from '../../components/EditAuthorModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Breadcrumb from '../../components/Breadcrumb';
import ButtonPrimary from '../../components/ButtonPrimary';
import ListCard from '../../components/ListCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import Alert from '../../components/Alert';
import { createAuthor, fetchAuthors, updateAuthor } from '../../services/authorService';
import { create } from 'domain';

type SortOption = 'name-asc' | 'name-desc' | 'books-asc' | 'books-desc';

export default function AuthorList(): JSX.Element {
  const { isModalOpen, setModalOpen, addAuthor, removeAuthor } = useAuthorProvider();
  const [authors, setAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [authorToEdit, setAuthorToEdit] = useState<any>(null);
  const [authorToDelete, setAuthorToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const fetchedAuthors = await fetchAuthors();
      setAuthors(fetchedAuthors);
    } catch (error) {
      showAlert('Failed to load authors.', 'error');
    } finally {
      setLoading(false);
    }
  };
 const createAuthor = async (newAuthor: { name: string; bio?: string; photo?: string }) => {
    try {
      await addAuthor(newAuthor);
      showAlert('Author added successfully!', 'success');
      setModalOpen(false);
      loadAuthors();
    } catch (error) {
      console.error('Failed to create author:', error.response?.data || error);
      showAlert('Failed to create author. Please check the provided data.', 'error');
    }
  }
  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleEditAuthor = async (updatedData: { name: string; bio?: string; photo?: string }) => {
    if (authorToEdit) {
      try {
        await updateAuthor(authorToEdit.id, updatedData);
        showAlert('Author updated successfully!', 'success');
        setAuthorToEdit(null);
        loadAuthors();
      } catch (error) {
        console.error('Failed to update author:', error.response?.data || error);
        showAlert('Failed to update author. Please check the provided data.', 'error');
      }
    }
  };

  const handleDelete = async () => {
    if (authorToDelete) {
      try {
        await removeAuthor(authorToDelete.id);
        showAlert('Author deleted successfully!', 'success');
        setDeleteModalOpen(false);
        loadAuthors();
      } catch (error) {
        console.error('Failed to delete author:', error);
        showAlert('Failed to delete author.', 'error');
      }
    }
  };

  const filteredAuthors = authors
    .filter((author) => author.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'books-asc':
          return a.bookCount - b.bookCount;
        case 'books-desc':
          return b.bookCount - a.bookCount;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Breadcrumb />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Authors</h1>
        <ButtonPrimary onClick={() => setModalOpen(true)} className="flex items-center space-x-2">
          <AddIcon />
          <span>Add New Author</span>
        </ButtonPrimary>
      </div>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="relative flex items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <SearchIcon className="absolute left-3 text-gray-400" />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="p-2 border rounded transition duration-200 hover:shadow-lg"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="books-asc">Books (Fewest First)</option>
            <option value="books-desc">Books (Most First)</option>
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 border rounded transition duration-200 hover:shadow-lg flex items-center"
          >
            {viewMode === 'grid' ? <ViewListIcon /> : <GridViewIcon />}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <SkeletonLoader key={index} mode={viewMode} />
          ))}
        </div>
      ) : (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
          {filteredAuthors.map((author) => (
            <ListCard
              key={author.id}
              title={author.name}
              subtitle={`Books written: ${author.bookCount}`}
              description={author.weightedAverageRating ? `Rating: ${author.weightedAverageRating.toFixed(1)}` : 'No reviews yet'}
              authorImage={author.photo}
              link={`/authors/${author.id}`}
              onEdit={() => setAuthorToEdit(author)}
              onDelete={() => {
                setAuthorToDelete(author);
                setDeleteModalOpen(true);
              }}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateAuthorModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(newAuthor) => {
          createAuthor(newAuthor);
        }}
      />
      {authorToEdit && (
        <EditAuthorModal
          isOpen={Boolean(authorToEdit)}
          onClose={() => setAuthorToEdit(null)}
          authorData={authorToEdit}
          onSubmit={handleEditAuthor}
        />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this author? This action cannot be undone."
      />
    </div>
  );
}
