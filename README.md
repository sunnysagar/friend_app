# Friend Recommendation System

## Objective of the Project
The Friend Recommendation System aims to create a social platform where users can connect and interact with others. The system provides features to manage friend requests, explore mutual connections, and recommend new friends based on shared interests, location, and profession. It is designed to foster meaningful connections among users while ensuring ease of use and scalability.

## Features
1. **User Authentication**:
   - Signup and login functionality using JWT-based authentication.
   - Passwords securely hashed with bcryptjs.
2. **Friend Request Management**:
   - Send, accept, decline, and cancel friend requests.
   - View pending requests.
3. **Friend List Management**:
   - View the list of friends.
   - Remove friends from the list.
4. **Friend Recommendations**:
   - Recommendations based on:
     - Mutual friends.
     - Shared hobbies, city, state, or profession.
   - Search friends by username.
5. **Search Functionality**:
   - Search users by username for quick access.

## Tech Stack Used
### Backend:
- **Node.js**: JavaScript runtime environment for server-side development.
- **Express.js**: Web application framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: MongoDB object modeling for Node.js.
- **bcryptjs**: Password hashing for secure authentication.
- **jsonwebtoken (JWT)**: Token-based authentication for secure user sessions.

## Prerequisites
- **Node.js** and **npm** installed on your system.
- **MongoDB** database installed locally or accessible via a cloud service.

## Installation and Setup
### Backend:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-name.git
   cd your-repo-name/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` folder.
   - Add the following:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:5000`.

### Backend API Endpoints
- **User Authentication**:
  - `POST /api/users/signup`: Register a new user.
  - `POST /api/users/login`: Login a user and retrieve a token.
- **Friend Requests**:
  - `POST /api/friends/request/:userId`: Send a friend request.
  - `POST /api/friends/accept/:requestId`: Accept a friend request.
  - `POST /api/friends/decline/:requestId`: Decline a friend request.
  - `DELETE /api/friends/cancel/:requestId`: Cancel a sent friend request.
- **Friend Management**:
  - `GET /api/friends`: Get the current user's friend list.
  - `DELETE /api/friends/remove/:friendId`: Remove a friend.
- **Recommendations**:
  - `POST /api/recommendations`: Get friend recommendations based on filters (mutual friends, hobbies, city, state, or profession).
- **Search**:
  - `GET /api/users/search?username=<username>`: Search users by username.

## Future Scope
1. **Enhanced Recommendations**:
   - Incorporate machine learning algorithms to improve recommendation accuracy.
   - Add personalized recommendations based on user activity and preferences.
2. **Real-Time Notifications**:
   - Integrate real-time notifications for friend requests and updates.
3. **User Profile Customization**:
   - Allow users to add profile pictures, cover photos, and additional bio details.
4. **Mobile App Support**:
   - Extend the system to a mobile platform with React Native or Flutter.
5. **Social Feed**:
   - Introduce a feed feature to post updates, photos, and statuses.

## Conclusion
The Friend Recommendation System is a scalable and user-friendly platform that bridges connections among users based on common interests, location, and professions. Its robust recommendation algorithm and secure authentication ensure a seamless and secure user experience. With future enhancements, this system can become a comprehensive social networking solution.

