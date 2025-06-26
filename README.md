# 📊 Excel Analytics Platform

A comprehensive full-stack web application for Excel file analysis, data visualization, and interactive chart generation. Built with modern technologies to provide seamless data analytics capabilities with role-based access control.

## 🌟 Features

### 🔐 Authentication & Authorization
- **User Registration & Login** with JWT-based authentication
- **Role-based Access Control** (User/Admin roles)
- **Secure Password Hashing** using bcryptjs
- **Protected Routes** with middleware authentication

### 📁 File Management
- **Excel File Upload** (.xls, .xlsx formats supported)
- **File Metadata Storage** (filename, size, columns, row count)
- **Upload History Tracking** with timestamps
- **File Download & Delete** functionality
- **Admin File Management** across all users

### 📈 Data Visualization
- **2D Charts**: Line, Bar, Pie, and Area charts
- **3D Visualizations**: 3D Scatter plots, Surface plots, and Mesh charts
- **Interactive Charts** with Plotly.js and Recharts
- **Dynamic Axis Selection** for flexible data exploration
- **Chart Export** to PDF and image formats

### 👥 User Management
- **User Dashboard** with personalized analytics
- **Admin Dashboard** for user management
- **Activity Logging** for audit trails
- **User Profile Management**

### 🎨 Modern UI/UX
- **Material-UI Components** with custom theming
- **Dark/Light Mode Toggle** with persistent preferences
- **Responsive Design** for all device sizes
- **Professional Gradient Backgrounds** and animations
- **Intuitive Navigation** with role-based routing

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Comprehensive React component library
- **React Router DOM** - Client-side routing
- **Plotly.js** - Advanced 3D data visualization
- **Recharts** - Responsive 2D charts
- **Axios** - HTTP client for API communication
- **JWT Decode** - Token handling and authentication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Multer** - File upload middleware
- **XLSX** - Excel file parsing and processing
- **bcryptjs** - Password hashing and security
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Babel** - JavaScript transpilation
- **Webpack** - Module bundling (Node.js builds)
- **TypeScript** - Type safety and enhanced development

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **Git** (for version control)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Excel_analytics
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install backend dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/excel_analytics

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_complex

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install frontend dependencies:
```bash
npm install
```

Create a `.env` file in the frontend directory (optional):
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=Excel Analytics Platform
VITE_APP_VERSION=1.0.0
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Database Setup

Ensure MongoDB is running on your system:
```bash
# Start MongoDB service (varies by OS)
# Windows (if installed as service):
net start MongoDB

# macOS (with Homebrew):
brew services start mongodb-community

# Linux (systemd):
sudo systemctl start mongod
```

The application will automatically create the required database and collections on first run.

## 🔧 Quick Setup Scripts

For convenience, use the provided setup scripts:

### Windows Users:
```bash
# Fix Vite configuration and install dependencies
./fix-vite-config.bat

# Install chart export dependencies
./install-chart-export-deps.bat
```

### Linux/macOS Users:
```bash
# Fix Vite configuration and install dependencies
chmod +x fix-vite-config.sh
./fix-vite-config.sh

# Install chart export dependencies
chmod +x install-chart-export-deps.sh
./install-chart-export-deps.sh
```

## 🌐 Application URLs

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api (JSON response)

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Admin Routes
- `GET /api/users/all` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### File Management
- `POST /api/files/upload` - Upload Excel file (protected)
- `GET /api/files` - List user's files (protected)
- `GET /api/files/:id/download` - Download file (protected)
- `GET /api/files/:id/data` - Get file data for visualization (protected)
- `DELETE /api/files/:id` - Delete file (protected)

### Activity Tracking
- `GET /api/activity` - Get user activity log (protected)

## 👤 User Roles & Permissions

### Regular User
- Upload and manage their own Excel files
- View and analyze their uploaded data
- Generate charts and visualizations
- Export charts to PDF/images
- View their activity history

### Admin User
- All regular user permissions
- View and manage all users
- Delete any user account
- Access all uploaded files across users
- View system-wide activity logs

### Creating an Admin User
To create an admin user, you can either:

1. **Register normally and update in database**:
   ```javascript
   // In MongoDB shell or compass
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Modify registration in backend** (temporary):
   ```javascript
   // In userController.js registerUser function
   role: 'admin' // Change from default 'user'
   ```

## 📊 Supported File Formats

- **Excel Files**: .xlsx, .xls
- **CSV Files**: .csv (through Excel processing)
- **Maximum File Size**: 10MB (configurable)

## 🎯 Usage Guide

### 1. Getting Started
1. Register a new account or login with existing credentials
2. Navigate to the dashboard based on your role
3. Upload an Excel file using the file upload component

### 2. Data Analysis
1. After upload, view your file in the upload history
2. Click on a file to view its data and generate visualizations
3. Select different columns for X, Y, and Z axes
4. Choose from various chart types (2D and 3D)

### 3. Chart Export
1. Generate your desired chart
2. Use the export controls to save as PDF or image
3. Charts are saved with descriptive filenames

### 4. Admin Functions
1. Access the admin dashboard to manage users
2. View system-wide file uploads and activity
3. Delete users or files as needed

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs with salt rounds
- **File Upload Validation** with type and size restrictions
- **CORS Configuration** for secure cross-origin requests
- **Input Sanitization** and validation
- **Protected Routes** with middleware authentication
- **Role-based Access Control** for sensitive operations

## 🚀 Deployment

### Production Build

#### Frontend:
```bash
cd frontend
npm run build
```

#### Backend:
```bash
cd backend
npm run build:node  # If using webpack for Node.js
```

### Environment Variables for Production

Update your `.env` files with production values:

```env
# Backend .env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret
PORT=5000

# Frontend .env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Deployment Options

1. **Traditional Hosting**: Deploy to VPS with PM2
2. **Cloud Platforms**: Heroku, DigitalOcean, AWS
3. **Containerization**: Docker deployment
4. **Serverless**: Vercel (frontend) + MongoDB Atlas

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **npm install errors**:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **MongoDB connection issues**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

3. **Port conflicts**:
   - Backend automatically tries ports 5000, 5001, 5002, etc.
   - Update frontend API URL if backend uses different port

4. **File upload issues**:
   - Check file size limits
   - Verify upload directory permissions
   - Ensure supported file format

### Getting Help

- Check the console for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Check MongoDB connection and status

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using modern web technologies**