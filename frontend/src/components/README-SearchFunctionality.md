# Search Functionality Documentation

## Overview
The search functionality allows users to search through posts by title and content. It includes a responsive search bar in the navbar and a dedicated search results page.

## Components

### 1. Search Bar (in Navbar.jsx)
- **Location**: Integrated into the main navigation bar
- **Responsive Design**: 
  - Desktop: Centered search bar between navigation links and user controls
  - Mobile: Search bar appears at the top of the hamburger menu
- **Features**:
  - Real-time input handling
  - Form submission on Enter key or search button click
  - Automatic navigation to search results page
  - Input clearing after search submission

### 2. SearchResults Component
- **Location**: `/frontend/src/components/SearchResults.jsx`
- **Route**: `/search?q={searchQuery}`
- **Features**:
  - Displays search query and result count
  - Highlights search terms in results
  - Responsive grid layout matching the home page
  - Loading states and error handling
  - Empty state messages

## Backend API

### Search Endpoint
- **URL**: `GET /search?q={query}`
- **Description**: Searches posts by title and content using case-insensitive regex
- **Response**: Array of post objects with populated author information
- **Sorting**: Results sorted by creation date (newest first)

## Usage

### For Users
1. Type search query in the search bar (navbar)
2. Press Enter or click the search icon
3. View results on the dedicated search results page
4. Click on any post card to view the full post

### For Developers
```javascript
const response = await axios.get(
  `${import.meta.env.VITE_BACKEND_URL}/search?q=${encodeURIComponent(query)}`
);
```

## Features

### Search Capabilities
- **Title Search**: Finds posts with matching titles
- **Content Search**: Finds posts with matching content
- **Case Insensitive**: Search is not case-sensitive
- **Partial Matching**: Finds partial word matches

### UI/UX Features
- **Responsive Design**: Works on all screen sizes
- **Modern Styling**: Glass-morphism design matching the app theme
- **Smooth Animations**: Fade and grow animations for better UX
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Search Highlighting**: Search terms are highlighted in results

### Performance
- **Efficient Backend**: Uses MongoDB regex queries
- **Optimized Frontend**: Debounced search and proper state management
- **Error Handling**: Graceful error handling and user feedback

## File Structure
```
frontend/src/components/
├── Navbar.jsx
├── SearchResults.jsx
└── README-SearchFunctionality.md

backend/
├── index.js
└── models/post.js
```

## Styling
- Uses Material-UI components for consistency
- Follows the app's glass-morphism design theme
- Responsive breakpoints: xs (mobile), md (desktop)
- Smooth transitions and hover effects

## Future Enhancements
- Search filters (by author, date, etc.)
- Search suggestions/autocomplete
- Search history
- Advanced search operators
- Full-text search with better ranking
