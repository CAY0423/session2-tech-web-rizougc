// ModalWrapper.tsx
import React from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalWrapper({
  isOpen,
  onClose,
  children,
}: ModalWrapperProps): JSX.Element | null {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center transition-opacity duration-300"
      onClick={handleOutsideClick}
    >
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-transform duration-300">
        {/* Close button in the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        {/* Modal content */}
        {children}
      </div>
    </div>
  );
}
