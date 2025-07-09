import axios from 'axios';

/**
 * @param {string} backendUrl - The backend API URL
 * @returns {Promise<string[]>} Array of post IDs
 */
export async function getPostIds(backendUrl = 'https://project-app-omega-two.vercel.app') {
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

/**
 * @param {string} backendUrl - The backend API URL
 * @returns {Promise<string[]>} Array of unique user IDs
 */
export async function getUserIds(
  backendUrl = "https://project-app-omega-two.vercel.app"
) {
  try {
    console.log("Fetching user IDs for sitemap...");
    const response = await axios.get(`${backendUrl}/posts`);

    if (Array.isArray(response.data)) {
      const userIds = [
        ...new Set(
          response.data
            .map((post) => post.author?._id || post.author)
            .filter((id) => id)
        ),
      ];

      console.log(`Found ${userIds.length} unique users for sitemap`);
      return userIds;
    } else {
      console.warn("Posts data is not an array:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching user IDs for sitemap:", error.message);
    return [];
  }
}
