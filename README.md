# [Travel-Book](https://travelbook.sahilfolio.live/)
<img width="1920" height="1029" alt="Screenshot 2025-07-28 024338" src="https://github.com/user-attachments/assets/5236f6d7-0379-490c-b825-f8f618d0fd3c" />

### To check the status of the servers (Frontend server and Backend server) - [Click here](https://stats.uptimerobot.com/4klrGTjcP6)

## Repositories

- **Backend**: [Travel-Book Backend Repository](https://github.com/Sahilll94/Travel-Book-Backend)
- **Frontend**: [Travel-Book Frontend Repository](https://github.com/Sahilll94/Travel-Book)

# Travel Book - Your Digital Travel Journal
## 📑 Table of Contents

- [Quick Start for Contributors](#quick-start-for-contributors)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Purpose & Vision](#purpose--vision)
- [Technology Stack](#technology-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Development & Deployment](#development--deployment)
- [Key Features](#key-features)
- [User Flow](#user-flow)
- [Mobile-First Approach](#mobile-first-approach)
- [Unique Selling Points](#unique-selling-points)
- [Accessibility Features](#accessibility-features)
- [Contributing & Recognition](#contributing--recognition)
- [Frontend Development Roadmap](#frontend-development-roadmap)
- [License](#license)
- [Support](#support)


## 📑 Table of Contents

- [Quick Start for Contributors](#quick-start-for-contributors)
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Purpose & Vision](#purpose--vision)
- [Technology Stack](#technology-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Development & Deployment](#development--deployment)
- [Key Features](#key-features)
  - [User Authentication](#user-authentication)
  - [Travel Story Management](#travel-story-management)
  - [Organization & Discovery](#organization--discovery)
  - [User Experience](#user-experience)
  - [Analytics & Insights](#analytics--insights)
  - [Social Features](#social-features)
  - [AI Features](#ai-features)
- [User Flow](#user-flow)
- [Mobile-First Approach](#mobile-first-approach)
- [Unique Selling Points](#unique-selling-points)
- [Accessibility Features](#accessibility-features)
- [Contributing & Recognition](#contributing--recognition)
- [Frontend Development Roadmap](#frontend-development-roadmap)
- [License](#license)
- [Support](#support)

## Quick Start for Contributors

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control
- MongoDB (for backend setup, or use MongoDB Atlas)

### Setup Instructions

1. **Fork both repositories**

   Fork the [Frontend](https://github.com/Sahilll94/Travel-Book) and [Backend](https://github.com/Sahilll94/Travel-Book-Backend) repositories to your GitHub account.

2. **Clone the repositories**

   ```bash
   # Clone Frontend
   git clone https://github.com/YOUR_GITHUB_ID/Travel-Book.git
   cd Travel-Book
   
   # Clone Backend in a separate directory
   cd ..
   git clone https://github.com/YOUR_GITHUB_ID/Travel-Book-Backend.git
   ```

3. **Set up the Backend**

   ```bash
   cd Travel-Book-Backend
   npm install
   cp .env.example .env
   # Update .env with your configuration (MongoDB, Firebase, Cloudinary, etc.)
   npm run dev
   ```

   The backend will be running on `http://localhost:3000` by default (or check your backend logs for the actual port).

4. **Set up the Frontend**

   In a new terminal window:

   ```bash
   cd Travel-Book
   npm install
   cp .env.example .env
   # Update the .env with your configuration (Google Maps API key, Firebase Config, etc.)
   npm run dev
   ```

   The frontend will be running on `http://localhost:5173`.

5. **Access the application**

   Open your browser and navigate to `http://localhost:5173`

**[Read the full contributor guide →](CONTRIBUTING.md)**

---

## 🔐 Environment Variables Summary

This project requires the following environment variables to run properly.

### 🌐 Frontend (.env)

Create a `.env` file in the root directory and configure the following variables:

| Variable | Description |
|----------|------------|
| VITE_BACKEND_URL | Backend API base URL (local or hosted backend) |
| VITE_GOOGLE_MAPS_API_KEY | Google Maps API key (optional) |
| VITE_FIREBASE_API_KEY | Firebase API key |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase auth domain |
| VITE_FIREBASE_PROJECT_ID | Firebase project ID |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase storage bucket |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase messaging sender ID |
| VITE_FIREBASE_APP_ID | Firebase app ID |

⚠️ Copy `.env.example` to `.env` and replace placeholder values with your own configuration.
Never commit your `.env` file to GitHub.


## Project Overview

Travel Book is a modern web application designed to help users document, organize, and share their travel experiences. It serves as a digital travel journal where users can record memories, photos, and details about places they've visited. The platform provides a user-friendly interface for travelers to create a personal collection of travel stories, organize them by location and date, and optionally share them with others.


## Project Structure

```bash
Travel-Book/
├── .github/
├── public/                    
│       ├── assets/images/
│       ├── robots.txt
│       └── sitemap.xml
├── src/
│       ├── assets/images/
│       ├── components/
│       │     ├── Auth/
│       │     ├── Cards/
│       │     ├── ChatBot/
│       │     ├── Footer/
│       │     ├── Input/
│       │     ├── Modals/
│       │     ├── Navbar/
│       │     ├── Onboarding/
│       │     ├── ThemeToggle/
│       │     ├── BackToTopButton.jsx
│       │     ├── Navbar.jsx
│       │     └── Toaster.jsx
│       ├── pages/
│       │     ├── Auth/
│       │     ├── Contributors/
│       │     ├── admin/
│       │     ├── hero/
│       │     ├── home/
│       │     ├── legal/
│       │     ├── profile/
│       │     └── mistake.jsx
│       ├── utils/
│       │     ├── AuthContext.jsx
│       │     ├── ProtectedRoute.jsx
│       │     ├── authErrorHandler.js
│       │     ├── axiosInstance.js
│       │     ├── constants.js
│       │     ├── firebase.js
│       │     ├── helper.js
│       │     └── uploadImage.js
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── scrollbar.css             
├── .env.example              
├── .gitignore               
├── CODE_OF_CONDUCT.md                        
├── CONTRIBUTING.md   
├── CONTRIBUTORS_RECOGNITION_GUIDE.md            
├── LICENSE                
├── PROJECT_STRUCTURE.md                            
├── QUICKSTART.md
├── SECURITY.md    
├── eslint.config.js
├── index.html    
├── package.json    
├── postcss.config.js  
├── tailwind.config.js   
├── vercel.json                       
└── vite.config.js             
```

## Purpose & Vision

The primary purpose of Travel Book is to give travelers a dedicated space to preserve their travel memories in a structured and visually appealing way. Rather than having travel photos scattered across different devices or social media platforms, Travel Book centralizes these experiences into a cohesive travel journal that can be accessed from anywhere.

Key goals of the platform include:
- Providing an intuitive way to document travel experiences
- Creating a searchable repository of personal travel memories
- Offering data visualization of travel patterns and statistics
- Supporting offline access for users on the go
- Delivering a responsive experience across all devices

## Technology Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API and local state
- **Animations**: Framer Motion
- **Routing**: React Router
- **UI Components**: Custom components with responsive design
- **Offline Support**: PWA (Progressive Web App) capabilities with service workers
- **Data Visualization**: Chart.js and custom analytics

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) and Firebase
- **File Upload**: Multer with Cloudinary storage
- **API**: RESTful API design
- **Email**: Nodemailer for notifications
- **AI Integration**: Google Generative AI for chatbot

### Development & Deployment
- **Build Tool**: Vite
- **Frontend Deployment**: Vercel
- **Backend Deployment**: AWS EC2 with Nginx and PM2
- **Version Control**: Git
- **Package Management**: npm

## Key Features

### User Authentication
- Email/password registration and login
- OTP verification for secure access
- Password reset functionality
- Firebase social authentication
- JWT-based session management

### Travel Story Management
- Create, read, update, and delete travel stories
- Rich text editing for story content
- Image upload and management with Cloudinary
- Location tagging with map integration
- Date tracking for visits
- Favorite marking for important memories

### Organization & Discovery
- Search functionality by title, content, or location
- Advanced filtering by date range and location
- Sort stories by various criteria
- Categorize stories as favorites
- View recent trips at a glance

### User Experience
- Dark/light mode toggle with system preference detection
- Responsive design for all device sizes
- Smooth animations and transitions
- Swipe gestures on mobile devices
- Drag and drop interface for image uploads

### Analytics & Insights
- Visual representation of travel statistics
- Location frequency analysis
- Travel timeline visualization
- Monthly/yearly travel patterns

### Social Features
- Direct link sharing for stories
- Social media integration (Facebook, Twitter, WhatsApp)
- Customizable sharing messages
- Contributor recognition system

### AI Features
- Chatbot powered by Google Generative AI
- Smart story suggestions and insights

## User Flow

1. **Onboarding**:
   - User lands on the hero page with information about the platform
   - User registers or logs in through the authentication system
   - New users are welcomed with an introduction to the platform features

2. **Core Experience**:
   - Users can view their collection of travel stories on the home page
   - Adding a new story walks users through a step-by-step process
   - Existing stories can be viewed, edited, or deleted
   - Stories can be marked as favorites for quick access

3. **Discovery & Organization**:
   - Users can search for specific stories
   - Advanced filtering by date or location
   - Analytics section offers insights into travel patterns

4. **Sharing & Community**:
   - Stories can be shared via multiple platforms
   - Contributor recognition for active community members

## Mobile-First Approach

Travel Book is designed with a mobile-first approach, recognizing that many users will document their travels while on the go:

- Touch-optimized interfaces with appropriate sizing for tap targets
- Swipe gestures for navigation between views
- Responsive layouts that adapt to different screen sizes
- Offline capabilities for areas with limited connectivity
- Optimized image handling for mobile bandwidth considerations
- Quick access to camera for adding travel photos directly

## Unique Selling Points

1. **Focused Purpose**: Specifically designed for travel documentation
2. **Privacy Control**: Users have full control over their content
3. **Structured Organization**: Purpose-built system for travel memories
4. **Visual Analytics**: Unique insights into personal travel patterns
5. **Offline First**: Robust offline capabilities
6. **Cross-Device Experience**: Seamless experience across devices

## Accessibility Features

- High contrast mode support via dark/light themes
- Keyboard navigation throughout
- ARIA attributes for screen reader compatibility
- Touch-friendly interfaces with appropriate sizing
- Text scaling support
- Color choices that consider color blindness

## Contributing & Recognition

We welcome contributions! Travel Book features a comprehensive contributors recognition system to celebrate the efforts of our community members.

### How to Contribute

1. **Get Started**: Follow our [Contributing Guide](CONTRIBUTING.md) for setup instructions
2. **Make Your Mark**: Implement features, fix bugs, or improve documentation
3. **Get Recognition**: Submit your contributions through our [Contributors Application](/contributors) system

### Contributors Recognition System

Once you've made meaningful contributions to the project, you can apply to be featured on our contributors page:

- **Apply Online**: Visit `/contributors` to see current contributors and apply for recognition
- **Submission Form**: Complete the form at `/contribute` with details about your contributions
- **Review Process**: Our team reviews applications within 3-5 business days
- **Featured Display**: Approved contributors are showcased on the main contributors page

### Types of Contributions Recognized

We recognize various types of contributions including:
- Code contributions (features, bug fixes, performance improvements)
- Documentation improvements
- Design and UX enhancements
- Community support and engagement

## Frontend Development Roadmap

*Perfect opportunities for contributors to make meaningful impact!*

### UI/UX Enhancements
- Enhanced animations and transitions
- Theme customization options
- Accessibility improvements
- Mobile experience optimization

### Component Library
- Story templates
- Interactive widgets
- Advanced photo gallery
- Custom map components

### Features
- Smart search with auto-complete
- Bulk operations
- Advanced export options
- Keyboard shortcuts

### Performance & PWA
- Offline enhancements
- Code splitting and lazy loading
- PWA feature improvements
- Loading state optimizations

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help getting started, please:
- Check the [Contributing Guide](CONTRIBUTING.md)
- Open an issue on GitHub
- Join our community discussions

---

**Happy traveling and happy coding!**
