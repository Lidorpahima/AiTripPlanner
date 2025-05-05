/**
 * Helper function to extract and format error messages from API responses
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