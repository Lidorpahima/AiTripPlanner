import React from 'react';

interface AuthFormDividerProps {
  text?: string;
}

const AuthFormDivider: React.FC<AuthFormDividerProps> = ({ text = 'or' }) => {
  return (
    <div className="my-4 flex items-center">
      <div className="flex-grow h-px bg-gray-300"></div>
      <p className="mx-4 text-sm text-gray-500">{text}</p>
      <div className="flex-grow h-px bg-gray-300"></div>
    </div>
  );
};

export default AuthFormDivider;