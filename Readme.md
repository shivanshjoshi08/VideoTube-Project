# VideoTube Project

VideoTube is a robust backend for a video hosting service, built with Node.js, Express.js, and MongoDB. It provides a comprehensive set of features for building a full-fledged video sharing platform, including user authentication, video management, playlists, tweets, subscriptions, and more.

## 🚀 Features

-   **User Authentication**: Secure signup, login, logout, and refresh token mechanism using JWT and bcrypt.
-   **Video Management**: Upload, publish, edit, and delete videos. Support for video files and thumbnails using Cloudinary.
-   **Tweet System**: Create and manage text-based tweets.
-   **Subscription System**: Subscribe to channels and view subscriber counts.
-   **Playlist Management**: Create, update, and delete playlists. Add/remove videos from playlists.
-   **Like System**: Like videos, comments, and tweets.
-   **Comment System**: Add, update, and delete comments on videos.
-   **Dashboard**: View channel statistics (views, subscribers, videos, likes) and manage uploaded videos.
-   **Health Check**: Endpoint to verify the server's health status.

## 🛠️ Tech Stack

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **ODM**: [Mongoose](https://mongoosejs.com/)
-   **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
-   **File Storage**: [Cloudinary](https://cloudinary.com/)
-   **File Handling**: [Multer](https://github.com/expressjs/multer)
-   **Utilities**: [dotenv](https://github.com/motdotla/dotenv), [cors](https://github.com/expressjs/cors), [cookie-parser](https://github.com/expressjs/cookie-parser)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shivanshjoshi08/VideoTube-Project.git
    cd VideoTube-Project
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=8000
    MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
    CORS_ORIGIN=*
    
    ACCESS_TOKEN_SECRET=<your_access_token_secret>
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    REFRESH_TOKEN_EXPIRY=10d
    
    CLOUDINARY_CLOUD_NAME=<your_cloud_name>
    CLOUDINARY_API_KEY=<your_api_key>
    CLOUDINARY_API_SECRET=<your_api_secret>
    ```

4.  **Run the server**
    ```bash
    npm run dev
    ```

## 🔌 API Endpoints

Here is a quick overview of the main API routes:

-   **Users**: `/api/v1/users` (Register, Login, Logout, Profile, History, etc.)
-   **Videos**: `/api/v1/videos` (Upload, Get, Update, Delete, Toggle Publish)
-   **Tweets**: `/api/v1/tweets` (Create, Get User Tweets, Update, Delete)
-   **Subscriptions**: `/api/v1/subscriptions` (Toggle, Get Channels, Get Subscribers)
-   **Playlists**: `/api/v1/playlist` (Create, Add/Remove Video, Get User Playlists)
-   **Comments**: `/api/v1/comments` (Get, Add, Update, Delete)
-   **Likes**: `/api/v1/likes` (Toggle Video/Comment/Tweet Like, Get Liked Videos)
-   **Dashboard**: `/api/v1/dashboard` (Stats, Channel Videos)
-   **Healthcheck**: `/api/v1/healthcheck`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.