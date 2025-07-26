import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  CreditCard,
  Banknote,
  Download,
  Edit,
  Lock,
  Unlock,
  Navigation
} from "lucide-react";
import { collegeApi, CollegeRegistrationData } from "@/lib/api";

interface CollegeDashboardProps {
  collegeId: string;
  onNavigateToPortal?: () => void;
}

export const CollegeDashboard = ({ collegeId, onNavigateToPortal }: CollegeDashboardProps) => {
  const [collegeData, setCollegeData] = useState<(CollegeRegistrationData & { status: string; submittedAt: string; id?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        setLoading(true);
        const data = await collegeApi.getCollegeProfile(collegeId);
        setCollegeData(data);
      } catch (err) {
        console.error('Error fetching college data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch college data');
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [collegeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading college profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collegeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl">Error Loading Profile</CardTitle>
              <CardDescription>{error || 'Failed to load college data'}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (collegeData.status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-orange-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (collegeData.status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800">Pending Verification</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {collegeData.collegeName}
              </h1>
              <div className="flex items-center space-x-4">
                {getStatusBadge()}
                <span className="text-muted-foreground">
                  Submitted on: {new Date(collegeData.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Building className="h-16 w-16 text-primary" />
          </div>
        </div>

        {/* Status Alert */}
        {collegeData.status === 'pending' && (
          <Card className="shadow-card mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <h3 className="font-semibold text-orange-800">Profile Pending Verification</h3>
                  <p className="text-orange-700 text-sm">
                    Your college profile has been submitted and is currently under review by our admin team. 
                    You will receive an email notification once the verification is complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approved Status Alert */}
        {collegeData.status === 'approved' && (
          <Card className="shadow-card mb-6 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon()}
                  <div>
                    <h3 className="font-semibold text-green-800">Profile Approved!</h3>
                    <p className="text-green-700 text-sm">
                      Your college profile has been approved. You now have access to all college portal features.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={onNavigateToPortal}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Access Full Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejected Status Alert */}
        {collegeData.status === 'rejected' && (
          <Card className="shadow-card mb-6 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <h3 className="font-semibold text-red-800">Profile Not Approved</h3>
                  <p className="text-red-700 text-sm">
                    Your college profile was not approved. Please contact our support team for more information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${collegeData.status === 'approved' ? 'grid-cols-4' : 'grid-cols-1'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {collegeData.status === 'approved' && (
              <>
                <TabsTrigger value="details">College Details</TabsTrigger>
                <TabsTrigger value="financial">Financial Info</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  {getStatusIcon()}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{collegeData.status}</div>
                  <p className="text-xs text-muted-foreground">
                    {collegeData.status === 'pending' ? 'Under review' : 'Verification complete'}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Established</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collegeData.establishedYear}</div>
                  <p className="text-xs text-muted-foreground">Years in operation</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">{collegeData.phone}</div>
                  <p className="text-xs text-muted-foreground">{collegeData.email}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your college profile</CardDescription>
              </CardHeader>
              <CardContent>
                {collegeData.status === 'approved' ? (
                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Profile
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Documents
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Access Restricted</p>
                      <p className="text-xs text-muted-foreground">
                        Additional features will be available after your profile is approved
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* College Details Tab */}
          {collegeData.status === 'approved' ? (
            <TabsContent value="details" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  College Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">College Name</label>
                      <p className="text-sm font-medium">{collegeData.collegeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Established Year</label>
                      <p className="text-sm font-medium">{collegeData.establishedYear}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-sm font-medium">{collegeData.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm font-medium">{collegeData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-sm font-medium">{collegeData.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Representative Name</label>
                      <p className="text-sm font-medium">{collegeData.representativeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Representative Phone</label>
                      <p className="text-sm font-medium">{collegeData.representativePhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Representative Email</label>
                      <p className="text-sm font-medium">{collegeData.representativeEmail}</p>
                    </div>
                    {collegeData.departments && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Departments</label>
                        <p className="text-sm font-medium">{collegeData.departments}</p>
                      </div>
                    )}
                    {collegeData.totalStudents && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Total Students</label>
                        <p className="text-sm font-medium">{collegeData.totalStudents}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          ) : (
            <TabsContent value="details" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-muted-foreground" />
                    Access Restricted
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Feature Not Available</h3>
                  <p className="text-muted-foreground">
                    This feature will be available after your profile is approved by our admin team.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Financial Info Tab */}
          {collegeData.status === 'approved' ? (
            <TabsContent value="financial" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Coordinator Name</label>
                      <p className="text-sm font-medium">{collegeData.coordinatorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Coordinator Designation</label>
                      <p className="text-sm font-medium">{collegeData.coordinatorDesignation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Coordinator Phone</label>
                      <p className="text-sm font-medium">{collegeData.coordinatorPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Coordinator Email</label>
                      <p className="text-sm font-medium">{collegeData.coordinatorEmail}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                      <p className="text-sm font-medium">{collegeData.bankName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                      <p className="text-sm font-medium">{collegeData.accountNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">IFSC Code</label>
                      <p className="text-sm font-medium">{collegeData.ifscCode}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fee Concession Details</label>
                  <p className="text-sm font-medium mt-2">{collegeData.feeConcession}</p>
                </div>

                {collegeData.infrastructureDetails && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Infrastructure Details</label>
                    <p className="text-sm font-medium mt-2">{collegeData.infrastructureDetails}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          ) : (
            <TabsContent value="financial" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-muted-foreground" />
                    Access Restricted
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Feature Not Available</h3>
                  <p className="text-muted-foreground">
                    This feature will be available after your profile is approved by our admin team.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Documents Tab */}
          {collegeData.status === 'approved' ? (
            <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents & Files
                </CardTitle>
                <CardDescription>Uploaded documents and files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-2">Infrastructure Photos</p>
                    <p className="text-sm text-muted-foreground">Labs, placement training facilities, campus images</p>
                    <Badge variant="secondary" className="mt-2">Optional</Badge>
                  </div>
                  
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-2">Cancelled Cheque</p>
                    <p className="text-sm text-muted-foreground">Required for bank verification</p>
                    <Badge variant="secondary" className="mt-2">Required</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          ) : (
            <TabsContent value="documents" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-muted-foreground" />
                    Access Restricted
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Feature Not Available</h3>
                  <p className="text-muted-foreground">
                    This feature will be available after your profile is approved by our admin team.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}; 