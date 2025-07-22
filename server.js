const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo
let colleges = [];
let collegeCounter = 1;

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // For demo purposes, we'll just check if the token exists
    // In production, you would verify the token with Firebase Admin SDK
    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token'
      });
    }

    // Log the token for demo purposes
    console.log('Received Firebase ID token:', idToken.substring(0, 20) + '...');
    
    // In production, you would verify the token here
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid authorization token'
    });
  }
};

// API Routes
// Register with Firebase token verification
app.post('/verify_email', verifyFirebaseToken, (req, res) => {
  try {
    const collegeData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'collegeName', 'phone', 'email', 'address', 'establishedYear',
      'representativeName', 'representativePhone', 'representativeEmail',
      'coordinatorName', 'coordinatorPhone', 'coordinatorEmail', 'coordinatorDesignation',
      'feeConcession', 'bankName', 'accountNumber', 'confirmAccountNumber', 'ifscCode'
    ];
    
    for (const field of requiredFields) {
      if (!collegeData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }
    
    // Validate account numbers match
    if (collegeData.accountNumber !== collegeData.confirmAccountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Account numbers do not match'
      });
    }
    
    // Create college record
    const collegeId = `COL${String(collegeCounter).padStart(3, '0')}`;
    const newCollege = {
      id: collegeId,
      ...collegeData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    colleges.push(newCollege);
    collegeCounter++;
    
    console.log('College registered with Firebase token:', newCollege);
    
    res.status(201).json({
      success: true,
      message: 'College registration submitted successfully',
      collegeId: collegeId,
      status: 'pending',
      submittedAt: newCollege.submittedAt
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/get_college/:collegeId', (req, res) => {
  try {
    const { collegeId } = req.params;
    const college = colleges.find(c => c.id === collegeId);
    
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }
    
    res.json({
      success: true,
      ...college
    });
    
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all colleges (for admin)
app.get('/get_all_colleges', (req, res) => {
  try {
    res.json({
      success: true,
      colleges: colleges
    });
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update college status (for admin)
app.patch('/update_college_status/:collegeId', (req, res) => {
  try {
    const { collegeId } = req.params;
    const { status } = req.body;
    
    const college = colleges.find(c => c.id === collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }
    
    college.status = status;
    college.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: `College status updated to ${status}`,
      college: college
    });
    
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
}); 