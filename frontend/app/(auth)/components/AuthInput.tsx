/**
 * AuthInput Component
 * 
 * A reusable input component for authentication forms that provides:
 * - Consistent styling across auth forms
 * - Label and input field pairing
 * - Type safety with TypeScript
 * - Accessibility features
 * - Focus and hover states
 * - Form validation support
 * - Auto-complete support
 */

import React from 'react';

/**
 * Props interface for AuthInput component
 * @property id - Unique identifier for the input field
 * @property name - Name attribute for the input field
 * @property type - Type of input (text, password, email, etc.)
 * @property label - Display label for the input field
 * @property value - Current value of the input field
 * @property onChange - Event handler for input changes
 * @property placeholder - Optional placeholder text
 * @property required - Whether the field is required
 * @property autoComplete - Auto-complete attribute value
 */
interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

/**
 * AuthInput Component
 * 
 * Renders a styled input field with an associated label for authentication forms.
 * Provides consistent styling and behavior across the application.
 */
const AuthInput: React.FC<AuthInputProps> = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}) => {
  return (
    <div>
      {/* Input label */}
      <label
        className="block text-sm font-medium text-gray-700 mb-1"
        htmlFor={id}
      >
        {label}
      </label>
      {/* Input field */}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
  );
};

export default AuthInput;