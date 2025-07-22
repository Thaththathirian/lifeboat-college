import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CollegeRegistrationData } from "@/lib/api";

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface CollegePasswordSetupProps {
  collegeData: CollegeRegistrationData;
  uploadedFiles: { infraFiles: File[], chequeFile: File | null };
  onBack: () => void;
  onSuccess: (collegeId: string) => void;
}

export const CollegePasswordSetup = ({ 
  collegeData, 
  uploadedFiles,
  onBack, 
  onSuccess 
}: CollegePasswordSetupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  });

  // Password validation helpers
  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');
  
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password === confirmPassword && confirmPassword.length > 0
  };

  const getRequirementColor = (met: boolean) => met ? "text-green-600" : "text-gray-400";
  const getRequirementIcon = (met: boolean) => met ? "✓" : "○";

  const validatePassword = () => {
    const errors: {[key: string]: string} = {};
    
    if (!passwordRequirements.length) {
      errors.password = "Password must be at least 8 characters";
    } else if (!passwordRequirements.uppercase) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!passwordRequirements.lowercase) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!passwordRequirements.number) {
      errors.password = "Password must contain at least one number";
    } else if (!passwordRequirements.special) {
      errors.password = "Password must contain at least one special character";
    }
    
    if (confirmPassword && !passwordRequirements.match) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (data: PasswordFormData) => {
    if (!validatePassword()) {
      toast({
        title: "Validation Error",
        description: "Please fix the password requirements before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create FormData to include files
      const formData = new FormData();
      
      // Add all college registration form data
      formData.append('collegeName', collegeData.collegeName);
      formData.append('phone', collegeData.phone);
      formData.append('email', collegeData.email);
      formData.append('address', collegeData.address);
      formData.append('establishedYear', collegeData.establishedYear);
      formData.append('representativeName', collegeData.representativeName);
      formData.append('representativePhone', collegeData.representativePhone);
      formData.append('representativeEmail', collegeData.representativeEmail);
      if (collegeData.collegeWebsite) {
        formData.append('collegeWebsite', collegeData.collegeWebsite);
      }
      formData.append('coordinatorName', collegeData.coordinatorName);
      formData.append('coordinatorPhone', collegeData.coordinatorPhone);
      formData.append('coordinatorEmail', collegeData.coordinatorEmail);
      formData.append('coordinatorDesignation', collegeData.coordinatorDesignation);
      formData.append('feeConcession', collegeData.feeConcession);
      formData.append('bankName', collegeData.bankName);
      formData.append('accountNumber', collegeData.accountNumber);
      formData.append('confirmAccountNumber', collegeData.confirmAccountNumber);
      formData.append('ifscCode', collegeData.ifscCode);
      if (collegeData.departments) {
        formData.append('departments', collegeData.departments);
      }
      if (collegeData.totalStudents) {
        formData.append('totalStudents', collegeData.totalStudents);
      }
      if (collegeData.batchesPassedOut) {
        formData.append('batchesPassedOut', collegeData.batchesPassedOut);
      }
      if (collegeData.passPercentage) {
        formData.append('passPercentage', collegeData.passPercentage);
      }
      if (collegeData.infrastructureDetails) {
        formData.append('infrastructureDetails', collegeData.infrastructureDetails);
      }
      
      // Add password data
      formData.append('confirmPassword', data.confirmPassword);
      
      // Add infrastructure files
      uploadedFiles.infraFiles.forEach((file, index) => {
        formData.append(`infrastructureFiles`, file);
      });
      
      // Add cancelled cheque file
      if (uploadedFiles.chequeFile) {
        formData.append('cancelledCheque', uploadedFiles.chequeFile);
      }

      console.log("Sending all form data with files:", {
        formData: Object.fromEntries(formData.entries()),
        infraFilesCount: uploadedFiles.infraFiles.length,
        hasChequeFile: !!uploadedFiles.chequeFile
      });

      // Send all form data and files to the specified endpoint
      const response = await fetch('http://localhost/lifeboat/College/verify_email', {
        method: 'POST',
        body: formData, // Use FormData instead of JSON
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Registration Successful!",
          description: "Your college profile has been submitted for review.",
        });
        onSuccess(result.collegeId || '');
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Set Your Password</h1>
            <p className="text-muted-foreground">Create a secure password for your college account</p>
          </div>
        </div>
        
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Lock className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Your Password</CardTitle>
            <CardDescription>
              Set a strong password to secure your college account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            {...field}
                            className={`pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                            onPaste={(e) => e.stopPropagation()}
                            onCopy={(e) => e.stopPropagation()}
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
                      <div className="text-xs text-muted-foreground">
                        Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                      </div>
                      {validationErrors.password && (
                        <div className="text-xs text-red-500 mt-1">
                          {validationErrors.password}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter password"
                            {...field}
                            className={`pr-10 ${validationErrors.confirmPassword || (!passwordRequirements.match && confirmPassword) ? 'border-red-500' : ''}`}
                            onPaste={(e) => e.stopPropagation()}
                            onCopy={(e) => e.stopPropagation()}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {validationErrors.confirmPassword && (
                        <div className="text-xs text-red-500 mt-1">
                          {validationErrors.confirmPassword}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Complete Registration"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 