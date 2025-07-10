/**
 * Utility functions for safe regex operations
 */

/**
 * Escapes special regex characters in a string to prevent regex injection
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string safe for use in RegExp constructor
 */
export const escapeRegexCharacters = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  
  // Escape all special regex characters
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * Creates a safe RegExp object from user input
 * @param {string} searchTerm - The search term from user input
 * @param {string} flags - RegExp flags (default: 'gi')
 * @returns {RegExp} - A safe RegExp object
 */
export const createSafeRegex = (searchTerm, flags = 'gi') => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return new RegExp('', flags);
  }
  
  const escapedTerm = escapeRegexCharacters(searchTerm.trim());
  return new RegExp(escapedTerm, flags);
};

/**
 * Highlights text by wrapping matches in a span element
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The term to highlight
 * @param {Object} highlightStyle - CSS styles for highlighting (optional)
 * @returns {Array} - Array of React elements and strings
 */
export const highlightText = (text, searchTerm, highlightStyle = { backgroundColor: '#ffeb3b', fontWeight: 'bold' }) => {
  if (!searchTerm || !searchTerm.trim() || !text) {
    return text;
  }
  
  const escapedSearchTerm = escapeRegexCharacters(searchTerm.trim());
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <span key={index} style={highlightStyle}>
        {part}
      </span>
    ) : part
  );
};
