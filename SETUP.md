# College Registration System Setup

This project includes a React frontend and a Node.js mock API backend for the college registration system.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
# Copy server dependencies to main package.json or install separately
npm install express cors
npm install --save-dev nodemon
```

### 3. Start the Backend Server

In one terminal, start the mock API server:

```bash
node server.js
```

The server will run on `http://localhost:3001`

### 4. Start the Frontend

In another terminal, start the React development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port shown in your terminal)

## Features

### Frontend
- **College Registration Form**: Multi-step form with validation
- **College Dashboard**: Shows submitted form data with pending verification status
- **Responsive Design**: Works on desktop and mobile
- **Form Validation**: Real-time validation with error messages
- **Progress Indicator**: Visual progress through form sections

### Backend API
- **POST /api/colleges/register**: Submit college registration
- **GET /api/colleges/:collegeId**: Get college profile
- **GET /api/colleges**: Get all colleges (for admin)
- **PATCH /api/colleges/:collegeId/status**: Update college status

## Workflow

1. **Landing Page**: User sees the main landing page with options to register or login
2. **Registration**: User fills out the multi-step college registration form
3. **API Submission**: Form data is sent to the backend API
4. **Dashboard**: After successful submission, user is redirected to the dashboard
5. **Pending Status**: Dashboard shows "Profile Pending Verification" status
6. **Admin Review**: Admin can review and approve/reject registrations

## API Endpoints

### Register College
```
POST /api/colleges/register
Content-Type: application/json

{
  "collegeName": "Example College",
  "phone": "+91 9876543210",
  "email": "college@example.com",
  // ... other fields
}
```

### Get College Profile
```
GET /api/colleges/COL001
```

### Update College Status (Admin)
```
PATCH /api/colleges/COL001/status
Content-Type: application/json

{
  "status": "approved"
}
```

## Form Fields

### Section 1: College Information (Required)
- College Name
- Established Year
- Address
- Email
- Phone Number
- Management Representative Name
- Representative Phone
- Representative Email

### Section 2: Academic & Financial Details (Required)
- Coordinator Name
- Coordinator Designation
- Coordinator Phone
- Coordinator Email
- Fee Concession Details
- Bank Name
- Account Number
- Confirm Account Number
- IFSC Code

### Optional Fields
- Number of Departments
- Total Students
- Batches Passed Out
- Pass Percentage
- Infrastructure Details

## Testing

1. Fill out the registration form with test data
2. Submit the form
3. You should be redirected to the dashboard showing "Pending Verification"
4. Check the server console for the submitted data
5. The dashboard displays all the submitted information in organized tabs

## Troubleshooting

- **API Connection Error**: Make sure the backend server is running on port 3001
- **CORS Issues**: The backend includes CORS middleware to allow frontend requests
- **Form Validation**: All required fields must be filled before submission
- **Account Number Mismatch**: The form validates that account numbers match

## Development

- Frontend: React + TypeScript + Vite
- UI Components: Shadcn/ui
- Form Handling: React Hook Form + Zod
- Backend: Express.js
- API: RESTful endpoints with JSON responses 