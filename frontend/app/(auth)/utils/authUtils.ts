/**
 * Authentication Utilities
 * 
 * A collection of utility functions for handling authentication-related operations:
 * - Error message extraction and formatting
 * - API response handling
 * - Error state management
 * - Response parsing
 */

/**
 * Extracts and formats error messages from API responses
 * 
 * @param data - The response data from the API
 * @returns Formatted error message string
 * 
 * Handles various error response formats:
 * - String error messages
 * - Object with detail property
 * - Object with field-specific errors
 * - Array of error messages
 */
export const extractErrorMessages = (data: any): string => {
  if (!data) return 'An unexpected error occurred. Please try again.';
  if (typeof data === 'string') return data; 

  let messages: string[] = [];
  if (typeof data === 'object' && data !== null) {
    if (data.detail) {
      messages.push(data.detail);
    } else {
      for (const key in data) {
        if (Array.isArray(data[key])) {
          messages = messages.concat(data[key].map((msg: string) => `${key}: ${msg}`));
        } else if (typeof data[key] === 'string') {
          messages.push(`${key}: ${data[key]}`);
        }
      }
    }
  }

  if (messages.length === 0) {
    return 'An error occurred. Please check your details and try again.';
  }

  return messages.join('\n');
};

/**
 * Common response handling for authentication API calls
 * 
 * @param response - The fetch Response object
 * @returns Parsed response data
 * @throws Error with formatted message if response is not successful
 * 
 * Handles:
 * - JSON parsing
 * - Error message extraction
 * - Response validation
 * - Error state management
 */
export const handleAuthResponse = async (response: Response) => {
  let data: any = {};
  
  try {
    data = await response.json();
  } catch (jsonError) {
    console.error('Failed to parse JSON response:', jsonError);
    try {
      const textResponse = await response.text();
      console.error('Raw text response:', textResponse);
    } catch (textError) {
      console.error('Failed to read response body as text:', textError);
    }
    throw new Error('Error processing server response.');
  }
  
  if (!response.ok) {
    const errorMessage = extractErrorMessages(data);
    throw new Error(errorMessage);
  }
  
  return data;
};