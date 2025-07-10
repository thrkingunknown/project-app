import axios from 'axios';

/**
 * @param {string} backendUrl - The backend API URL
 * @returns {Promise<string[]>} Array of post IDs
 */
export async function getPostIds(backendUrl = 'https://faxrn.vercel.app') {
  try {
    console.log('Fetching posts for sitemap...');
    const response = await axios.get(`${backendUrl}/posts`);
    
    if (Array.isArray(response.data)) {
      const postIds = response.data.map(post => post._id);
      console.log(`Found ${postIds.length} posts for sitemap`);
      return postIds;
    } else {
      console.warn('Posts data is not an array:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error.message);
    return [];
  }
}
