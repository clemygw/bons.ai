## Prerequisites

### Before proceeding, ensure you have the following installed on your system:
```
Node.js (v16 or higher recommended)
npm (Node Package Manager)
MongoDB (locally installed or a cloud-based MongoDB Atlas cluster)
Git (optional, if cloning the repository)
```

## Instructions to Build

## Step 1: Clone the Repository (Optional)

If your project is hosted on a Git repository, clone it to your local machine:

bash
Copy
git clone <repository-url>
cd <project-folder>
Replace <repository-url> with the URL of your Git repository and <project-folder> with the name of the folder created after cloning.

## Step 2: Install Dependencies

The MERN stack typically has two main directories: one for the frontend (React) and one for the backend (Node.js/Express). Navigate to each directory and install the required dependencies.

Backend Setup
```
Navigate to the backend directory:
cd backend
Install the backend dependencies:
npm install
```

Frontend Setup
```
Navigate to the frontend directory:
cd ../frontend
Install the frontend dependencies:
npm install
```
## Step 3: Configure Environment Variables

Both the frontend and backend may require environment variables to function properly. These variables are typically stored in .env files.

### Backend Environment Variables

```
cd ./backend
Create a .env file in the root of the backend directory:
touch .env
Add the required environment variables to the .env file. For example:
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-jwt-secret-key
```
### Frontend Environment Variables
```
cd ./frontend
Create a .env file in the root of the frontend directory:
touch .env
Add the required environment variables to the .env file. For example:
REACT_APP_API_URL=http://localhost:5000
```

## Instructions to Run

### Step 1: Start the Backend Server

```
cd backend
Start the backend server:
npm run dev
```
The backend server should now be running on the port specified in your .env file (e.g., http://localhost:5000).
### Step 2: Start the Frontend Development Server

Navigate to the frontend directory:
```
cd frontend
Start the frontend development server:
npm run dev
```
The frontend development server should now be running on http://localhost:3000.

**You've done it! Navigate to http://localhost:3000 to interact with bons.ai**
