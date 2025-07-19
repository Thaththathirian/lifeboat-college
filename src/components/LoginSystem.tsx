import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  GraduationCap, 
  Building, 
  Heart, 
  Phone,
  Mail,
  User,
  Eye,
  EyeOff
} from "lucide-react";

// Phone-based login schema for students
const studentLoginSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

// Email/Phone login schema for others
const generalLoginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type StudentLoginData = z.infer<typeof studentLoginSchema>;
type GeneralLoginData = z.infer<typeof generalLoginSchema>;

interface LoginSystemProps {
  onLogin: (userType: string, credentials: any) => void;
}

export const LoginSystem = ({ onLogin }: LoginSystemProps) => {
  const [activeTab, setActiveTab] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const studentForm = useForm<StudentLoginData>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: {
      phone: "",
    },
  });

  const adminForm = useForm<GeneralLoginData>({
    resolver: zodResolver(generalLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const collegeForm = useForm<GeneralLoginData>({
    resolver: zodResolver(generalLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const donorForm = useForm<GeneralLoginData>({
    resolver: zodResolver(generalLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleStudentLogin = async (data: StudentLoginData) => {
    try {
      // Student login only requires phone number initially
      toast({
        title: "Login Successful",
        description: "Welcome! You can now apply for scholarships.",
      });
      onLogin("student", data);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your phone number and try again.",
        variant: "destructive",
      });
    }
  };

  const handleGeneralLogin = async (data: GeneralLoginData, userType: string) => {
    try {
      toast({
        title: "Login Successful",
        description: `Welcome to the ${userType} portal!`,
      });
      onLogin(userType, data);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const userTypes = [
    {
      id: "student",
      title: "Student",
      icon: GraduationCap,
      description: "Apply for scholarships and track your progress",
      color: "bg-blue-500",
    },
    {
      id: "college",
      title: "College",
      icon: Building,
      description: "Manage students and scholarship programs",
      color: "bg-green-500",
    },
    {
      id: "donor",
      title: "Donor",
      icon: Heart,
      description: "Support students through donations",
      color: "bg-purple-500",
    },
    {
      id: "admin",
      title: "Admin",
      icon: Shield,
      description: "Manage the entire scholarship ecosystem",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Scholarship Portal Login
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your role to access the appropriate portal
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {userTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-2 ${
                  activeTab === type.id ? 'ring-2 ring-primary shadow-elegant' : ''
                }`}
                onClick={() => setActiveTab(type.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Login Forms */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              {React.createElement(
                userTypes.find(t => t.id === activeTab)?.icon || User, 
                { className: "h-6 w-6 mr-2" }
              )}
              {userTypes.find(t => t.id === activeTab)?.title} Login
            </CardTitle>
            <CardDescription>
              {activeTab === "student" 
                ? "Enter your phone number to login or register"
                : "Enter your credentials to access your account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === "student" && (
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(handleStudentLogin)} className="space-y-6">
                  <FormField
                    control={studentForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="+91 XXXXXXXXXX" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          New to the platform? You'll be automatically registered upon first login.
                        </p>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="hero" className="w-full">
                    Login / Register
                  </Button>
                </form>
              </Form>
            )}

            {activeTab === "admin" && (
              <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit((data) => handleGeneralLogin(data, "admin"))} className="space-y-6">
                  <FormField
                    control={adminForm.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email or Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="admin@example.com or phone" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password" 
                              className="pr-10"
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <Button type="submit" variant="hero" className="w-full">
                      Admin Login
                    </Button>
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin Access Required
                      </Badge>
                    </div>
                  </div>
                </form>
              </Form>
            )}

            {activeTab === "college" && (
              <Form {...collegeForm}>
                <form onSubmit={collegeForm.handleSubmit((data) => handleGeneralLogin(data, "college"))} className="space-y-6">
                  <FormField
                    control={collegeForm.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="+91 XXXXXXXXXX" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={collegeForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password" 
                              className="pr-10"
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="hero" className="w-full">
                    College Login
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Don't have an account? <button className="text-primary hover:underline">Register your college</button>
                  </p>
                </form>
              </Form>
            )}

            {activeTab === "donor" && (
              <Form {...donorForm}>
                <form onSubmit={donorForm.handleSubmit((data) => handleGeneralLogin(data, "donor"))} className="space-y-6">
                  <FormField
                    control={donorForm.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email or Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="donor@example.com or phone" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={donorForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password" 
                              className="pr-10"
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="hero" className="w-full">
                    Donor Login
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Want to support students? <button className="text-primary hover:underline">Become a donor</button>
                  </p>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Need help accessing your account?
          </p>
          <div className="space-x-4">
            <Button variant="outline">Contact Support</Button>
            <Button variant="outline">Forgot Password</Button>
          </div>
        </div>
      </div>
    </div>
  );
};