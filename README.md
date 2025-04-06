# Xplore NU Backend

Backend service for the Xplore NU mobile application, providing authentication, campus points of interest, and event management functionality.

## API Documentation

Comprehensive API documentation generated using JSDoc is available in the [docs folder](./docs/index.html).

The documentation includes:
- Detailed descriptions of all controllers, models, and utility functions
- Complete parameter and return type information for all methods
- Clear explanations of authentication flows and data structures

## Features

- User authentication (register, login, logout, token refresh)
- Password reset with email OTP verification
- Campus buildings and points of interest
- Campus events management
- Role-based authorization (student, visitor, admin)

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   PORT=5000
   ```
4. Start the server: `npm run dev`

## Available Scripts

- `npm run start`: Start the production server
- `npm run dev`: Start the development server with hot reload
- `npm run docs`: Generate API documentation

## Technologies Used

- Node.js
- Express.js
- MongoDB/Mongoose
- JWT for authentication
- Nodemailer for email services
- JSDoc for documentation
