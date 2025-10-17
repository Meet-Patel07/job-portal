# 💼 Job Portal Web App

A full-stack Job Portal built with React, Node.js, and MongoDB, designed to streamline job applications and company recruitment workflows.

This project showcases practical implementation of authentication, role-based access, API integration, and modern UI — built as part of my full-stack development practice.

---

## 🚀 Overview

This web app allows:

- Job Seekers to register, browse jobs, and apply directly.
- Recruiters to post openings, view applicants, and manage hiring statuses.

It’s a realistic simulation of a modern job platform, built with scalable architecture and clean design principles.

---

## ✨ Key Features

### For Job Seekers:

- Secure registration & login (Clerk authentication)
- Explore jobs with search and filters
- Apply to jobs directly from dashboard
- Track application status (Pending / Accepted / Rejected)

### For Recruiters:

- Create and manage job postings
- Review applications per job
- Accept or reject applicants instantly
- Update company details and logos

### General Features:

- Image & resume upload via Cloudinary
- Token-based route protection
- Responsive design using Tailwind CSS
- Toast notifications for actions and errors

---

## 🛠️ Tech Stack

Frontend: React.js, Tailwind CSS, Axios  
Backend: Node.js, Express.js  
Database: MongoDB, Mongoose  
Authentication: Clerk  
File Uploads: Multer, Cloudinary  
Notifications: React-Toastify  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```
 git clone https://github.com/yourusername/job-portal.git
 cd job-portal
```

### 2. Install Dependencies

#### Backend

```
cd server
npm install
```

#### Frontend

```
cd ../client
npm install
```

### 3. Configure Environment Variables

#### Server .env:

```
PORT=5000
MONGO_URI=your_mongodb_uri
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret
CLERK_SECRET_KEY=your_clerk_secret_key
JWT_SECRET=your_jwt_secret
```

#### Client .env:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Run the App

#### Backend

```
cd server
npm run dev
```

#### Frontend

```
cd ../client
npm run dev
```

Open your browser and go to http://localhost:5173

## 🎯 Purpose

This project was developed as part of my career practice in full-stack web development, focusing on:

- Building scalable APIs
- Handling authentication and authorization
- Managing complex frontend state
- Integrating third-party services like Cloudinary and Clerk

---

## 📜 License

Personal use and learning project.  
Not intended for production or public contribution.

---

## 👨‍💻 Developer

Developed by Meet Patel  
Frontend Developer | MERN Stack Practitioner
