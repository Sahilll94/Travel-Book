# Quick Start for Contributors

## Full Setup (Recommended)

```bash
# Create project directory
mkdir travel-book-dev
cd travel-book-dev

# Clone Frontend
git clone https://github.com/YOUR_GITHUB_ID/Travel-Book.git
cd Travel-Book

# Clone Backend in separate directory
cd ..
git clone https://github.com/YOUR_GITHUB_ID/Travel-Book-Backend.git

# Backend Setup (Terminal 1)
cd Travel-Book-Backend
npm install
cp .env.example .env
# Update .env with your config
npm run dev

# Frontend Setup (Terminal 2)
cd Travel-Book
npm install
cp .env.example .env
# Set VITE_BACKEND_URL=http://localhost:5000
npm run dev
```

## Access the Application

Once both servers are running:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## Test Login

Use your real credentials:
- **Email**: Your actual email address
- **Password**: Your password
- **OTP**: Check your email for OTP code

## What You Need

✅ **Complete working app** with real backend  
✅ **Full authentication flow** (login, signup, OTP)  
✅ **Profile management** with real data  
✅ **Travel story management** (create, edit, delete)  
✅ **Image upload** with real file storage  
✅ **Search and filters** with real backend search  
✅ **Analytics dashboard** with real user data  
✅ **Mobile-responsive design**  

## Development Focus Areas

Perfect for working on:
- UI/UX improvements
- Mobile responsiveness
- Performance optimizations
- Component development
- Theme and styling
- Accessibility features
- Data visualization
- Search enhancements

## Typical Workflow

1. **Make a change** to the frontend code
2. **Save the file** - it auto-reloads
3. **Test in browser** at `http://localhost:5173`
4. **Check browser console** for any errors
5. **Commit your changes** when happy

## Backend API

The frontend communicates with the backend at `http://localhost:5000`

Common endpoints:
- `POST /login` - User login
- `POST /send-signup-otp` - Send signup OTP
- `GET /get-user` - Get current user
- `POST /add-travel-story` - Create story
- `PUT /edit-story/:id` - Update story
- `DELETE /delete-story/:id` - Delete story

See the [Backend Repository](https://github.com/Sahilll94/Travel-Book-Backend) for full API documentation.

## Useful Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build

# Backend
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run tests (if configured)
```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify port 5000 is available
- Check .env configuration
- Review error messages in terminal

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check VITE_BACKEND_URL in .env
- Look for CORS errors in browser console
- Restart both servers

### Port already in use
```bash
# Kill process on port (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or change port in backend
# Edit .env: PORT=5001
```

### Module not found errors
```bash
# Clear and reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

## Next Steps

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines
2. Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for codebase overview
3. Review [Backend README](https://github.com/Sahilll94/Travel-Book-Backend/blob/master/README.md) for API details
4. Start implementing features!

## Need Help?

- Check [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup
- Open an [issue on GitHub](https://github.com/Sahilll94/Travel-Book/issues)
- Join our community discussions
- Review existing code for patterns

---

**Happy coding!** Start by exploring the codebase and making small improvements. Good luck with your contributions!
