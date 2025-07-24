import React from "react";
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
  Banknote
} from "lucide-react";
import { CollegeRegistrationData } from "@/lib/api";

interface VerificationPendingProps {
  collegeData: CollegeRegistrationData & {
    submittedAt: string;
    collegeId: string;
  };
  onRefresh?: () => void;
}

export const VerificationPending = ({ collegeData, onRefresh }: VerificationPendingProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

        {/* What Happens Next */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Admin Review</h3>
                  <p className="text-muted-foreground">
                    Our admin team will review your college profile, verify documents, and check all submitted information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Notification</h3>
                  <p className="text-muted-foreground">
                    You will receive an email notification at <strong>{collegeData.email}</strong> once the review is complete.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Portal Access</h3>
                  <p className="text-muted-foreground">
                    Once approved, you'll have full access to the college portal with all features and capabilities.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estimated Timeline */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              Estimated Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24-48</div>
                <div className="text-sm text-muted-foreground">Hours</div>
                <div className="text-xs text-muted-foreground mt-1">Initial Review</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3-5</div>
                <div className="text-sm text-muted-foreground">Days</div>
                <div className="text-xs text-muted-foreground mt-1">Complete Verification</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">Immediate</div>
                <div className="text-sm text-muted-foreground">Access</div>
                <div className="text-xs text-muted-foreground mt-1">After Approval</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              Available Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
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
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2"
                onClick={onRefresh}
              >
                <RefreshCw className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Check Status</div>
                  <div className="text-xs text-muted-foreground">Refresh verification status</div>
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