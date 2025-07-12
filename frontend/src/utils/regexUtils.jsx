
/**
 * @param {string} string
 * @returns {string}
 */
export const escapeRegexCharacters = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * @param {string} searchTerm
 * @param {string} flags
 * @returns {RegExp}
 */
export const createSafeRegex = (searchTerm, flags = 'gi') => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return new RegExp('', flags);
  }
  
  const escapedTerm = escapeRegexCharacters(searchTerm.trim());
  return new RegExp(escapedTerm, flags);
};

/**
 * @param {string} text
 * @param {string} searchTerm
 * @param {Object} highlightStyle
 * @returns {Array}
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
