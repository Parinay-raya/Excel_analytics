# Excel Analytics Platform

A powerful platform for uploading Excel files, analyzing data, and generating interactive charts.

## Features

- User authentication (register/login)
- Excel file upload (.xls, .xlsx)
- Data analysis and visualization
- Interactive 2D and 3D charts
- User dashboard with upload history
- Admin panel for user management

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- UI: Material-UI
- Charts: Recharts

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/excel_analytics
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:5173

## License

MIT 