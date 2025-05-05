import React from 'react';

interface AuthButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  children,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all ${
        disabled || isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'
      } ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;