// ButtonSecondary.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function ButtonSecondary({ children, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition duration-200"
    >
      {children}
    </button>
  );
}
