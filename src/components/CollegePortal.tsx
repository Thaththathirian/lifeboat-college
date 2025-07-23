import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  GraduationCap, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Mail,
  Phone,
  Building,
  Navigation
} from "lucide-react";

interface CollegePortalProps {
  collegeData: {
    id: string;
    name: string;
    status: "pending" | "approved" | "rejected";
    approvalDate?: string;
  };
  onBackToDashboard?: () => void;
}

export const CollegePortal = ({ collegeData, onBackToDashboard }: CollegePortalProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  if (collegeData.status !== "approved") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {collegeData.status === "pending" ? (
                  <Clock className="h-16 w-16 text-orange-500" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-destructive" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {collegeData.status === "pending" ? "Registration Under Review" : "Registration Not Approved"}
              </CardTitle>
              <CardDescription className="text-lg">
                {collegeData.status === "pending" 
                  ? "Your college registration is currently being reviewed by our admin team. You will receive an email notification once the review is complete."
                  : "Your college registration was not approved. Please contact our support team for more information."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge 
                variant={collegeData.status === "pending" ? "secondary" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {collegeData.status === "pending" ? "Pending Review" : "Not Approved"}
              </Badge>
              <div className="mt-6 space-y-4">
                <p className="text-muted-foreground">
                  Need assistance? Contact our support team:
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBackToDashboard && (
                <Button variant="ghost" onClick={onBackToDashboard} className="mr-4">
                  <Navigation className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome to {collegeData.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approved College
                  </Badge>
                  <span className="text-muted-foreground">
                    Approved on: {collegeData.approvalDate}
                  </span>
                </div>
              </div>
            </div>
            <Building className="h-16 w-16 text-primary" />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground">+12 from last month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scholarships</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹12,45,000</div>
                  <p className="text-xs text-muted-foreground">Current semester</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.5%</div>
                  <p className="text-xs text-muted-foreground">Last semester</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">25 new scholarship applications received</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Fee receipts approved for 18 students</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Semester results pending approval</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage scholarship students and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="space-x-2">
                    <Button variant="outline">All Students</Button>
                    <Button variant="outline">Active</Button>
                    <Button variant="outline">Inactive</Button>
                    <Button variant="outline">Alumni</Button>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left">Student ID</th>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Semester</th>
                        <th className="p-4 text-left">Scholarship Amount</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4">STU001</td>
                        <td className="p-4">John Doe</td>
                        <td className="p-4">5th</td>
                        <td className="p-4">₹10,000</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Scholarship Management</CardTitle>
                <CardDescription>Track and manage scholarship allocations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Semester</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Students:</span>
                          <span className="font-semibold">142</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Amount:</span>
                          <span className="font-semibold">₹12,45,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>College Contribution:</span>
                          <span className="font-semibold">₹2,48,000</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Pending Payments:</span>
                          <span className="font-semibold text-orange-600">25</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completed Payments:</span>
                          <span className="font-semibold text-green-600">117</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Receipt Verification:</span>
                          <span className="font-semibold text-blue-600">32</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipts Tab */}
          <TabsContent value="receipts" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Receipt Management</CardTitle>
                <CardDescription>Approve and verify fee receipts from students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="space-x-2">
                    <Button variant="outline">Pending Approval</Button>
                    <Button variant="outline">Approved</Button>
                    <Button variant="outline">Rejected</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Receipt #R001 - John Doe</p>
                          <p className="text-sm text-muted-foreground">Amount: ₹10,000 | Date: 2024-01-15</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="text-green-600">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Manage college documents and student records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">MOU Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Partnership MOU</p>
                            <p className="text-sm text-muted-foreground">Signed: 2024-01-01</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New Document
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Student Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Mark Sheets Pending:</span>
                          <span className="font-semibold">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Documents Verified:</span>
                          <span className="font-semibold">127</span>
                        </div>
                        <Button variant="outline" className="w-full">
                          View All Records
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>College Profile</CardTitle>
                <CardDescription>Manage your college information and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Basic Information</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">College Name:</span> {collegeData.name}</p>
                        <p><span className="font-medium">College ID:</span> {collegeData.id}</p>
                        <p><span className="font-medium">Status:</span> 
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Approved</Badge>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">Update Profile</Button>
                        <Button variant="outline" className="w-full">Change Password</Button>
                        <Button variant="outline" className="w-full">Download Reports</Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">Annual Information Update</h3>
                    <p className="text-muted-foreground mb-4">
                      Please update your college information annually. Last updated: January 2024
                    </p>
                    <Button variant="hero">
                      Update Annual Information
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};