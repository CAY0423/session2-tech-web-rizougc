// ButtonPrimary.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function ButtonPrimary({ children, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
    >
      {children}
    </button>
  );
}
