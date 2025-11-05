# SlotSwapper 🔄

A peer-to-peer time-slot scheduling application that allows users to swap their busy time slots with others. Built with React.js frontend and Node.js/Express backend with MongoDB.

<img width="1478" height="742" alt="image" src="https://github.com/user-attachments/assets/b59cd647-01ae-40cc-8213-afa242613fe1" /> 
<img width="1322" height="904" alt="image" src="https://github.com/user-attachments/assets/93d0c20d-dac1-4388-9068-6258fca47926" />




## 🚀 Overview

SlotSwapper solves the problem of rigid schedules by enabling users to mark their busy time slots as "swappable" and trade them with peers. The application handles the entire swap lifecycle from discovery to execution.

### Key Features
- **User Authentication** - Secure JWT-based auth system
- **Calendar Management** - Create and manage time slots
- **Swap Marketplace** - Discover available slots from other users
- **Request System** - Send and respond to swap requests
- **Real-time Updates** - Dynamic UI updates without page refresh
- **Transaction Safety** - Ensures slot integrity during swaps

### Design Choices
- **Dark Theme UI** - Chosen for better readability and modern appearance
- **Component-based Architecture** - Reusable React components for maintainability
- **RESTful API** - Clear separation between frontend and backend
- **MongoDB** - Flexible schema for evolving swap requirements
- **Inline Styles** - For simplicity in this project (CSS modules recommended for larger apps)

## 🛠️ Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios for API calls
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dk9480/SlotSwapper-Challenge
   cd slotswapper

2. Backend Setup
      ```bash

   ### Navigate to backend directory
   cd server

   ### Install dependencies
   npm install

   # Environment Configuration
   # Create a .env file in the server directory with:
      PORT=5000
      MONGODB_URI=mongodb://localhost:27017/slotswapper
      JWT_SECRET=your_jwt_secret_key_here

   ### Start the backend server
   npm run dev

Backend will run on http://localhost:5000



3. Frontend Setup
   ### Open a new terminal and navigate to frontend
   ```bash
   cd client

   # Install dependencies
   npm install
   
   # Start the frontend development server
   npm run dev

Frontend will run on http://localhost:5173



4. Database Setup
    * Ensure MongoDB is running locally

   * Or update MONGODB_URI in .env to your MongoDB Atlas connection string


5. Access the Application

  * Open http://localhost:3000 in your browser

  * Sign up for a new account or use existing credentials


## 🗂️ Project Structure

## 🗂️ Project Structure

| Path | Description |
|------|-------------|
| `client/` | React frontend application |
| `client/src/components/` | Reusable React components |
| `client/src/pages/` | Page components (Dashboard, Login, etc.) |
| `client/src/context/` | Authentication context |
| `client/src/App.jsx` | Main application component |
| `server/` | Express.js backend API |
| `server/models/` | MongoDB data models |
| `server/routes/` | API route handlers |
| `server/middleware/` | Authentication middleware |
| `README.md` | Project documentation |

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | User registration | `{name, email, password}` |
| POST | `/api/auth/login` | User login | `{email, password}` |

### Event Endpoints

| Method | Endpoint | Description | Headers | Body |
|--------|----------|-------------|---------|------|
| GET | `/api/events` | Get user's events | `x-auth-token` | - |
| POST | `/api/events` | Create new event | `x-auth-token` | `{title, startTime, endTime}` |
| PUT | `/api/events/:id` | Update event status | `x-auth-token` | `{status}` |
| DELETE | `/api/events/:id` | Delete event | `x-auth-token` | - |

### Swap Endpoints

| Method | Endpoint | Description | Headers | Body |
|--------|----------|-------------|---------|------|
| GET | `/api/swaps/swappable-slots` | Get available slots | `x-auth-token` | - |
| GET | `/api/swaps/incoming` | Get incoming requests | `x-auth-token` | - |
| GET | `/api/swaps/outgoing` | Get outgoing requests | `x-auth-token` | - |
| POST | `/api/swaps/swap-request` | Request a swap | `x-auth-token` | `{mySlotId, theirSlotId}` |
| POST | `/api/swaps/swap-response/:requestId` | Respond to swap | `x-auth-token` | `{isAccepted}` |


## 🎯 Usage Guide

### 1. Getting Started
- **Sign Up**: Create a new account with name, email, and password
- **Login**: Access your dashboard with registered credentials

### 2. Managing Slots
- **Create Slot**: Use the "Create New Event" form in dashboard
- **Make Swappable**: Click "Make Swappable" on BUSY slots
- **Delete Slots**: Remove unwanted slots with delete button

### 3. Swapping Process
1. **Browse Marketplace**: Visit Marketplace to see available slots
2. **Request Swap**: Click "Request Swap" and select your offering slot
3. **Manage Requests**: Check Requests page for incoming/outgoing swaps
4. **Accept/Reject**: Respond to incoming swap requests
5. **Automatic Update**: Calendars update automatically upon acceptance

### 4. Status Meanings
- **BUSY**: Regular occupied slot (default)
- **SWAPPABLE**: Available for swapping with others
- **SWAP_PENDING**: Involved in an active swap request



## 🤔 Assumptions & Design Decisions

### Assumptions
1. **Time Zone**: All times are handled in the user's local timezone
2. **Slot Validation**: No overlap checking for newly created slots
3. **Real-time**: No WebSocket implementation for real-time notifications
4. **Email Notifications**: No email service for swap notifications
5. **Single User Sessions**: Users are expected to use one device at a time
6. **Slot Duration**: No validation for minimum/maximum slot durations

### Design Decisions
1. **JWT in Headers**: Used `x-auth-token` header instead of Authorization Bearer for simplicity
2. **Inline Styles**: Chosen over CSS modules for quicker development in this scope
3. **No Calendar View**: Used list view instead of calendar grid for simplicity
4. **MongoDB References**: Used population for user data in swap requests
5. **Client-side Routing**: Used React Router for SPA experience
6. **Context API**: Chosen over Redux for simpler state management needs

## 🚧 Challenges & Solutions

### Challenge 1: Swap Transaction Integrity
**Problem**: Ensuring both slots update atomically during swap acceptance without data corruption
**Solution**: Implemented comprehensive error handling, status checks, and proper rollback mechanisms

### Challenge 2: State Management Across Components
**Problem**: Keeping UI in sync with backend after swaps and maintaining consistent state
**Solution**: Used React's state lifting, callback functions, and proper useEffect dependencies

### Challenge 3: Authentication Flow
**Problem**: Handling token expiration, protected routes, and automatic logout
**Solution**: Implemented AuthContext with axios interceptors and route guards

### Challenge 4: User Experience & Feedback
**Problem**: Providing clear feedback for all actions without using native alerts
**Solution**: Implemented custom modals, status messages, and loading states

### Challenge 5: Data Consistency
**Problem**: Preventing race conditions when multiple users interact with the same slots
**Solution**: Implemented status-based locking (SWAP_PENDING) and proper validation checks

### Challenge 6: API Error Handling
**Problem**: Gracefully handling network failures and server errors
**Solution**: Comprehensive try-catch blocks with user-friendly error messages

## 🔮 Future Enhancements

### High Priority
- [ ] **Calendar Grid View** - Visual calendar interface for better scheduling
- [ ] **Real-time Notifications** - WebSocket implementation for instant updates
- [ ] **Email Notifications** - Send swap request alerts via email
- [ ] **Time Slot Overlap Validation** - Prevent double-booking
- [ ] **Mobile Responsive Design** - Better mobile experience

### Medium Priority
- [ ] **Recurring Events Support** - Weekly/monthly repeating slots
- [ ] **Admin Dashboard** - User management and analytics
- [ ] **Advanced Filtering** - Filter slots by time, date, duration
- [ ] **Slot Categories/Tags** - Organize slots by type (meeting, focus, etc.)
- [ ] **Bulk Operations** - Create multiple slots at once

### Low Priority
- [ ] **Theming System** - Light/dark mode toggle
- [ ] **Export Calendar** - iCal/Google Calendar integration
- [ ] **Slot Templates** - Pre-defined slot types
- [ ] **Rating System** - User reputation for successful swaps
- [ ] **Advanced Analytics** - Usage statistics and insights

### Technical Improvements
- [ ] **TypeScript Migration** - Better type safety
- [ ] **Unit Tests** - Comprehensive test coverage
- [ ] **Docker Configuration** - Containerized deployment
- [ ] **Performance Optimization** - Code splitting and lazy loading
- [ ] **PWA Features** - Offline capability and app-like experience


# Finally


## 📸 Recommended Screenshots

You should add these screenshots to your repository:

1. Login and SignUp 

1. **Dashboard View** <img width="1380" height="900" alt="image" src="https://github.com/user-attachments/assets/babad5ef-4e7d-486c-8bcb-0356115cc86d" /> 
   - Show the main dashboard with events list
   - Include the "Create New Event" expandable form

2. **Marketplace View** (`/screenshots/marketplace.png`)
   - Show available slots from other users
   - Include the swap request modal

3. **Requests Page** (`/screenshots/requests.png`)
   - Show both incoming and outgoing requests
   - Include the accept/reject buttons

4. **Login/Signup** (`/screenshots/auth.png`)
   - Show the authentication forms

To add screenshots:
1. Take screenshots of your running application
2. Save them in a `/screenshots` folder in your repository
3. Update the image paths in the README accordingly

This README provides comprehensive documentation that will help reviewers understand your project and get it running quickly!

