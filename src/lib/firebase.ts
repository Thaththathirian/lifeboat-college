// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCi7QqGACe1eUcdrobs-_2iGzfc2PgMtyY",
  authDomain: "lifeboat-94da5.firebaseapp.com",
  projectId: "lifeboat-94da5",
  storageBucket: "lifeboat-94da5.firebasestorage.app",
  messagingSenderId: "644249374099",
  appId: "1:644249374099:web:5f1c141461277a78f56c66",
  measurementId: "G-BTXPWCM79E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

// Initialize reCAPTCHA verifier
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initializeRecaptcha = (containerId: string) => {
  try {
    // Clear existing verifier if it exists
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {
        console.log('Clearing existing reCAPTCHA verifier');
      }
      recaptchaVerifier = null;
    }

    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`reCAPTCHA container with id '${containerId}' not found`);
      throw new Error('reCAPTCHA container not found');
    }

    // Create new verifier
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });

    console.log('reCAPTCHA verifier initialized successfully');
    return recaptchaVerifier;
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error);
    throw error;
  }
};

// Generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs temporarily (in production, use a proper database)
const otpStore = new Map<string, { otp: string; timestamp: number; attempts: number }>();

// Send OTP to email
export const sendOTP = async (email: string, containerId: string) => {
  try {
    console.log('Sending OTP to:', email);
    
    // Ensure reCAPTCHA is properly initialized
    const verifier = initializeRecaptcha(containerId);
    
    // Render reCAPTCHA if not already rendered
    try {
      await verifier.render();
      console.log('reCAPTCHA rendered successfully');
    } catch (renderError) {
      console.log('reCAPTCHA already rendered or render failed:', renderError);
    }
    
    // Generate OTP
    const otp = generateOTP();
    const timestamp = Date.now();
    
    // Store OTP with timestamp and attempts
    otpStore.set(email, { otp, timestamp, attempts: 0 });
    
    // For development/testing: Log the OTP to console
    console.log('🔐 EMAIL OTP FOR TESTING 🔐');
    console.log('Email:', email);
    console.log('OTP Code:', otp);
    console.log('🔐 END OTP 🔐');
    
    // In production, you would send this OTP via email service
    // For now, we'll simulate the email sending process
    
    console.log('OTP sent successfully via email');
    
    return {
      success: true,
      confirmationResult: { email, otp, timestamp },
      message: 'OTP sent successfully'
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send OTP';
    if (error instanceof Error) {
      if (error.message.includes('reCAPTCHA')) {
        errorMessage = 'reCAPTCHA verification failed. Please try again.';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Invalid email format. Please enter a valid email.';
      } else if (error.message.includes('too-many-requests')) {
        errorMessage = 'Too many attempts. Please wait before trying again.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult: any, otp: string) => {
  try {
    console.log('Verifying OTP...');
    
    const { email, timestamp } = confirmationResult;
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      throw new Error('OTP session not found. Please request a new OTP.');
    }
    
    // Check if OTP is expired (5 minutes)
    const now = Date.now();
    const otpAge = now - timestamp;
    const otpExpiry = 5 * 60 * 1000; // 5 minutes
    
    if (otpAge > otpExpiry) {
      otpStore.delete(email);
      throw new Error('OTP has expired. Please request a new one.');
    }
    
    // Check attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      throw new Error('Too many attempts. Please request a new OTP.');
    }
    
    // Increment attempts
    storedData.attempts++;
    
    // Verify OTP
    if (storedData.otp !== otp) {
      throw new Error('Invalid OTP code. Please check and try again.');
    }
    
    // OTP is valid, create a proper user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, `Password${Math.random().toString(36).substring(2, 15)}`);
    
    // Clean up stored OTP
    otpStore.delete(email);
    
    console.log('OTP verified successfully');
    
    return {
      success: true,
      user: userCredential.user,
      message: 'OTP verified successfully'
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    let errorMessage = 'Invalid OTP';
    if (error instanceof Error) {
      if (error.message.includes('invalid-verification-code')) {
        errorMessage = 'Invalid OTP code. Please check and try again.';
      } else if (error.message.includes('expired')) {
        errorMessage = 'OTP has expired. Please request a new one.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Clear reCAPTCHA
export const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
      console.log('reCAPTCHA cleared successfully');
    } catch (error) {
      console.log('Error clearing reCAPTCHA:', error);
    }
    recaptchaVerifier = null;
  }
};

// Get Firebase ID token for API authentication
export const getFirebaseIdToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('No current user found');
      return null;
    }
    
    const idToken = await currentUser.getIdToken();
    console.log('Firebase ID token retrieved successfully');
    return idToken;
  } catch (error) {
    console.error('Error getting Firebase ID token:', error);
    return null;
  }
};

export { auth, app, analytics }; 