# 🚀 Skill Swap Platform - Complete Beginner Setup Guide

## 📋 What You'll Need (Prerequisites)

### 1. Install Node.js (DETAILED STEPS)
**For Windows:**
1. Go to https://nodejs.org/
2. Click "Download for Windows" (LTS version recommended)
3. Run the downloaded `.msi` file
4. Follow installation wizard (accept all defaults)
5. Restart your computer

**For Mac:**
1. Go to https://nodejs.org/
2. Click "Download for macOS" (LTS version)
3. Run the downloaded `.pkg` file
4. Follow installation wizard
5. Open Terminal and verify:

**For Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

**Verify Installation (All Platforms):**
```bash
node --version    # Should show v16+ or higher
npm --version     # Should show version number
```

### 2. Install PostgreSQL Database (DETAILED STEPS)

**For Windows:**
1. Go to https://www.postgresql.org/download/windows/
2. Download PostgreSQL installer
3. Run installer as Administrator
4. **IMPORTANT**: Remember the password you set for 'postgres' user
5. Keep default port 5432
6. Complete installation
7. Add PostgreSQL to PATH:
   - Search "Environment Variables" in Start menu
   - Click "Environment Variables"
   - Under System Variables, find "Path"
   - Click "Edit" → "New"
   - Add: `C:\Program Files\PostgreSQL\15\bin`
   - Click OK

**For Mac:**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create postgres user (if needed)
createuser -s postgres
```

**For Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -i -u postgres
```

**Test PostgreSQL Installation:**
```bash
# Try connecting (should work without errors)
psql -U postgres

# If successful, you'll see: postgres=#
# Type \q to exit
```

### 3. Install Git (DETAILED STEPS)

**For Windows:**
1. Go to https://git-scm.com/downloads
2. Download Git for Windows
3. Run installer
4. **IMPORTANT**: Select "Git from the command line and also from 3rd-party software"
5. Complete installation

**For Mac:**
```bash
# Install using Homebrew
brew install git

# Or download from https://git-scm.com/downloads
```

**For Linux:**
```bash
sudo apt install git
```

**Verify Git Installation:**
```bash
git --version    # Should show git version
```

---

## 🗄️ Step 1: Database Setup (DETAILED)

### Start PostgreSQL Service

**Windows:**
```bash
# Open Command Prompt as Administrator
net start postgresql-x64-15

# Or search "Services" in Start menu
# Find "postgresql-x64-15" and click "Start"
```

**Mac:**
```bash
# Start PostgreSQL
brew services start postgresql

# Or manually:
pg_ctl -D /usr/local/var/postgres start
```

**Linux:**
```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Check if running
sudo systemctl status postgresql
```

### Create Database and User

**Step 1: Connect to PostgreSQL**
```bash
# Connect as postgres user
psql -U postgres

# You should see: postgres=#
```

**Step 2: Create Database (inside psql)**
```sql
-- Create the database
CREATE DATABASE skillswap;

-- Create a user (optional, for security)
CREATE USER skillswap_user WITH PASSWORD 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE skillswap TO skillswap_user;

-- List databases to verify
\l

-- Exit psql
\q
```

### Create Database Tables

**Navigate to your project:**
```bash
# Replace with your actual path
cd /Users/rahulpatel/oddop1

# Verify schema file exists
ls database/schema.sql
```

**Run the schema file:**
```bash
# Method 1: Using postgres user
psql -U postgres -d skillswap -f database/schema.sql

# Method 2: Using custom user (if created)
psql -U skillswap_user -d skillswap -f database/schema.sql

# Verify tables were created
psql -U postgres -d skillswap -c "\dt"
```

**Expected Output:**
```
           List of relations
 Schema |     Name      | Type  |  Owner   
--------+---------------+-------+----------
 public | ratings       | table | postgres
 public | skills        | table | postgres
 public | swap_requests | table | postgres
 public | users         | table | postgres
```

---

## ⚙️ Step 2: Backend Setup (DETAILED)

### Navigate to Backend Directory
```bash
# From project root
cd backend

# Verify you're in the right place
ls
# Should see: app.js, package.json, routes/, config/, etc.
```

### Install Dependencies
```bash
# Install all packages
npm install

# This will create node_modules folder
# Wait for installation to complete (may take 2-3 minutes)
```

**If you see errors:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules
npm install
```

### Configure Environment Variables

**Create .env file:**
```bash
# Windows
type nul > .env

# Mac/Linux
touch .env
```

**Edit .env file (use any text editor):**
```bash
# Open with VS Code
code .env

# Or with nano
nano .env

# Or with vim
vim .env
```

**Add these exact contents to .env:**
```env
PORT=5000
JWT_SECRET=my_super_secret_jwt_key_12345_change_in_production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skillswap
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password_here
```

**IMPORTANT**: Replace `your_actual_postgres_password_here` with the password you set during PostgreSQL installation.

### Test Database Connection
```bash
# Test connection before starting server
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'skillswap',
  password: 'your_password_here',
  port: 5432,
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.log('❌ Database connection failed:', err.message);
  else console.log('✅ Database connected successfully!');
  pool.end();
});
"
```

### Start Backend Server
```bash
# Start development server
npm run dev

# You should see:
# Server running on port 5000
```

**If you see errors:**
- **Port 5000 in use**: Change PORT in .env to 5001
- **Database connection error**: Check your .env file and PostgreSQL service
- **Module not found**: Run `npm install` again

**Test Backend API:**
```bash
# In new terminal, test health endpoint
curl http://localhost:5000/api/health

# Should return: {"status":"OK","message":"Skill Swap API is running"}
```

---

## 🎨 Step 3: Frontend Setup (DETAILED)

### Open New Terminal Window
**Keep backend running in first terminal!**

**Windows**: Open new Command Prompt or PowerShell
**Mac/Linux**: Open new Terminal tab (Cmd+T or Ctrl+Shift+T)

### Navigate to Frontend Directory
```bash
# From project root
cd frontend

# Verify you're in the right place
ls
# Should see: package.json, src/, public/, etc.
```

### Install Dependencies
```bash
# Install React and all dependencies
npm install

# This may take 3-5 minutes
# You'll see many packages being installed
```

**If you see errors:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Try again
npm install
```

### Configure Frontend Environment (Optional)
```bash
# Create .env file in frontend directory
touch .env

# Add API URL (optional, defaults to localhost:5000)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### Start React Development Server
```bash
# Start frontend
npm start

# You should see:
# Compiled successfully!
# Local:            http://localhost:3000
# On Your Network:  http://192.168.x.x:3000
```

**Browser should automatically open to http://localhost:3000**

**If browser doesn't open:**
- Manually go to http://localhost:3000
- You should see the Skill Swap Platform login page

---

## 🧪 Step 4: Test Your Application (DETAILED)

### 1. Test Registration
1. **Go to**: http://localhost:3000
2. **Click**: "Sign Up" link
3. **Fill form**:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
4. **Click**: "Sign Up"
5. **Expected**: Automatic redirect to Browse page

### 2. Test Profile Setup
1. **Click**: "Profile" in navigation
2. **Click**: "Edit Profile"
3. **Fill fields**:
   - Location: "New York, NY"
   - Availability: "Evenings and Weekends"
4. **Click**: "Save Changes"
5. **Expected**: Profile updated successfully

### 3. Test Skills Management
1. **Click**: "My Skills" in navigation
2. **Add skills you can teach**:
   - Type: "JavaScript" → Select "I Can Teach" → Click "Add Skill"
   - Type: "Guitar" → Select "I Can Teach" → Click "Add Skill"
3. **Add skills you want to learn**:
   - Type: "Spanish" → Select "I Want to Learn" → Click "Add Skill"
   - Type: "Cooking" → Select "I Want to Learn" → Click "Add Skill"
4. **Expected**: Skills appear in respective sections

### 4. Test Browse and Search
1. **Click**: "Browse" in navigation
2. **Search by skill**: Type "JavaScript" → Click "Search"
3. **Search by location**: Type "New York" → Click "Search"
4. **Expected**: Users matching criteria appear

### 5. Test with Multiple Users
1. **Open incognito/private window**
2. **Register second user**:
   - Name: "Jane Smith"
   - Email: "jane@example.com"
   - Password: "password123"
3. **Add different skills** for Jane
4. **Send swap request** from Jane to John
5. **Switch back to John's window**
6. **Go to "Swaps"** → Accept/reject request

### 6. Test Rating System
1. **After accepting a swap request**
2. **Go to "Ratings"** page
3. **Leave feedback** for completed swaps
4. **Expected**: Ratings appear in user profiles

---

## 🔧 Troubleshooting Common Issues (DETAILED)

### Database Connection Errors

**Error**: "password authentication failed"
```bash
# Reset postgres password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
\q

# Update .env file with new password
```

**Error**: "database does not exist"
```bash
# Recreate database
psql -U postgres
DROP DATABASE IF EXISTS skillswap;
CREATE DATABASE skillswap;
\q

# Re-run schema
psql -U postgres -d skillswap -f database/schema.sql
```

**Error**: "connection refused"
```bash
# Check if PostgreSQL is running
# Windows:
net start postgresql-x64-15

# Mac:
brew services start postgresql

# Linux:
sudo systemctl start postgresql
```

### Port Issues

**Error**: "Port 5000 already in use"
```bash
# Find what's using port 5000
# Mac/Linux:
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Error**: "Port 3000 already in use"
```bash
# Kill React process
# Mac/Linux:
kill -9 $(lsof -ti:3000)

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Node Modules Issues

**Error**: "Module not found"
```bash
# Delete node_modules in both directories
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

**Error**: "Permission denied"
```bash
# Fix npm permissions (Mac/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use npx instead of global installs
```

### Frontend Build Issues

**Error**: "React scripts not found"
```bash
cd frontend
npm install react-scripts --save
npm start
```

**Error**: "Tailwind CSS not working"
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 📱 Complete Feature Testing Checklist

### ✅ Authentication System
- [ ] User can register with valid email
- [ ] User can login with correct credentials
- [ ] Invalid login shows error message
- [ ] User stays logged in after page refresh
- [ ] Logout works correctly

### ✅ Profile Management
- [ ] User can view their profile
- [ ] User can edit name, location, availability
- [ ] Profile changes are saved
- [ ] Profile photo placeholder appears
- [ ] Cancel button works

### ✅ Skills System
- [ ] User can add "offered" skills
- [ ] User can add "wanted" skills
- [ ] Skills appear in correct sections
- [ ] User can delete skills
- [ ] Skills persist after page refresh

### ✅ Browse & Search
- [ ] All users appear in browse page
- [ ] Search by skill name works
- [ ] Search by location works
- [ ] User cards show correct information
- [ ] "Request Swap" button opens modal

### ✅ Swap Request System
- [ ] User can send swap requests
- [ ] Swap requests appear in "Swaps" page
- [ ] Received requests show in left panel
- [ ] Sent requests show in right panel
- [ ] Accept/reject buttons work
- [ ] Status updates correctly

### ✅ Rating System
- [ ] User can leave ratings
- [ ] Ratings appear in "Ratings" page
- [ ] Average rating calculates correctly
- [ ] Star display works
- [ ] Comments show properly

---

## 🌐 API Testing with Postman/curl (DETAILED)

### Install Postman (Optional)
1. Go to https://www.postman.com/downloads/
2. Download and install Postman
3. Create free account

### Test Authentication Endpoints

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Login User:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Endpoints

**Get Profile (replace TOKEN with actual token):**
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Add Skill:**
```bash
curl -X POST http://localhost:5000/api/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "JavaScript",
    "type": "offered"
  }'
```

**Search Users:**
```bash
curl -X GET "http://localhost:5000/api/users/search?skill=JavaScript" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Ready for Demo! (DETAILED DEMO SCRIPT)

### Demo Video Structure (5-7 minutes)

**Introduction (30 seconds)**
- "Hi, I'm demonstrating the Skill Swap Platform"
- "A web app where users exchange skills with each other"
- "Built with React, Node.js, and PostgreSQL"

**User Registration (1 minute)**
- Show registration form
- Fill out user details
- Demonstrate form validation
- Show successful registration and auto-login

**Profile Setup (1 minute)**
- Navigate to profile page
- Edit profile information
- Add location and availability
- Save changes and show updated profile

**Skills Management (1.5 minutes)**
- Go to "My Skills" page
- Add multiple skills you can teach
- Add multiple skills you want to learn
- Show skills organized in sections
- Demonstrate delete functionality

**Browse and Search (1.5 minutes)**
- Navigate to browse page
- Show all users initially
- Search by skill (e.g., "JavaScript")
- Search by location (e.g., "New York")
- Show user cards with skills and info

**Swap Request System (1.5 minutes)**
- Click "Request Swap" on a user
- Fill out swap request form
- Send request
- Navigate to "Swaps" page
- Show sent and received requests
- Accept/reject a request

**Rating System (30 seconds)**
- Go to "Ratings" page
- Show rating interface
- Leave a rating with comment
- Show average rating calculation

**Conclusion (30 seconds)**
- Recap key features
- Mention tech stack
- Show responsive design on mobile

### Recording Tips
- Use OBS Studio or similar screen recorder
- Record at 1080p resolution
- Use good microphone for clear audio
- Keep browser console open to show no errors
- Have multiple user accounts ready
- Practice the demo flow beforehand

---

## 🎯 Production Deployment (DETAILED)

### Frontend Deployment (Vercel)

**Step 1: Prepare for deployment**
```bash
cd frontend

# Create production build
npm run build

# Test production build locally
npx serve -s build
```

**Step 2: Deploy to Vercel**
1. Go to https://vercel.com/
2. Sign up with GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Set build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Add environment variables:
   - `REACT_APP_API_URL`: Your backend URL
7. Click "Deploy"

### Backend Deployment (Render)

**Step 1: Prepare backend**
```bash
cd backend

# Add start script to package.json
# "start": "node app.js"

# Create render.yaml (optional)
```

**Step 2: Deploy to Render**
1. Go to https://render.com/
2. Sign up with GitHub account
3. Click "New Web Service"
4. Connect your GitHub repository
5. Set configuration:
   - Name: skill-swap-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables:
   - `JWT_SECRET`: Strong secret key
   - `DB_HOST`: Database host
   - `DB_USER`: Database user
   - `DB_PASSWORD`: Database password
   - `DB_NAME`: Database name
7. Click "Create Web Service"

### Database Deployment (Render PostgreSQL)

**Step 1: Create database**
1. In Render dashboard, click "New PostgreSQL"
2. Set database name: `skillswap`
3. Choose plan (free tier available)
4. Click "Create Database"

**Step 2: Get connection details**
1. Copy connection string
2. Update backend environment variables
3. Run schema on production database:

```bash
# Connect to production database
psql "your_production_database_url_here"

# Run schema
\i database/schema.sql

# Verify tables
\dt
```

### Environment Variables for Production

**Backend (.env):**
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=super_secure_production_secret_key_here
DB_HOST=your_render_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

**Frontend (Vercel environment variables):**
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

## 🎉 Final Checklist

### Before Demo
- [ ] Both servers running (backend on 5000, frontend on 3000)
- [ ] Database connected and tables created
- [ ] Can register new users
- [ ] Can add/remove skills
- [ ] Can search and browse users
- [ ] Can send/accept swap requests
- [ ] Can leave ratings
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

### Before Deployment
- [ ] Environment variables configured
- [ ] Production build works locally
- [ ] Database schema applied to production
- [ ] API endpoints tested
- [ ] CORS configured for production domains
- [ ] Error handling implemented
- [ ] Security headers added

### For Hackathon Submission
- [ ] Demo video recorded (5-7 minutes)
- [ ] GitHub repository clean and documented
- [ ] README.md updated with live demo links
- [ ] All features working in production
- [ ] Mobile responsive design verified
- [ ] Performance optimized

🎉 **Congratulations!** Your Skill Swap Platform is complete and ready for submission!