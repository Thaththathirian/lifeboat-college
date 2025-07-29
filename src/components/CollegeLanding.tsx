import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Award, Building, LogIn } from "lucide-react";
import { CollegeRegistrationForm } from "./CollegeRegistrationForm";
import { CollegePortal } from "./CollegePortal";
import { CollegeDashboard } from "./CollegeDashboard";
import { VerificationPending } from "./VerificationPending";
// import { EmailOTPVerification } from "./EmailOTPVerification";
import { CollegePasswordSetup } from "./CollegePasswordSetup";
import { LoginSystem } from "./LoginSystem";
import { AdminPanel } from "./AdminPanel";
import { CollegeRegistrationData } from "@/lib/api";

export const CollegeLanding = () => {
  const [currentView, setCurrentView] = useState("landing");
  const [userType, setUserType] = useState("");
  const [registeredCollegeId, setRegisteredCollegeId] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<{
    collegeName: string;
    email: string;
    phone: string;
    submittedAt: string;
    collegeId: string;
  } | null>(null);
  const [fullCollegeData, setFullCollegeData] = useState<CollegeRegistrationData | null>(null);
  // const [otpEmail, setOtpEmail] = useState<string>("");
  const [collegeFormData, setCollegeFormData] = useState<CollegeRegistrationData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ infraFiles: File[], chequeFile: File | null } | null>(null);
  const [currentFormSection, setCurrentFormSection] = useState<number>(0);

  const handleLogin = (type: string, credentials: any) => {
    setUserType(type);
    if (type === "admin") {
      setCurrentView("admin");
    } else if (type === "college") {
      setCurrentView("college-portal");
    } else {
      setCurrentView("landing");
    }
  };

  if (currentView === "registration") {
    return (
      <CollegeRegistrationForm 
        onBack={() => setCurrentView("landing")} 
        onRegistrationSuccess={(collegeId) => {
          setRegisteredCollegeId(collegeId);
          setCurrentView("dashboard");
        }}
        onProceedToPassword={(email, data, files) => {
          // setOtpEmail(email);
          setCollegeFormData(data);
          setUploadedFiles(files);
          setCurrentView("password-setup");
        }}
        // Pass the persisted form data and files back to the form
        initialData={collegeFormData}
        initialFiles={uploadedFiles}
        initialSection={currentFormSection}
        onSectionChange={(section) => setCurrentFormSection(section)}
      />
    );
  }

  // Comment out OTP verification flow
  /*
  if (currentView === "otp-verification" && otpEmail && collegeFormData) {
    return (
      <EmailOTPVerification
        email={otpEmail}
        collegeData={collegeFormData}
        onBack={() => {
          setCurrentView("registration");
          // Keep the form data persistent by not clearing it
        }}
        onSuccess={(collegeId) => {
          setRegisteredCollegeId(collegeId);
          setCurrentView("dashboard");
          // Clear the form data after successful registration
          setCollegeFormData(null);
          setOtpEmail("");
        }}
      />
    );
  }
  */

  // New password setup flow
  if (currentView === "password-setup" && collegeFormData && uploadedFiles) {
    return (
      <CollegePasswordSetup
        collegeData={collegeFormData}
        uploadedFiles={uploadedFiles}
        onBack={() => {
          setCurrentView("registration");
          // Keep the form data and files persistent by not clearing them
        }}
        onSuccess={(collegeId, collegeInfo) => {
          setRegisteredCollegeId(collegeId);
          // Set verification data for the pending page
          setVerificationData({
            collegeName: collegeInfo.collegeName,
            email: collegeInfo.email,
            phone: collegeInfo.phone,
            submittedAt: collegeInfo.submittedAt,
            collegeId: collegeId
          });
          // Store the full college data for the verification pending page
          setFullCollegeData({
            ...collegeFormData,
            files: uploadedFiles // Include the uploaded files
          });
          setCurrentView("verification-pending");
          // Clear the form data after successful registration
          setCollegeFormData(null);
          setUploadedFiles(null);
        }}
      />
    );
  }

  if (currentView === "login") {
    return <LoginSystem onLogin={handleLogin} />;
  }

  if (currentView === "admin") {
    return <AdminPanel />;
  }

  if (currentView === "college-portal") {
    return <CollegePortal 
      collegeData={{
        id: "COL001",
        name: "Demo College",
        status: "approved",
        approvalDate: "2024-01-01"
      }}
      onBackToDashboard={() => setCurrentView("dashboard")}
    />;
  }

  if (currentView === "verification-pending" && verificationData) {
    // Use full college data if available, otherwise fall back to basic data
    const collegeDataToShow = fullCollegeData ? {
      ...fullCollegeData,
      submittedAt: verificationData.submittedAt,
      collegeId: verificationData.collegeId
    } : {
      // Fallback with basic data structure
      collegeName: verificationData.collegeName,
      email: verificationData.email,
      phone: verificationData.phone,
      address: "",
      establishedYear: "",
      representativeName: "",
      representativePhone: "",
      representativeEmail: "",
      coordinatorName: "",
      coordinatorPhone: "",
      coordinatorEmail: "",
      coordinatorDesignation: "",
      feeConcession: "",
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      fieldName: "college registration",
      submittedAt: verificationData.submittedAt,
      collegeId: verificationData.collegeId,
      files: {
        infraFiles: [],
        chequeFile: null
      }
    };

    return <VerificationPending 
      collegeData={collegeDataToShow}
      onRefresh={() => {
        // In a real app, this would check the verification status
        // For demo purposes, we'll simulate a status check
        // You can replace this with actual API call to check verification status
        const isApproved = Math.random() > 0.7; // 30% chance of being approved for demo
        
        if (isApproved) {
          setCurrentView("dashboard");
        } else {
          // Show a toast that status is still pending
          alert("Your verification is still pending. Please check back later.");
        }
      }}
    />;
  }

  if (currentView === "dashboard" && registeredCollegeId) {
    return <CollegeDashboard 
      collegeId={registeredCollegeId} 
      onNavigateToPortal={() => setCurrentView("college-portal")}
    />;
  }

  // Check if user has pending verification and redirect them
  if (verificationData && currentView === "landing") {
    setCurrentView("verification-pending");
    return null; // This will trigger a re-render with the verification pending page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
            College Partnership Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join our mission to provide quality education and scholarships to deserving students. 
            Partner with us to make a difference in students' lives.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card p-12 rounded-2xl shadow-card mb-16">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Ready to Partner with Us?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Complete your college profile to join our network of partner institutions 
            and start making a difference in students' lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => setCurrentView("registration")}
              className="text-lg px-8 py-6 h-auto"
            >
              <GraduationCap className="mr-3 h-6 w-6" />
              Register College
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setCurrentView("login")}
              className="text-lg px-8 py-6 h-auto"
            >
              <LogIn className="mr-3 h-6 w-6" />
              Login to Portal
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-scale-in">
          <div className="bg-card p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Student Management</h3>
            <p className="text-muted-foreground">
              Manage scholarship applications, track student progress, and support their academic journey.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
            <Award className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Scholarship Program</h3>
            <p className="text-muted-foreground">
              Participate in our comprehensive scholarship program and help students achieve their dreams.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
            <Building className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Infrastructure Support</h3>
            <p className="text-muted-foreground">
              Showcase your facilities and get support for infrastructure development and placement training.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};