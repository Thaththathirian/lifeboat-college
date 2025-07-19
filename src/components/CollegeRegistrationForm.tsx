import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Upload, Building, CreditCard, GraduationCap, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const collegeFormSchema = z.object({
  // Section 1: College Information (Required fields only)
  collegeName: z.string().min(2, "College name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(10, "Complete address is required"),
  establishedYear: z.string().min(4, "Established year is required"),
  representativeName: z.string().min(2, "Management representative name is required"),
  representativePhone: z.string().min(10, "Representative phone is required"),
  representativeEmail: z.string().email("Representative email is required"),
  
  // Section 2: Academic & Financial Details (Required fields only)
  coordinatorName: z.string().min(2, "Coordinator name is required"),
  coordinatorPhone: z.string().min(10, "Coordinator phone is required"),
  coordinatorEmail: z.string().email("Coordinator email is required"),
  coordinatorDesignation: z.string().min(2, "Coordinator designation is required"),
  feeConcession: z.string().min(10, "Fee concession details are required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(8, "Account number is required"),
  confirmAccountNumber: z.string().min(8, "Please confirm account number"),
  ifscCode: z.string().min(11, "IFSC code must be 11 characters").max(11, "IFSC code must be 11 characters"),
  
  // Optional fields for better profiling
  departments: z.string().optional(),
  totalStudents: z.string().optional(),
  batchesPassedOut: z.string().optional(),
  passPercentage: z.string().optional(),
  infrastructureDetails: z.string().optional(),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

type CollegeFormData = z.infer<typeof collegeFormSchema>;

interface CollegeRegistrationFormProps {
  onBack: () => void;
}

export const CollegeRegistrationForm = ({ onBack }: CollegeRegistrationFormProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const { toast } = useToast();
  
  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeFormSchema),
    defaultValues: {
      collegeName: "",
      establishedYear: "",
      address: "",
      email: "",
      phone: "",
      representativeName: "",
      representativePhone: "",
      representativeEmail: "",
      departments: "",
      totalStudents: "",
      batchesPassedOut: "",
      passPercentage: "",
      infrastructureDetails: "",
      feeConcession: "",
      coordinatorName: "",
      coordinatorPhone: "",
      coordinatorEmail: "",
      coordinatorDesignation: "",
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
    },
  });

  const sections = [
    { title: "College Information", icon: Building },
    { title: "Academic & Financial Details", icon: CreditCard },
  ];

  const onSubmit = async (data: CollegeFormData) => {
    try {
      console.log("College Registration Data:", data);
      toast({
        title: "Registration Submitted!",
        description: "Your college profile has been submitted for review. You will receive an email confirmation shortly.",
      });
      // Here you would typically send the data to your backend
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">College Registration</h1>
            <p className="text-muted-foreground">Complete your profile to join our partner network</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    index <= currentSection ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs mt-2 text-center max-w-20">{section.title}</span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {React.createElement(sections[currentSection].icon, { className: "h-6 w-6 mr-2" })}
                  {sections[currentSection].title}
                </CardTitle>
                <CardDescription>
                  Step {currentSection + 1} of {sections.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Section 1: College Information */}
                {currentSection === 0 && (
                  <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                    <FormField
                      control={form.control}
                      name="collegeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College/School Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter college name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="establishedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Established Year *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1995" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Complete address with city and state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="college@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 XXXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="representativeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Management Representative Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter representative name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="representativePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Representative Phone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 XXXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="representativeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Representative Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="representative@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Optional Academic Fields */}
                    <div className="md:col-span-2 mt-6">
                      <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Academic Information (Optional)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="departments"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Departments</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 15" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="totalStudents"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Number of Students</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 2500" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="batchesPassedOut"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Batches Passed Out</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 25" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="passPercentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pass Percentage</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 95%" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: Academic & Financial Details */}
                {currentSection === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="coordinatorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coordinator Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter coordinator name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="coordinatorDesignation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coordinator Designation *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Professor, Dean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="coordinatorPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coordinator Phone *</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 XXXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="coordinatorEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coordinator Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="coordinator@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="feeConcession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fee Concession (Mandatory) *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the fee concession your college will provide to scholarship students" 
                              className="min-h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="infrastructureDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Infrastructure Facilities (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your labs, placement training facilities, library, hostels, etc." 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bank Details */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="bankName"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Bank Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter bank name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="confirmAccountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Account Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Re-enter account number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ifscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IFSC Code *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., SBIN0001234" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-2">Upload Infrastructure Photos (Optional)</p>
                        <p className="text-sm text-muted-foreground">Labs, placement training facilities, campus images</p>
                        <Button variant="outline" className="mt-3">
                          Choose Files
                        </Button>
                      </div>
                      
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-2">Upload Cancelled Cheque *</p>
                        <p className="text-sm text-muted-foreground">Required for bank verification</p>
                        <Button variant="outline" className="mt-3">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevSection}
                    disabled={currentSection === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentSection === sections.length - 1 ? (
                    <Button type="submit" variant="hero">
                      Submit Registration
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={nextSection}
                      variant="default"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};