# College Registration System with Email OTP Verification

A complete college registration system with Firebase email OTP verification, form persistence, and dashboard functionality.

## Features

### 🔐 **Email OTP Verification**
- **Firebase Integration**: Uses Firebase Authentication for secure OTP delivery
- **reCAPTCHA Protection**: Invisible reCAPTCHA to prevent spam
- **60-second Countdown**: Resend button with countdown timer
- **Form Persistence**: All form data is preserved if OTP fails
- **Bearer Token Authentication**: Secure API communication with Firebase ID tokens

### 📝 **Multi-Step Registration Form**
- **Section 1**: College Information (Required fields)
- **Section 2**: Academic & Financial Details (Required fields)
- **Form Validation**: Real-time validation with error messages
- **Progress Indicator**: Visual progress through form sections

### 📊 **College Dashboard**
- **Pending Verification Status**: Clear status indication
- **Complete Form Display**: All submitted data organized in tabs
- **Responsive Design**: Works on all devices
- **Loading States**: User feedback during operations

### 🔧 **Backend API**
- **Express.js Server**: RESTful API endpoints
- **Bearer Token Verification**: Firebase ID token validation
- **Data Validation**: Server-side validation
- **In-Memory Storage**: Demo data storage

## Setup Instructions

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm install express cors
```

### 2. Start the Backend Server

```bash
node server.js
```

The server will run on `http://localhost:3001`

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Workflow

### 1. **Registration Flow**
1. User fills out the multi-step registration form
2. User clicks "Submit Registration" button
3. System navigates to Email OTP verification page
4. OTP is automatically sent to the user's email
5. User enters the 6-digit OTP code
6. System verifies OTP with Firebase
7. If successful, data is sent to backend with bearer token
8. User is redirected to dashboard with "Pending Verification" status

### 2. **Error Handling**
- **OTP Failure**: User stays on OTP page, can resend or go back
- **Form Data Persistence**: All entered data is preserved
- **Network Errors**: Graceful error handling with user feedback
- **Validation Errors**: Real-time form validation

### 3. **Resend Functionality**
- **60-second Countdown**: Timer prevents spam
- **Visual Feedback**: Loading states and countdown display
- **Error Handling**: Specific error messages for different scenarios

## API Endpoints

### Register College (with Firebase token)
```
POST /verify_email
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "collegeName": "Example College",
  "email": "college@example.com",
  // ... other fields
}
```

### Get College Profile
```
GET /get_college/COL001
```

### Get All Colleges (Admin)
```
GET /get_all_colleges
```

### Update College Status (Admin)
```
PATCH /update_college_status/COL001
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

## Firebase Configuration

The system uses Firebase for:
- **Email OTP**: Secure OTP delivery
- **reCAPTCHA**: Spam protection
- **ID Tokens**: API authentication

Firebase config is in `src/lib/firebase.ts`

## Security Features

- **Bearer Token Authentication**: All API calls include Firebase ID tokens
- **reCAPTCHA Protection**: Prevents automated form submissions
- **Form Validation**: Client and server-side validation
- **Error Handling**: Secure error messages without exposing internals

## Testing

1. **Fill Registration Form**: Complete all required fields
2. **Submit Form**: Click "Submit Registration"
3. **OTP Verification**: Enter the 6-digit code sent to email
4. **Dashboard**: View submitted data with pending status
5. **Resend Test**: Test resend functionality with countdown

## Troubleshooting

- **Firebase Setup**: Ensure Firebase project is configured correctly
- **CORS Issues**: Backend includes CORS middleware
- **OTP Delivery**: Check Firebase console for delivery status
- **Token Issues**: Verify Firebase ID token generation

## Development

- **Frontend**: React + TypeScript + Vite
- **UI Components**: Shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **Authentication**: Firebase Auth
- **Backend**: Express.js
- **API**: RESTful with bearer token authentication
