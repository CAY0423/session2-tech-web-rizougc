import { useState, useEffect } from 'react';

interface EditAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedData: {
    name: string;
    bio?: string;
    photo?: string;
  }) => void;
  authorData: {
    id: string;
    name: string;
    bio?: string;
    photo?: string;
  } | null;
}

export default function EditAuthorModal({
  isOpen,
  onClose,
  onSubmit,
  authorData,
}: EditAuthorModalProps): JSX.Element | null {
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (authorData) {
      setName(authorData.name);
      setBio(authorData.bio || 'Cette personne n’a pas encore de biographie.');
      setPhoto(authorData.photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
    }
  }, [authorData]);

  const validatePhotoURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (): void => {
    if (photo && !validatePhotoURL(photo)) {
      setPhotoError('Invalid URL for photo.');
      return;
    }
    setPhotoError(null);
    onSubmit({ name, bio, photo });
    onClose();
  };

  if (!isOpen || !authorData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Edit Author</h2>

        <div className="mb-4">
          <label className="block text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Biography</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Photo URL</label>
          <input
            type="url"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {photoError && <p className="text-red-500 text-sm">{photoError}</p>}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
