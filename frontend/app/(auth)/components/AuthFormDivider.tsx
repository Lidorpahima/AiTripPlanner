/**
 * AuthFormDivider Component
 * 
 * A reusable divider component for authentication forms that provides:
 * - Visual separation between form sections
 * - Optional divider text
 * - Consistent styling across auth forms
 * - Responsive design
 * - Type safety with TypeScript
 */

import React from 'react';

/**
 * Props interface for AuthFormDivider component
 * @property text - Optional text to display in the divider (defaults to 'or')
 */
interface AuthFormDividerProps {
  text?: string;
}

/**
 * AuthFormDivider Component
 * 
 * Renders a horizontal divider with optional text in the center.
 * Used to separate different sections of authentication forms.
 */
const AuthFormDivider: React.FC<AuthFormDividerProps> = ({ text = 'or' }) => {
  return (
    <div className="my-4 flex items-center">
      {/* Left line */}
      <div className="flex-grow h-px bg-gray-300"></div>
      {/* Center text */}
      <p className="mx-4 text-sm text-gray-500">{text}</p>
      {/* Right line */}
      <div className="flex-grow h-px bg-gray-300"></div>
    </div>
  );
};

export default AuthFormDivider;