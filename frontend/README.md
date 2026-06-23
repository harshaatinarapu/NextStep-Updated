# NextStep Frontend

A modern React.js frontend for the NextStep educational platform.

## Features

- 🔐 **Authentication**: Login and registration with role-based access
- 🎯 **Placement Preparation**: Comprehensive placement prep materials
- 📚 **Exam Preparation**: Academic exam resources and study materials
- 📱 **Responsive Design**: Works perfectly on all devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Project Structure

```
src/
├── components/
│   ├── Login.js          # Authentication component
│   ├── Dashboard.js      # Main dashboard with options
│   ├── PlacementPrep.js  # Placement preparation interface
│   └── ExamPrep.js       # Exam preparation interface
├── App.js                # Main app component with routing
├── App.css               # Global styles
└── index.js              # App entry point
```

## API Integration

The frontend integrates with the backend API endpoints:

- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/placementprep/topics` - Get placement topics
- `/api/examprep/subjects` - Get exam subjects
- `/api/resources` - Access study resources

## Technologies Used

- React.js
- React Router
- Axios for API calls
- Font Awesome icons
- CSS3 with modern features
- Responsive design principles