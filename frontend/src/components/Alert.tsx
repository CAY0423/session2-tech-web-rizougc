// components/Alert.tsx
import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

export default function Alert({ message, type, onClose }: AlertProps): JSX.Element {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="mr-2" />;
      case 'error':
        return <FaExclamationCircle className="mr-2" />;
      case 'warning':
        return <FaExclamationTriangle className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 
      transition-transform transform translate-x-full animate-slide-in ${getAlertStyles()}`}
    >
      {getIcon()}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 text-lg font-bold cursor-pointer">
        <FaTimes />
      </button>
      <style jsx>{`
        .animate-slide-in {
          animation: slide-in 0.5s ease forwards;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
