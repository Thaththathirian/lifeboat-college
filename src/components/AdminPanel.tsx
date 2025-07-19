import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Building, 
  Heart, 
  DollarSign, 
  FileText, 
  Mail, 
  Download,
  Eye,
  Check,
  X,
  Search,
  Filter,
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageSquare
} from "lucide-react";

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for demonstration
  const pendingColleges = [
    {
      id: "COL001",
      name: "ABC Engineering College",
      submittedDate: "2024-01-15",
      representative: "Dr. John Smith",
      phone: "+91 9876543210",
      status: "pending"
    },
    {
      id: "COL002", 
      name: "XYZ Institute of Technology",
      submittedDate: "2024-01-14",
      representative: "Prof. Jane Doe",
      phone: "+91 9876543211",
      status: "pending"
    }
  ];

  const stats = {
    totalStudents: 2847,
    activeStudents: 2156,
    totalColleges: 45,
    approvedColleges: 38,
    totalDonors: 156,
    activeDonors: 142,
    totalScholarships: "₹45,67,890",
    thisMonth: "₹8,45,000"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage the scholarship ecosystem and monitor all activities
              </p>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800 text-lg px-4 py-2">
              Admin Access
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="donors">Donors</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Statistics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stats.activeStudents}</span> active
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Colleges</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalColleges}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stats.approvedColleges}</span> approved
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Donors</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDonors}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stats.activeDonors}</span> active
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalScholarships}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stats.thisMonth}</span> this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Approvals */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                    Pending College Approvals
                  </CardTitle>
                  <CardDescription>
                    Colleges awaiting admin approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingColleges.map((college) => (
                      <div key={college.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{college.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {college.submittedDate}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Pending
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Latest system activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">45 new scholarship applications</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">2 colleges approved</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New donor registered</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  Manage scholarship applications, approvals, and student progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search students..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Message to Students</DialogTitle>
                          <DialogDescription>
                            Send notifications or reminders to selected students
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Message Type</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option>Document Reminder</option>
                              <option>Interview Notification</option>
                              <option>Progress Update</option>
                              <option>General Announcement</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Message</label>
                            <Textarea 
                              placeholder="Enter your message..."
                              className="mt-1"
                            />
                          </div>
                          <Button className="w-full">Send Message</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">1,234</div>
                        <p className="text-sm text-muted-foreground">Applied Students</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">856</div>
                        <p className="text-sm text-muted-foreground">Approved Students</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">45</div>
                        <p className="text-sm text-muted-foreground">Pending Interview</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left">Student ID</th>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">College</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Amount</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4">STU001</td>
                        <td className="p-4">Rahul Kumar</td>
                        <td className="p-4">ABC Engineering</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                        </td>
                        <td className="p-4">₹10,000</td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Pay</Button>
                          </div>
                        </td>
                      </tr>
                      {/* Add more student rows */}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colleges Tab */}
          <TabsContent value="colleges" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>College Management</CardTitle>
                <CardDescription>
                  Review, approve, and manage college registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="space-x-2">
                    <Button variant="outline">Pending Review</Button>
                    <Button variant="outline">Approved</Button>
                    <Button variant="outline">Rejected</Button>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export College Data
                  </Button>
                </div>

                <div className="space-y-4">
                  {pendingColleges.map((college) => (
                    <Card key={college.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{college.name}</h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Representative: {college.representative}</p>
                              <p>Phone: {college.phone}</p>
                              <p>Submitted: {college.submittedDate}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Review Details
                            </Button>
                            <Button variant="outline" className="text-green-600">
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button variant="outline" className="text-red-600">
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would follow similar patterns */}
          <TabsContent value="donors" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Donor Management</CardTitle>
                <CardDescription>Manage donors and their contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Donor management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Global Messaging</CardTitle>
                <CardDescription>Send messages to different user groups</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Global messaging system coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Download comprehensive reports and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reporting system coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
