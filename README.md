# EchoWords

## Table of Contents


- [Features](#features)
- [Tech Stack](#tech-stack)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Demo](#demo)


## Features

- **User Authentication**

  - Register with username, email and password
  - Secure login with JWT-based authentication
  - access token and refresh token that produces a new access token on reload

- **User Profile**

  - View user information with ability to update them:
    - Profile photo.
    - Username.
    - Email
    - Password

- **User Feed**

  - Create new posts with title, body, and image via uploading
  - Images are uploaded to Imgbb server
  - Edit and delete only user own blogs
  - View all users' posts

- **Protected Routes**
  - Only authenticated users can access Profile page.
 
- **404 Page**
  - Shows 404 not found page

## Tech Stack

**Frontend:**

- React 19 - React Router v7 - Tailwind CSS - DaisyUI - React infinite scroll component - React Toastify - Joi - Frame motion

**Backend:**

- Express v5 - JsonWebToken - CORS - Mongoose v8 - Bcrypt - Joi


## Backend Setup

1. **Install dependencies:**

   ```bash
   cd Backend
   npm install
   ```

2. **Configure environment variables:**

   - Create a `.env` file in `Backend/` and have:
     ```
     PORT=3000
     JWT_ACCESS_SECRET=
     JWT_ACCESS_EXPIRES_IN=
     JWT_REFRESH_SECRET=
     JWT_REFRESH_EXPIRES_IN=
     MAX_AGE=
     DATABASE_URL=
     ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run at `http://localhost:3000`.

## Frontend Setup


1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**

   - Edit `.env` in `frontend/` to set the backend URL and ImgBB API key (first variable):
     ```
     VITE_API_KEY=
     VITE_API_ENDPOINT=http://localhost:3000/api/v1
     ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173` by default.

## Demo

https://github.com/user-attachments/assets/44a0a6ec-1b02-44f0-8e38-08a6385636e6












