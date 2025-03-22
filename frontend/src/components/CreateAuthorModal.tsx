import { useState } from 'react';

interface CreateAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (author: { name: string; bio?: string; photo?: string }) => void;
}

export default function CreateAuthorModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateAuthorModalProps): JSX.Element | null {
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [photo, setPhoto] = useState<string>('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');

  const handleSubmit = (): void => {
    if (!name) {
      alert("Please enter the author's name.");
      return;
    }
    onSubmit({ name, bio, photo });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Add New Author</h2>

        <div className="mb-4">
          <label className="block text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., J.K. Rowling"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Biography <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short biography of the author"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Photo URL <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="url"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full p-2 border rounded"
          />
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
            Add Author
          </button>
        </div>
      </div>
    </div>
  );
}
