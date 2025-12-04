# VideoTube Project

VideoTube is a full-stack video hosting service, featuring a robust Node.js backend and a modern React frontend. It provides a comprehensive set of features including user authentication, video management, playlists, tweets, subscriptions, and a personalized dashboard.

## 🚀 Features

-   **Full Stack Application**: Seamless integration between Node.js backend and React frontend.
-   **Modern UI**: Sleek **Dark Theme** with a responsive design.
-   **User Authentication**: Secure signup, login, logout, and refresh token mechanism using JWT and bcrypt.
-   **Dashboard**: Comprehensive user dashboard to manage profile, avatar, cover image, password, and view watch history.
-   **Video Management**: Upload, publish, edit, and delete videos. Support for video files and thumbnails using Cloudinary.
-   **Tweet System**: Create and manage text-based tweets.
-   **Subscription System**: Subscribe to channels and view subscriber counts.
-   **Playlist Management**: Create, update, and delete playlists. Add/remove videos from playlists.
-   **Like & Comment**: Interact with videos through likes and comments.
-   **Health Check**: Endpoint to verify the server's health status.

## 🛠️ Tech Stack

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **ODM**: [Mongoose](https://mongoosejs.com/)
-   **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
-   **File Storage**: [Cloudinary](https://cloudinary.com/)
-   **File Handling**: [Multer](https://github.com/expressjs/multer)

### Frontend
-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Styling**: Vanilla CSS (Dark Theme)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shivanshjoshi08/VideoTube-Project.git
    cd VideoTube-Project
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=8000
    MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
    CORS_ORIGIN=http://localhost:5173
    
    ACCESS_TOKEN_SECRET=<your_access_token_secret>
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    REFRESH_TOKEN_EXPIRY=10d
    
    CLOUDINARY_CLOUD_NAME=<your_cloud_name>
    CLOUDINARY_API_KEY=<your_api_key>
    CLOUDINARY_API_SECRET=<your_api_secret>
    ```
    Start the backend:
    ```bash
    npm run dev
    ```

3.  **Frontend Setup**
    Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    npm install
    ```
    Start the frontend:
    ```bash
    npm run dev
    ```

4.  **Access the Application**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔌 API Endpoints

-   **Users**: `/api/v1/users`
-   **Videos**: `/api/v1/videos`
-   **Tweets**: `/api/v1/tweets`
-   **Subscriptions**: `/api/v1/subscriptions`
-   **Playlists**: `/api/v1/playlist`
-   **Comments**: `/api/v1/comments`
-   **Likes**: `/api/v1/likes`
-   **Dashboard**: `/api/v1/dashboard`
-   **Healthcheck**: `/api/v1/healthcheck`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.