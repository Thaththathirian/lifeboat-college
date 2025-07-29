import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Mail, 
  Phone,
  Building,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  User,
  CreditCard,
  MapPin,
  Globe,
  GraduationCap,
  Users,
  Award,
  Banknote,
  Upload,
  Eye
} from "lucide-react";
import { CollegeRegistrationData, collegeApi } from "@/lib/api";

interface VerificationPendingProps {
  collegeData: CollegeRegistrationData & {
    submittedAt: string;
    collegeId: string;
  };
  onRefresh?: () => void;
}

interface UploadedDocuments {
  infraFiles?: File[];
  chequeFile?: File | null;
}

export const VerificationPending = ({ collegeData, onRefresh }: VerificationPendingProps) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocuments | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch college data when component mounts (for revisits)
  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, you would fetch the college data by ID
        // For now, we'll use the passed data
        console.log('Fetching college data for ID:', collegeData.collegeId);
        
        // Use actual uploaded files from the registration data
        // In a real implementation, this would be fetched from the backend
        setTimeout(() => {
          // Check if we have actual files in the college data
          if (collegeData.files) {
            setUploadedDocuments({
              infraFiles: collegeData.files.infraFiles || [],
              chequeFile: collegeData.files.chequeFile
            });
          } else {
            // Fallback to empty state if no files are available
            setUploadedDocuments({
              infraFiles: [],
              chequeFile: null
            });
          }
          setIsLoading(false);
        }, 500); // Reduced timeout for better UX
      } catch (error) {
        console.error('Error fetching college data:', error);
        setIsLoading(false);
      }
    };

    fetchCollegeData();
  }, [collegeData.collegeId, collegeData.files]);

  const handleDownloadDocument = (file: File) => {
    // Create a download link for the file
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading college data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Clock className="h-20 w-20 text-orange-500" />
              <div className="absolute -top-2 -right-2">
                <div className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-orange-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Verification Pending
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your college registration has been submitted successfully and is currently under review.
          </p>
        </div>

        {/* Status Card */}
        <Card className="shadow-card mb-8 border-orange-200 bg-orange-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <Clock className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-orange-800">
              Under Review
            </CardTitle>
            <CardDescription className="text-orange-700">
              Our admin team is reviewing your college profile
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-lg px-4 py-2">
              Pending Verification
            </Badge>
          </CardContent>
        </Card>

        {/* College Information */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-6 w-6 mr-2" />
              College Information
            </CardTitle>
            <CardDescription>
              Your submitted college details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">College Name</label>
                  <p className="text-lg font-semibold">{collegeData.collegeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration ID</label>
                  <p className="text-lg font-semibold text-primary">{collegeData.collegeId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Established Year</label>
                  <p className="text-lg font-semibold">{collegeData.establishedYear}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted On</label>
                  <p className="text-lg font-semibold">{formatDate(collegeData.submittedAt)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">{collegeData.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">{collegeData.phone}</p>
                  </div>
                </div>
                {collegeData.collegeWebsite && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Website</label>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg font-semibold">{collegeData.collegeWebsite}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Address */}
            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <div className="flex items-start space-x-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <p className="text-lg font-semibold">{collegeData.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Representative */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-6 w-6 mr-2" />
              Management Representative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-semibold">{collegeData.representativeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">{collegeData.representativePhone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">{collegeData.representativeEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Coordinator */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              Academic Coordinator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-semibold">{collegeData.coordinatorName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Designation</label>
                  <p className="text-lg font-semibold">{collegeData.coordinatorDesignation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">{collegeData.coordinatorPhone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">{collegeData.coordinatorEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        {(collegeData.departments || collegeData.totalStudents || collegeData.batchesPassedOut || collegeData.passPercentage) && (
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {collegeData.departments && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Number of Departments</label>
                    <p className="text-lg font-semibold">{collegeData.departments}</p>
                  </div>
                )}
                {collegeData.totalStudents && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Students</label>
                    <p className="text-lg font-semibold">{collegeData.totalStudents}</p>
                  </div>
                )}
                {collegeData.batchesPassedOut && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Batches Passed Out</label>
                    <p className="text-lg font-semibold">{collegeData.batchesPassedOut}</p>
                  </div>
                )}
                {collegeData.passPercentage && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pass Percentage</label>
                    <p className="text-lg font-semibold">{collegeData.passPercentage}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Information */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-6 w-6 mr-2" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fee Concession Details</label>
                <p className="text-lg font-semibold mt-1">{collegeData.feeConcession}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                  <p className="text-lg font-semibold">{collegeData.bankName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                  <p className="text-lg font-semibold">{collegeData.accountNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IFSC Code</label>
                  <p className="text-lg font-semibold">{collegeData.ifscCode}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Details */}
        {collegeData.infrastructureDetails && (
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-6 w-6 mr-2" />
                Infrastructure Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Facilities & Infrastructure</label>
                <p className="text-lg font-semibold mt-1">{collegeData.infrastructureDetails}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uploaded Documents */}
        {uploadedDocuments && (
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-6 w-6 mr-2" />
                Uploaded Documents
              </CardTitle>
              <CardDescription>
                Documents submitted with your registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Infrastructure Photos */}
                {uploadedDocuments.infraFiles && uploadedDocuments.infraFiles.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Infrastructure Photos
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {uploadedDocuments.infraFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadDocument(file)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // In a real app, this would open a preview
                                alert(`Preview: ${file.name}`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancelled Cheque */}
                {uploadedDocuments.chequeFile && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Cancelled Cheque
                    </label>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{uploadedDocuments.chequeFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedDocuments.chequeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(uploadedDocuments.chequeFile!)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In a real app, this would open a preview
                            alert(`Preview: ${uploadedDocuments.chequeFile!.name}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              Available Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2"
                onClick={() => window.print()}
              >
                <Download className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Download Receipt</div>
                  <div className="text-xs text-muted-foreground">Save registration confirmation</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              support@collegeportal.com
            </span>
            <span className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              +91 98765 43210
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 