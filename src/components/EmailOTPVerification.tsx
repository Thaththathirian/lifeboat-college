import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Mail, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendOTP, verifyOTP, clearRecaptcha } from "@/lib/firebase";
import { collegeApi, CollegeRegistrationData } from "@/lib/api";

// 1. Update schema to include password and confirmPassword
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type OTPFormData = z.infer<typeof otpSchema>;

interface EmailOTPVerificationProps {
  email: string;
  collegeData: CollegeRegistrationData;
  onBack: () => void;
  onSuccess: (collegeId: string, collegeInfo: any) => void;
}

export const EmailOTPVerification = ({ 
  email, 
  collegeData, 
  onBack, 
  onSuccess 
}: EmailOTPVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: ""
    },
  });

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Send initial OTP when component mounts
  useEffect(() => {
    sendInitialOTP();
  }, []);

  const sendInitialOTP = async () => {
    try {
      setIsLoading(true);
      const result = await sendOTP(email, "recaptcha-container");
      
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setCountdown(60); // 60 seconds countdown
        toast({
          title: "OTP Sent!",
          description: `A 6-digit OTP has been sent to ${email}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      const result = await sendOTP(email, "recaptcha-container");
      
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setCountdown(60); // 60 seconds countdown
        toast({
          title: "OTP Resent!",
          description: `A new 6-digit OTP has been sent to ${email}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to resend OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  // 2. OTP verification handler (step 1) - Modified to store verification token
  const handleOtpVerify = async (otp: string) => {
    if (!confirmationResult) {
      toast({
        title: "Error",
        description: "No OTP session found. Please request a new OTP.",
        variant: "destructive",
      });
      return false;
    }
    setIsLoading(true);
    try {
      const result = await verifyOTP(confirmationResult, otp);
      if (result.success) {
        setOtpVerified(true);
        // Get the Firebase ID token from the created user
        if (result.user) {
          const idToken = await result.user.getIdToken();
          setVerificationToken(idToken);
        }
        toast({
          title: "OTP Verified!",
          description: "You can now set your password.",
        });
        return true;
      } else {
        toast({
          title: "Invalid OTP",
          description: result.error || "Please check the OTP and try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Final submit handler (step 2) - Modified to use verification token
  const handleFinalSubmit = async (data: OTPFormData) => {
    try {
      setIsLoading(true);
      
      if (!verificationToken) {
        throw new Error("No verification token found. Please verify OTP again.");
      }

      // Prepare the payload with all college data and password
      const payload = {
        ...collegeData,
        password: data.password,
        confirmPassword: data.confirmPassword,
        fieldName: "college registration"
      };

      // Send to the specified endpoint with verification token
      const response = await fetch('http://localhost/lifeboat/College/verify_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${verificationToken || 'demo-token-123'}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle both response formats: {success: true} and {status: true}
      const isSuccess = result.success === true || result.status === true;
      
      if (isSuccess) {
        toast({
          title: "Registration Successful!",
          description: "Your college profile has been submitted for review.",
        });
        clearRecaptcha();
        onSuccess(result.collegeId || '', {
          collegeName: collegeData.collegeName,
          email: collegeData.email,
          phone: collegeData.phone,
          submittedAt: new Date().toISOString(),
          collegeId: result.collegeId || ''
        });
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <h1 className="text-3xl font-bold text-foreground">Email Verification</h1>
            <p className="text-muted-foreground">Verify your email to complete registration</p>
          </div>
        </div>
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Mail className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to
            </CardDescription>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <span className="font-semibold text-foreground text-lg">{email}</span>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (data) => {
                  if (!otpVerified) {
                    // Step 1: Verify OTP
                    const ok = await handleOtpVerify(data.otp);
                    if (ok) {
                      // Clear OTP error and move to password step
                      form.clearErrors('otp');
                    }
                  } else {
                    // Step 2: Submit password and registration
                    await handleFinalSubmit(data);
                  }
                })}
                className="space-y-6"
              >
                {/* OTP Step */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter OTP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter 6-digit OTP"
                            {...field}
                            maxLength={6}
                            className="text-center text-lg tracking-widest w-full"
                            disabled={otpVerified}
                          />
                        </FormControl>
                        {!otpVerified && <FormMessage />}
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button
                      type="button"
                      onClick={async () => {
                        const otp = form.getValues('otp');
                        await handleOtpVerify(otp);
                      }}
                      disabled={isLoading || otpVerified || !form.getValues('otp')}
                      className="w-full md:w-auto"
                    >
                      {otpVerified ? "Verified" : isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || isResending || otpVerified}
                      className="w-full md:w-auto"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : countdown > 0 ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Resend in {formatTime(countdown)}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend OTP
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {/* Password Step (show after OTP verified) */}
                {otpVerified && (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter new password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Re-enter password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                {/* Final submit button (only after OTP verified) */}
                {otpVerified && (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !form.formState.isValid}
                  >
                    {isLoading ? "Submitting..." : "Submit Registration"}
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
        {/* Hidden reCAPTCHA container */}
        <div id="recaptcha-container" className="hidden"></div>
      </div>
    </div>
  );
}; 