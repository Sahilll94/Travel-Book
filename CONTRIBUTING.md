# Contributing to Travel Book

Welcome to Travel Book! We're excited to have you contribute to our digital travel journal platform. This guide will help you get started with the development environment.

## Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control
- MongoDB (for backend, or use MongoDB Atlas)

### Setup Instructions

#### 1. Fork and Clone Repositories

Fork both the [Frontend](https://github.com/Sahilll94/Travel-Book) and [Backend](https://github.com/Sahilll94/Travel-Book-Backend) repositories to your GitHub account.

```bash
# Create a directory for the project
mkdir travel-book-dev
cd travel-book-dev

# Clone Frontend
git clone https://github.com/YOUR_GITHUB_ID/Travel-Book.git
cd Travel-Book

# Clone Backend in a separate directory (from parent folder)
cd ..
git clone https://github.com/YOUR_GITHUB_ID/Travel-Book-Backend.git
```

#### 2. Set Up Backend

```bash
cd Travel-Book-Backend
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration:
# - MongoDB connection string (local or MongoDB Atlas)
# - Firebase Admin credentials
# - Cloudinary API keys
# - Email service credentials (Nodemailer)
# - Google Generative AI API key
# - JWT secret
# - Port (default: 5000)

# Start the development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

#### 3. Set Up Frontend

In a new terminal window:

```bash
cd Travel-Book
npm install

# Copy environment file
cp .env.example .env

# Update .env with:
VITE_BACKEND_URL=http://localhost:5000

# If you have Firebase credentials:
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# etc.

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Verify Installation

1. Open `http://localhost:5173` in your browser
2. You should see the Travel Book application
3. Try logging in or signing up to verify the connection

## Development Guidelines

### Code Standards

**File Organization:**
- Follow the existing directory structure
- Place components in appropriate folders
- Use descriptive file and component names
- Include necessary imports and exports

**Styling Guidelines:**
- Use Tailwind CSS for styling
- Follow responsive design principles
- Ensure dark/light mode compatibility
- Test across different screen sizes

**Component Development:**
- Write reusable, modular components
- Include proper prop validation
- Implement error boundaries where appropriate
- Follow React best practices
- Use proper API endpoints (not mock data)

### Testing Requirements

Before submitting your contribution, ensure you have tested:

1. **Authentication Flow:**
   - User registration and login with real backend
   - Password reset functionality
   - Session persistence

2. **Core Features:**
   - Story creation, editing, and deletion
   - Image upload and management
   - Search and filtering with backend data
   - Profile management and updates

3. **User Experience:**
   - Responsive design on mobile and desktop
   - Dark and light theme compatibility
   - Loading states and error handling
   - Navigation and accessibility

4. **API Integration:**
   - Backend API responses are handled correctly
   - Error messages display appropriately
   - Network errors are handled gracefully

5. **Performance:**
   - Page load times are reasonable
   - Smooth animations and transitions
   - Memory usage is optimized

### Adding New Features

**For UI Components:**
1. Create components in the appropriate folder
2. Ensure responsive design
3. Test with both light and dark themes
4. Test accessibility features

**For API Integration:**
1. Use `src/utils/axiosInstance.js` for API calls
2. Handle all possible API responses and errors
3. Implement loading states
4. Show user feedback for actions

**For Backend Features:**
1. Implement the feature in the backend repository
2. Document the new API endpoint
3. Update the frontend to use the new endpoint
4. Test the full flow (frontend + backend)

## Architecture Overview

### Frontend Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page-level components
├── utils/           # Utilities and helpers
│   ├── axiosInstance.js    # API client configuration
│   ├── AuthContext.jsx     # Authentication context
│   ├── ProtectedRoute.jsx  # Route protection
│   └── constants.js        # Application constants
├── App.jsx          # Main application component
└── main.jsx         # Entry point
```

### Backend Structure

```
Backend/
├── models/          # Database schemas
├── services/        # Business logic
├── webhook/         # Webhook handlers
├── index.js         # Server entry point
├── multer.js        # File upload config
├── utilities.js     # Helper functions
└── firebase-admin.js # Firebase setup
```

### API Communication

The frontend uses `src/utils/axiosInstance.js` for all API calls:

```javascript
import axiosInstance from './utils/axiosInstance';

// API calls automatically route to the backend
axiosInstance.post('/login', { email, password })
  .then(response => { /* handle response */ })
  .catch(error => { /* handle error */ });
```

## Environment Configuration

### Frontend .env.example

```env
# Backend Configuration
VITE_BACKEND_URL=http://localhost:5000

# Firebase Configuration (optional for social login)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Maps API (optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Backend .env.example

See the [Backend Repository](https://github.com/Sahilll94/Travel-Book-Backend) for backend environment configuration.

## Contribution Areas

### Frontend Development

**User Interface Improvements**
- Responsive design enhancements
- Animation and transition improvements
- Accessibility feature implementation
- Theme and styling refinements

**Component Development**
- Reusable component creation
- Story layout templates
- Navigation improvements
- Form and input enhancements

**Feature Implementation**
- Dashboard widgets
- Analytics visualizations
- Search and filter improvements
- Export and sharing capabilities

**Performance Optimization**
- Code splitting and lazy loading
- Bundle size optimization
- Loading state improvements
- Memory usage optimization

### Backend Development

**API Development**
- Create new endpoints
- Enhance existing endpoints
- Add validation and error handling
- Implement caching strategies

**Database Optimization**
- Schema improvements
- Query optimization
- Indexing strategies
- Data migration scripts

**Infrastructure & DevOps**
- Deployment improvements
- CI/CD pipeline enhancements
- Monitoring and logging
- Security improvements

## Troubleshooting

### Common Issues and Solutions

**Backend not running:**
- Verify MongoDB is running/accessible
- Check if port 5000 is available
- Review .env configuration
- Check terminal for error messages

**Frontend can't connect to backend:**
- Verify backend is running on `http://localhost:5000`
- Check VITE_BACKEND_URL in .env
- Look for CORS errors in browser console
- Restart both frontend and backend

**Dependencies installation fails:**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Check Node.js version (should be v16+)
- Try npm cache clean --force

**Environment variables not loading:**
- Verify .env file is in the correct directory
- Variables must use VITE_ prefix in frontend
- Restart development server after env changes
- Check .env file for typos

### Getting Help

If you encounter issues not covered in this guide:

1. Check existing GitHub issues for similar problems
2. Review the main README.md for additional information
3. Check the backend README for backend-specific issues
4. Create a new issue with detailed information
5. Join community discussions for broader questions

## Contribution Workflow

### Step-by-Step Process

1. **Fork the repositories** on GitHub (both frontend and backend if needed)

2. **Create a feature branch** using descriptive naming:
   ```bash
   git checkout -b feature/description-of-feature
   ```

3. **Make your changes** following the guidelines above

4. **Test thoroughly** with the real backend

5. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: detailed description"
   ```

6. **Push to your fork:**
   ```bash
   git push origin feature/description-of-feature
   ```

7. **Submit a pull request** with a detailed description including:
   - What problem does this solve?
   - How does it work?
   - How can it be tested?
   - Screenshots (if UI changes)
   - Backend API endpoint (if applicable)

8. **Apply for contributor recognition** once your PR is merged

### Getting Recognition for Your Contributions

Travel Book features a comprehensive contributors recognition system to celebrate community members who make meaningful contributions to the project.

#### How to Apply for Recognition

Once your contributions have been merged into the main repository:

1. **Visit the Contributors Page**: Navigate to [Contributors](https://travelbook.sahilfolio.live/contributors) to view current contributors and learn about the application process
2. **Complete the Application**: Fill out the form with details about your contributions
3. **Provide Documentation**: Include links to your merged pull requests and issues you've worked on
4. **Wait for Review**: Our team reviews applications within 3-5 business days
5. **Get Featured**: Approved contributors are showcased on the main contributors page

#### Application Requirements

To be considered for contributor recognition, ensure that:
- Your contribution has been merged into the project
- You provide accurate information about your work
- You include relevant links to pull requests or issues
- You use professional contact information

#### Types of Contributions Recognized

We recognize various types of contributions including:
- **Code Contributions**: Features, bug fixes, performance improvements, testing
- **Documentation**: README updates, guides, code comments, tutorials
- **Design & UX**: UI improvements, design assets, accessibility enhancements
- **Community Support**: Issue reporting, user support, community engagement

#### Review Process

All contributor applications undergo a verification process:
1. Your submission will be reviewed by our team within 3-5 business days
2. We verify your contributions against project history
3. You will receive an email notification with the review outcome
4. Approved submissions will appear on the contributors page within 24 hours

### Pull Request Guidelines

**Title:** Use a clear, descriptive title that summarizes the change

**Description:** Include:
- What changes were made and why
- How to test the changes
- Screenshots for UI changes
- Any breaking changes or new dependencies
- Related issues or PRs

**Quality Checklist:**
- Code follows project style guidelines
- All tests pass
- No unnecessary comments or console.logs
- Documentation is updated if needed
- Commit messages are clear and descriptive

**Review Process:**
- Address all reviewer feedback promptly
- Keep the pull request focused on a single feature or fix
- Update documentation if necessary
- Be responsive to questions and suggestions

## Best Practices

### Security
- Never commit real API keys or credentials to the repository
- Use environment variables for all sensitive configuration
- Follow React security best practices
- Validate user inputs appropriately
- Use HTTPS in production

### Performance
- Use React.memo for components that don't need frequent re-renders
- Implement lazy loading for images and components
- Optimize database queries in the backend
- Monitor and address performance issues
- Use proper caching strategies

### Code Quality
- Write clean, readable code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- DRY principle: Don't Repeat Yourself

### Documentation
- Document new features and APIs
- Update README if adding new features
- Include code examples where appropriate
- Document configuration options
- Keep documentation in sync with code

## Future Contribution Opportunities

We welcome contributions in these areas:
- User interface and experience improvements
- Component library expansion
- Backend API enhancements
- Performance optimizations
- Accessibility improvements
- Testing and test coverage
- Documentation improvements
- DevOps and infrastructure

## Communication

- Use GitHub Issues for bug reports and feature requests
- Use GitHub Discussions for questions and general topics
- Be respectful and constructive in all communications
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

Thank you for contributing to Travel Book! Your efforts help make travel documentation more accessible and enjoyable for users worldwide.
