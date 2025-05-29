/**
 * AuthButton Component
 * 
 * A reusable button component for authentication forms that provides:
 * - Consistent styling across auth forms
 * - Loading state handling
 * - Disabled state handling
 * - Gradient background
 * - Hover effects
 * - Loading spinner animation
 * - Type safety with TypeScript
 * - Accessibility features
 */

import React from 'react';

/**
 * Props interface for AuthButton component
 * @property type - Button type (button, submit, or reset)
 * @property onClick - Optional click event handler
 * @property disabled - Whether the button is disabled
 * @property isLoading - Whether the button is in loading state
 * @property children - Button content
 * @property className - Additional CSS classes
 */
interface AuthButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * AuthButton Component
 * 
 * Renders a styled button with loading state and disabled state handling.
 * Provides consistent styling and behavior across authentication forms.
 */
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
      {/* Loading state with spinner */}
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