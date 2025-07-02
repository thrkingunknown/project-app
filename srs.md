**FAXRN Projects**
**Software Requirements Specification**

**1. FAXRN FORUM APP**

**Overview**: Develop a full-stack MERN (MongoDB, Express.js, React, Node.js) Forum Application. The platform will allow users to engage in discussions by creating posts, commenting on them, and interacting with content created by other users.

**Product Functions**:
1.  User Authentication (Login & Registration)
2.  Browse and view forum posts and topics.
3.  Create, Read, Update, and Delete (CRUD) forum posts.
4.  Create, Read, Update, and Delete (CRUD) comments on posts.
5.  User profile management.
6.  Administrative controls for managing users and content.

**User Groups**:

*   **Guests**: Can view forum posts but cannot interact (e.g., comment, like, or create posts).
*   **Users/Members:**
    1.  Can perform all Guest actions.
    2.  After logging in, can create new posts.
    3.  Can read, edit, and delete their **OWN** posts and comments.
    4.  Can like and comment on posts from other users.
*   **Admin**:
    1.  Has all the permissions of a standard User/Member.
    2.  Can manage all users, including blocking or deleting their accounts.
    3.  Can manage all content, including editing or deleting any post or comment on the platform.
    4.  Has a separate, pre-defined login credential.

**Requirements:**

1.  **Pages Required:**
    1.  **Login/Sign Up Page**
        1.  A registration (Sign Up) page for new users.
        2.  A login page for existing users and the Admin.
        3.  Admin credentials must be pre-defined and not available via public sign-up.
        4.  Upon successful login, users are redirected to the Home Page.
    2.  **Home Page**
        1.  Lists the most recent or popular forum posts.
        2.  Each post listed should be a clickable link that navigates to the single post page.
    3.  **Single Post Page**
        1.  Displays the full content of a single post.
        2.  Displays all comments associated with the post.
        3.  Provides functionality for logged-in users to add a new comment.
    4.  **Create Post Page**
        1.  A form for logged-in users to create and submit a new forum post.
    5.  **Edit Post Page**
        1.  A form, pre-filled with existing content, for a user to edit their own post.
    6.  **User Profile Page**
        1.  Displays user information.
        2.  Lists all posts created by that user.
        3.  Allows the user to edit their own profile information.
    7.  **Admin Dashboard**
        1.  A page for the Admin to view and manage all users and posts on the platform.

2.  **General Requirements:**
    1.  Every page must feature a consistent navigation bar (navbar).
    2.  The navbar should include the application logo and navigation links to key pages like Home.
    3.  The navbar should dynamically display a "Login/Sign Up" button for guests or "Profile/Logout" options for authenticated users.
    4.  The application must be responsive and function correctly on various screen sizes (desktop, tablet, mobile).

**USER/MEMBER VIEW**

1.  **Forum/Post Viewing**
    1.  The user must be able to view all public posts.
    2.  The user must be able to like/react to and comment on posts.
2.  **Post Management (C.R.E.D)**
    1.  **Create**: Users must be able to create new posts through a dedicated form.
    2.  **Read**: Users can read their own posts and posts by others.
    3.  **Update**: Users must be able to edit the content of their own posts.
    4.  **Delete**: Users must be able to delete their own posts.
3.  **Logout**
    1.  A logout button must be provided for a successful and secure exit from the application.

**ADMIN VIEW**

1.  **Admin Login**
    1.  After a successful login with admin credentials, the admin must be redirected to the Admin Dashboard.
2.  **Admin Dashboard**
    1.  **User Management**:
        *   List all registered users.
        *   Provide options to block or delete any user account.
    2.  **Content Management**:
        *   List all posts from all users.
        *   Provide options to delete any post or comment on the platform.
3.  **General Admin Functions**
    1.  The Admin can perform all actions available to a standard user, such as creating, editing, and deleting their own posts.
4.  **Logout**
    1.  A logout button must be provided for a successful exit.
