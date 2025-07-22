// API service for college registration
const API_BASE_URL = 'http://localhost/lifeboat/College'; // Your backend URL

export interface CollegeRegistrationData {
  // Section 1: College Information
  collegeName: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  establishedYear: string;
  representativeName: string;
  representativePhone: string;
  representativeEmail: string;
  collegeWebsite?: string;
  
  // Section 2: Academic & Financial Details
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  coordinatorDesignation: string;
  feeConcession: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  
  // Additional fields
  departments?: string;
  totalStudents?: string;
  batchesPassedOut?: string;
  passPercentage?: string;
  infrastructureDetails?: string;
}

export interface CollegeRegistrationResponse {
  success: boolean;
  message: string;
  collegeId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
}

export const collegeApi = {
  // Submit college registration
  async submitRegistration(data: CollegeRegistrationData): Promise<CollegeRegistrationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/colleges/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting registration:', error);
      throw new Error('Failed to submit registration. Please try again.');
    }
  },

  // Submit college registration with Firebase ID token
  async submitRegistrationWithToken(data: CollegeRegistrationData, idToken: string): Promise<CollegeRegistrationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/verify_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting registration with token:', error);
      throw new Error('Failed to submit registration. Please try again.');
    }
  },

  // Get college profile by ID
  async getCollegeProfile(collegeId: string): Promise<CollegeRegistrationData & { status: string; submittedAt: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/get_college/${collegeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching college profile:', error);
      throw new Error('Failed to fetch college profile.');
    }
  },
}; 