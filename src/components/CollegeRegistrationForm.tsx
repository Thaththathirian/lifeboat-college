import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Upload, Building, CreditCard, GraduationCap, User, CheckCircle, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collegeApi, CollegeRegistrationData } from "@/lib/api";

const collegeFormSchema = z.object({
  // Section 1: College Information (Required fields only)
  collegeName: z.string().min(2, "College name is required"),
  phone: z.string()
    .min(1, "Phone number is required")
    .min(10, "The Mobile field must be at least 10 characters in length.")
    .regex(/^[\d\s\-\(\)\+]+$/, "Please enter a valid phone number (numbers, spaces, hyphens, parentheses, and + only)"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(10, "Complete address is required"),
  establishedYear: z.string()
    .min(1, "Established year is required")
    .regex(/^\d+$/, "The Established Year field must contain only numbers."),
  representativeName: z.string().min(2, "Management representative name is required"),
  representativePhone: z.string()
    .min(1, "Representative phone is required")
    .min(10, "The Representative Mobile field must be at least 10 characters in length.")
    .regex(/^[\d\s\-\(\)\+]+$/, "Please enter a valid phone number (numbers, spaces, hyphens, parentheses, and + only)"),
  representativeEmail: z.string().email("Representative email is required"),
  
  // Section 2: Academic & Financial Details (Required fields only)
  coordinatorName: z.string().min(2, "Coordinator name is required"),
  coordinatorPhone: z.string()
    .min(1, "Coordinator phone is required")
    .min(10, "The Coordinator Phone field must be at least 10 characters in length.")
    .regex(/^[\d\s\-\(\)\+]+$/, "Please enter a valid phone number (numbers, spaces, hyphens, parentheses, and + only)"),
  coordinatorEmail: z.string().email("Coordinator email is required"),
  coordinatorDesignation: z.string().min(2, "Coordinator designation is required"),
  feeConcession: z.string().min(10, "Fee concession details are required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string()
    .min(8, "Account number is required")
    .regex(/^\d+$/, "The Account Number field must contain only numbers."),
  confirmAccountNumber: z.string().min(8, "Please confirm account number"),
  ifscCode: z.string()
    .min(11, "IFSC code must be 11 characters")
    .max(11, "IFSC code must be 11 characters")
    .regex(/^[A-Z0-9]{11}$/, "Invalid IFSC Code format."),
  
  // Additional fields for better profiling
  collegeWebsite: z.string().optional(),
  departments: z.string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Number of departments must contain only numbers."
    }),
  totalStudents: z.string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Total students must contain only numbers."
    }),
  batchesPassedOut: z.string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Number of batches must contain only numbers."
    }),
  passPercentage: z.string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "The Pass % field must contain only numbers."
    }),
  infrastructureDetails: z.string().optional(),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

type CollegeFormData = z.infer<typeof collegeFormSchema>;

interface CollegeRegistrationFormProps {
  onBack: () => void;
  onRegistrationSuccess?: (collegeId: string) => void;
  onProceedToPassword?: (email: string, data: CollegeFormData, files: { infraFiles: File[], chequeFile: File | null }) => void;
  initialData?: CollegeFormData;
  initialFiles?: { infraFiles: File[], chequeFile: File | null };
  initialSection?: number;
  onSectionChange?: (section: number) => void;
}

export const CollegeRegistrationForm = ({ onBack, onRegistrationSuccess, onProceedToPassword, initialData, initialFiles, initialSection, onSectionChange }: CollegeRegistrationFormProps) => {
  const [currentSection, setCurrentSection] = useState(initialSection || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // File upload state - initialize with initial files if provided
  const [infraFiles, setInfraFiles] = useState<File[]>(initialFiles?.infraFiles || []);
  const [infraError, setInfraError] = useState<string>("");
  const [chequeFile, setChequeFile] = useState<File | null>(initialFiles?.chequeFile || null);
  const [chequeError, setChequeError] = useState<string>("");

  // Field-specific error state for backend validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // File validation helpers
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleInfraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfraError("");
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const tooBig = newFiles.find(f => f.size > MAX_FILE_SIZE);
      if (tooBig) {
        setInfraError("Each file must be 2MB or less.");
      } else {
        // Merge new files with existing files, avoiding duplicates
        const existingFileNames = infraFiles.map(f => f.name);
        const uniqueNewFiles = newFiles.filter(file => !existingFileNames.includes(file.name));
        setInfraFiles([...infraFiles, ...uniqueNewFiles]);
      }
    }
  };

  const handleChequeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChequeError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setChequeFile(null);
        setChequeError("File must be 2MB or less.");
      } else {
        setChequeFile(file);
      }
    }
  };

  const removeInfraFile = (fileName: string) => {
    setInfraFiles(infraFiles.filter(f => f.name !== fileName));
    setInfraError("");
  };

  const removeChequeFile = () => {
    setChequeFile(null);
    setChequeError("");
  };

  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeFormSchema),
    mode: "onSubmit", // Validate on submit to ensure all validations run
    defaultValues: initialData || {
      collegeName: "",
      establishedYear: "",
      address: "",
      email: "",
      phone: "",
      representativeName: "",
      representativePhone: "",
      representativeEmail: "",
      collegeWebsite: "",
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

  // Helper: List of required fields for each section
  const sectionRequiredFields = [
    [ // Section 1
      'collegeName', 'establishedYear', 'address', 'email', 'phone',
      'representativeName', 'representativePhone', 'representativeEmail'
    ],
    [ // Section 2
      'coordinatorName', 'coordinatorPhone', 'coordinatorEmail', 'coordinatorDesignation',
      'feeConcession', 'bankName', 'accountNumber', 'confirmAccountNumber', 'ifscCode'
    ]
  ];

  // On submit, validate all required fields
  const onSubmit = async (data: CollegeFormData) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form submission started");
    console.log("Form data:", data);
    console.log("Cheque file:", chequeFile);
    console.log("onProceedToPassword callback:", !!onProceedToPassword);
    console.log("Current section:", currentSection);
    console.log("Is submitting:", isSubmitting);
    
    // Clear any previous field errors
    setFieldErrors({});
    setChequeError("");
    
    // Check if cheque file is uploaded
    if (!chequeFile) {
      setChequeError("Cancelled cheque file is required.");
      toast({
        title: "Missing Required File",
        description: "Please upload a cancelled cheque file.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate all required fields
    const allRequired = [...sectionRequiredFields[0], ...sectionRequiredFields[1]];
    console.log("Validating fields:", allRequired);
    const valid = await form.trigger(allRequired as any, { shouldFocus: false });
    console.log("Form validation result:", valid);
    
    // If validation fails, show errors and focus on first error
    if (!valid) {
      console.log("Validation failed");
      console.log("Form errors:", form.formState.errors);
      
      // Find the first field with an error to focus on
      let firstErrorField: string | null = null;
      
      // Check form validation errors first
      for (const field of allRequired) {
        const fieldError = form.formState.errors[field as keyof CollegeFormData];
        if (fieldError) {
          firstErrorField = field;
          console.log("First error field:", field, fieldError);
          break;
        }
      }
      
      // Focus on the first field with error
      if (firstErrorField) {
        setTimeout(() => {
          const errorInput = document.querySelector(`input[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`) as HTMLElement;
          if (errorInput) {
            errorInput.focus();
            errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
      
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted validation errors.",
        variant: "destructive",
      });
      
      return; // Don't proceed with submission if validation fails
    }
    
    // All validation passed, proceed to password setup
    try {
      setIsSubmitting(true);
      console.log("Starting submission process - all validation passed");
      
      // Add fieldName automatically to the submission data
      const submissionData = {
        ...data,
        fieldName: "college registration"
      } as CollegeRegistrationData;
      
      console.log("College Registration Data:", submissionData);
      console.log("Cheque file:", chequeFile?.name);
      
      // Proceed to password setup
      if (onProceedToPassword) {
        console.log("Calling onProceedToPassword with email:", data.email);
        onProceedToPassword(data.email, submissionData, { infraFiles, chequeFile });
      } else {
        console.log("No password callback provided, using fallback...");
        // Fallback to direct submission if password setup is not enabled
        const response = await collegeApi.submitRegistrationWithDemoToken(submissionData);
        
        if (response.success) {
          toast({
            title: "Registration Submitted!",
            description: "Your college profile has been submitted for review. You will receive an email confirmation shortly.",
          });
          
          // Navigate to dashboard if callback provided
          if (onRegistrationSuccess && response.collegeId) {
            onRegistrationSuccess(response.collegeId);
          }
        } else {
          // Handle backend validation errors
          if (response.message && typeof response.message === 'object') {
            // This is the error response format with field-specific errors
            setFieldErrors(response.message as Record<string, string>);
            
            // Show a general error toast
            toast({
              title: "Validation Error",
              description: "Please fix the highlighted fields below.",
              variant: "destructive",
            });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle error response format
      if (error instanceof Error && error.message.includes('HTTP error')) {
        try {
          // Try to parse the error response
          const errorResponse = JSON.parse(error.message.split('body: ')[1] || '{}');
          if (errorResponse.message && typeof errorResponse.message === 'object') {
            setFieldErrors(errorResponse.message as Record<string, string>);
            toast({
              title: "Validation Error",
              description: "Please fix the highlighted fields below.",
              variant: "destructive",
            });
            return;
          }
        } catch (parseError) {
          // If parsing fails, show generic error
        }
      }
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log("Form submission completed");
    }
  };

  // On navigation, validate current section
  const nextSection = async () => {
    if (currentSection < sections.length - 1) {
      const required = sectionRequiredFields[currentSection];
      const valid = await form.trigger(required as any, { shouldFocus: true });
      if (!valid) {
        required.forEach(field => {
          const value = form.getValues(field as keyof CollegeFormData);
          if (!value || value.trim() === "") {
            form.setError(field as keyof CollegeFormData, { type: 'manual', message: '' });
          }
        });
        return;
      }
      form.clearErrors();
      setCurrentSection(currentSection + 1);
      onSectionChange?.(currentSection + 1);
    }
  };
  const prevSection = () => {
    if (currentSection > 0) {
      form.clearErrors();
      setCurrentSection(currentSection - 1);
      onSectionChange?.(currentSection - 1);
    }
  };

  // Clear errors when section changes to provide clean state
  useEffect(() => {
    form.clearErrors();
  }, [currentSection, form]);

  // Helper function to get field completion status
  const getFieldStatus = (fieldName: keyof CollegeFormData) => {
    const value = form.getValues(fieldName);
    return value && value.trim().length > 0;
  };

  // Check if all required fields are filled
  const areAllRequiredFieldsFilled = () => {
    const requiredFields = [
      'collegeName', 'establishedYear', 'address', 'email', 'phone',
      'representativeName', 'representativePhone', 'representativeEmail',
      'coordinatorName', 'coordinatorPhone', 'coordinatorEmail', 'coordinatorDesignation',
      'feeConcession', 'bankName', 'accountNumber', 'confirmAccountNumber', 'ifscCode'
    ];
    
    const missingFields = requiredFields.filter(field => !getFieldStatus(field as keyof CollegeFormData));
    
    // Debug: Log missing fields
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
    }
    if (!chequeFile) {
      console.log('Missing cancelled cheque file');
    }
    
    return requiredFields.every(field => getFieldStatus(field as keyof CollegeFormData)) && chequeFile;
  };

  // Helper function to get field error from backend
  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName];
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors[fieldName];
  };

  // Function to restrict phone input to numbers and allowed characters
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits, spaces, hyphens, parentheses, and plus sign
    const phoneRegex = /^[\d\s\-\(\)\+]*$/;
    if (phoneRegex.test(value) || value === '') {
      e.target.value = value;
    } else {
      e.preventDefault();
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

        {/* Section Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentSection > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={prevSection}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← {sections[currentSection - 1].title}
                </Button>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {sections[currentSection].title}
              </h2>
              <p className="text-muted-foreground">
                Step {currentSection + 1} of {sections.length}
              </p>

            </div>
            <div className="flex items-center space-x-4">
              {currentSection < sections.length - 1 && (
                <Button 
                  variant="ghost" 
                  onClick={nextSection}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {sections[currentSection + 1].title} →
                </Button>
              )}
            </div>
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
                          <FormLabel>
                            College/School Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter college name" 
                              {...field} 
                              name="collegeName"
                              className={`${(form.formState.errors.collegeName && (form.formState.touchedFields.collegeName || form.formState.isSubmitted)) || hasFieldError('collegeName') ? 'border-red-500' : ''}`}
                              onChange={e => { field.onChange(e); form.clearErrors('collegeName'); setFieldErrors(prev => ({ ...prev, collegeName: undefined })); }}
                            />
                          </FormControl>
                          {(form.formState.errors.collegeName?.message && (form.getValues('collegeName') !== '' || form.formState.isSubmitted)) || getFieldError('collegeName') ? (
                            <FormMessage>
                              {getFieldError('collegeName') || form.formState.errors.collegeName?.message}
                            </FormMessage>
                          ) : null}
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="establishedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Established Year <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 1995"
                              {...field}
                              name="establishedYear"
                              onKeyDown={(e) => {
                                // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                    // Allow: digits only
                                    /[\d]/.test(e.key)) {
                                  return;
                                }
                                e.preventDefault();
                              }}
                              className={`${(form.formState.errors.establishedYear && (form.formState.touchedFields.establishedYear || form.formState.isSubmitted)) || hasFieldError('establishedYear') ? 'border-red-500' : ''}`}
                              onChange={e => { field.onChange(e); form.clearErrors('establishedYear'); setFieldErrors(prev => ({ ...prev, establishedYear: undefined })); }}
                            />
                          </FormControl>
                          {(form.formState.errors.establishedYear?.message && (form.getValues('establishedYear') !== '' || form.formState.isSubmitted)) || getFieldError('establishedYear') ? (
                            <FormMessage>
                              {getFieldError('establishedYear') || form.formState.errors.establishedYear?.message}
                            </FormMessage>
                          ) : null}
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Complete address with city and state"
                              {...field}
                              name="address"
                              className={`${form.formState.errors.address && (form.formState.touchedFields.address || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                              onChange={e => { field.onChange(e); form.clearErrors('address'); }}
                            />
                          </FormControl>
                          {form.formState.errors.address?.message && (form.getValues('address') !== '' || form.formState.isSubmitted) && (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="college@example.com"
                              {...field}
                              name="email"
                              className={`${form.formState.errors.email && (form.formState.touchedFields.email || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                              onChange={e => { field.onChange(e); form.clearErrors('email'); }}
                            />
                          </FormControl>
                          {form.formState.errors.email?.message && (form.getValues('email') !== '' || form.formState.isSubmitted) && (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Phone Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+91 XXXXXXXXXX" 
                              {...field}
                              name="phone"
                              onKeyDown={(e) => {
                                // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                    // Allow: digits, spaces, hyphens, parentheses, plus
                                    /[\d\s\-\(\)\+]/.test(e.key)) {
                                  return;
                                }
                                e.preventDefault();
                              }}
                              onChange={e => { field.onChange(e); form.clearErrors('phone'); }}
                              className={`${form.formState.errors.phone && (form.getValues('phone') === '' || form.formState.isSubmitted) && (form.formState.touchedFields.phone || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                            />
                          </FormControl>
                          {form.formState.errors.phone && (form.getValues('phone') === '' || form.formState.isSubmitted) && (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="representativeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Management Representative Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter representative name"
                              {...field}
                              name="representativeName"
                              className={`${form.formState.errors.representativeName && (form.formState.touchedFields.representativeName || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                              onChange={e => { field.onChange(e); form.clearErrors('representativeName'); }}
                            />
                          </FormControl>
                          {form.formState.errors.representativeName?.message && (form.getValues('representativeName') !== '' || form.formState.isSubmitted) && (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />
                    
                                          <FormField
                        control={form.control}
                        name="representativePhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Representative Phone <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+91 XXXXXXXXXX" 
                                {...field}
                                name="representativePhone"
                                onKeyDown={(e) => {
                                  // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                  if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                      // Allow: digits, spaces, hyphens, parentheses, plus
                                      /[\d\s\-\(\)\+]/.test(e.key)) {
                                    return;
                                  }
                                  e.preventDefault();
                                }}
                                onChange={e => { field.onChange(e); form.clearErrors('representativePhone'); }}
                                className={`${form.formState.errors.representativePhone && (form.getValues('representativePhone') === '' || form.formState.isSubmitted) && (form.formState.touchedFields.representativePhone || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                              />
                            </FormControl>
                            {form.formState.errors.representativePhone && (form.getValues('representativePhone') === '' || form.formState.isSubmitted) && (
                              <FormMessage />
                            )}
                          </FormItem>
                        )}
                      />
                    
                    <FormField
                      control={form.control}
                      name="representativeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Representative Email <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="representative@example.com"
                              {...field}
                              name="representativeEmail"
                              className={`${form.formState.errors.representativeEmail && (form.formState.touchedFields.representativeEmail || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                              onChange={e => { field.onChange(e); form.clearErrors('representativeEmail'); }}
                            />
                          </FormControl>
                          {form.formState.errors.representativeEmail?.message && (form.getValues('representativeEmail') !== '' || form.formState.isSubmitted) && (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="collegeWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College Website</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://www.college.edu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Additional Academic Fields */}
                    <div className="md:col-span-2 mt-6">
                      <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Academic Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="departments"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Departments</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., 15" 
                                  {...field} 
                                  name="departments"
                                  onKeyDown={(e) => {
                                    // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                        // Allow: digits only
                                        /[\d]/.test(e.key)) {
                                      return;
                                    }
                                    e.preventDefault();
                                  }}
                                />
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
                                <Input 
                                  placeholder="e.g., 2500" 
                                  {...field} 
                                  name="totalStudents"
                                  onKeyDown={(e) => {
                                    // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                        // Allow: digits only
                                        /[\d]/.test(e.key)) {
                                      return;
                                    }
                                    e.preventDefault();
                                  }}
                                />
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
                                <Input 
                                  placeholder="e.g., 25" 
                                  {...field} 
                                  name="batchesPassedOut"
                                  onKeyDown={(e) => {
                                    // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                        // Allow: digits only
                                        /[\d]/.test(e.key)) {
                                      return;
                                    }
                                    e.preventDefault();
                                  }}
                                />
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
                                <Input 
                                  placeholder="e.g., 95%" 
                                  {...field} 
                                  name="passPercentage"
                                  onKeyDown={(e) => {
                                    // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                        // Allow: digits only
                                        /[\d]/.test(e.key)) {
                                      return;
                                    }
                                    e.preventDefault();
                                  }}
                                  className={`${hasFieldError('passPercentage') ? 'border-red-500' : ''}`}
                                  onChange={e => { field.onChange(e); setFieldErrors(prev => ({ ...prev, passPercentage: undefined })); }}
                                />
                              </FormControl>
                              {getFieldError('passPercentage') ? (
                                <FormMessage>
                                  {getFieldError('passPercentage')}
                                </FormMessage>
                              ) : null}
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
                            <FormLabel>
                              Coordinator Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter coordinator name"
                                {...field}
                                name="coordinatorName"
                                className={`${form.formState.errors.coordinatorName && (form.formState.touchedFields.coordinatorName || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                                onChange={e => { field.onChange(e); form.clearErrors('coordinatorName'); }}
                              />
                            </FormControl>
                            {form.formState.errors.coordinatorName?.message && (form.getValues('coordinatorName') !== '' || form.formState.isSubmitted) && (
                              <FormMessage />
                            )}
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="coordinatorDesignation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Coordinator Designation <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Professor, Dean"
                                {...field}
                                name="coordinatorDesignation"
                                className={`${form.formState.errors.coordinatorDesignation && (form.formState.touchedFields.coordinatorDesignation || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                                onChange={e => { field.onChange(e); form.clearErrors('coordinatorDesignation'); }}
                              />
                            </FormControl>
                            {form.formState.errors.coordinatorDesignation?.message && (form.getValues('coordinatorDesignation') !== '' || form.formState.isSubmitted) && (
                              <FormMessage />
                            )}
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="coordinatorPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Coordinator Phone <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+91 XXXXXXXXXX" 
                                {...field}
                                name="coordinatorPhone"
                                onKeyDown={(e) => {
                                  // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                  if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                      // Allow: digits, spaces, hyphens, parentheses, plus
                                      /[\d\s\-\(\)\+]/.test(e.key)) {
                                    return;
                                  }
                                  e.preventDefault();
                                }}
                                onChange={e => { field.onChange(e); form.clearErrors('coordinatorPhone'); }}
                                className={`${form.formState.errors.coordinatorPhone && (form.getValues('coordinatorPhone') === '' || form.formState.isSubmitted) && (form.formState.touchedFields.coordinatorPhone || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                              />
                            </FormControl>
                            {form.formState.errors.coordinatorPhone && (form.getValues('coordinatorPhone') === '' || form.formState.isSubmitted) && (
                              <FormMessage />
                            )}
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="coordinatorEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Coordinator Email <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="coordinator@example.com"
                                {...field}
                                name="coordinatorEmail"
                                className={`${form.formState.errors.coordinatorEmail && (form.formState.touchedFields.coordinatorEmail || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                                onChange={e => { field.onChange(e); form.clearErrors('coordinatorEmail'); }}
                              />
                            </FormControl>
                            {form.formState.errors.coordinatorEmail?.message && (form.getValues('coordinatorEmail') !== '' || form.formState.isSubmitted) && (
                              <FormMessage />
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="feeConcession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Fee Concession <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the fee concession your college will provide to scholarship students" 
                              className={`min-h-24 ${form.formState.errors.feeConcession && (form.formState.touchedFields.feeConcession || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                              {...field} 
                              name="feeConcession"
                              onChange={e => { field.onChange(e); form.clearErrors('feeConcession'); }}
                            />
                          </FormControl>
                          {form.formState.errors.feeConcession?.message && (form.getValues('feeConcession') !== '' || form.formState.isSubmitted) && (
                            <FormMessage />
                          )}
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
                              name="infrastructureDetails"
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
                              <FormLabel>
                                Bank Name <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter bank name"
                                  {...field}
                                  name="bankName"
                                  className={`${form.formState.errors.bankName && (form.formState.touchedFields.bankName || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                                  onChange={e => { field.onChange(e); form.clearErrors('bankName'); }}
                                />
                              </FormControl>
                              {form.formState.errors.bankName?.message && (form.getValues('bankName') !== '' || form.formState.isSubmitted) && (
                                <FormMessage />
                              )}
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Account Number <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter account number"
                                  {...field}
                                  name="accountNumber"
                                  onKeyDown={(e) => {
                                    // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                        // Allow: digits only
                                        /[\d]/.test(e.key)) {
                                      return;
                                    }
                                    e.preventDefault();
                                  }}
                                  className={`${(form.formState.errors.accountNumber && (form.formState.touchedFields.accountNumber || form.formState.isSubmitted)) || hasFieldError('accountNumber') ? 'border-red-500' : ''}`}
                                  onChange={e => { field.onChange(e); form.clearErrors('accountNumber'); setFieldErrors(prev => ({ ...prev, accountNumber: undefined })); }}
                                />
                              </FormControl>
                              {(form.formState.errors.accountNumber?.message && (form.getValues('accountNumber') !== '' || form.formState.isSubmitted)) || getFieldError('accountNumber') ? (
                                <FormMessage>
                                  {getFieldError('accountNumber') || form.formState.errors.accountNumber?.message}
                                </FormMessage>
                              ) : null}
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="confirmAccountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Confirm Account Number <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Re-enter account number"
                                  {...field}
                                  name="confirmAccountNumber"
                                  onKeyDown={(e) => {
                                    // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                        // Allow: digits only
                                        /[\d]/.test(e.key)) {
                                      return;
                                    }
                                    e.preventDefault();
                                  }}
                                  className={`${form.formState.errors.confirmAccountNumber && (form.formState.touchedFields.confirmAccountNumber || form.formState.isSubmitted) ? 'border-red-500' : ''}`}
                                  onChange={e => { field.onChange(e); form.clearErrors('confirmAccountNumber'); }}
                                />
                              </FormControl>
                              {form.formState.errors.confirmAccountNumber?.message && (form.getValues('confirmAccountNumber') !== '' || form.formState.isSubmitted) && (
                                <FormMessage />
                              )}
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ifscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                IFSC Code <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., SBIN0001234"
                                  {...field}
                                  name="ifscCode"
                                  onKeyDown={(e) => {
                                    // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode)) {
                                      return;
                                    }
                                    // Allow: letters and digits for IFSC code
                                    if (/[A-Za-z0-9]/.test(e.key)) {
                                      return;
                                    }
                                    e.preventDefault();
                                  }}
                                  onChange={e => { 
                                    // Convert to uppercase for IFSC format
                                    const value = e.target.value.toUpperCase();
                                    field.onChange(value); 
                                    form.clearErrors('ifscCode'); 
                                    setFieldErrors(prev => ({ ...prev, ifscCode: undefined })); 
                                  }}
                                  className={`${(form.formState.errors.ifscCode && (form.formState.touchedFields.ifscCode || form.formState.isSubmitted)) || hasFieldError('ifscCode') ? 'border-red-500' : ''}`}
                                />
                              </FormControl>
                              {(form.formState.errors.ifscCode?.message && (form.getValues('ifscCode') !== '' || form.formState.isSubmitted)) || getFieldError('ifscCode') ? (
                                <FormMessage>
                                  {getFieldError('ifscCode') || form.formState.errors.ifscCode?.message}
                                </FormMessage>
                              ) : null}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="space-y-3">
                      {/* Infrastructure Photos (Optional) */}
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-muted-foreground">Upload Infrastructure Photos (Optional)</p>
                              <p className="text-xs text-muted-foreground">Labs, placement training facilities, campus images</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <input
                              type="file"
                              id="infra-upload"
                              multiple
                              accept="image/*,application/pdf"
                              className="hidden"
                              onChange={handleInfraChange}
                            />
                            <label htmlFor="infra-upload">
                              <Button asChild variant="outline" size="sm" className="cursor-pointer">
                                <span>Choose Files</span>
                              </Button>
                            </label>
                            <div className="text-xs text-muted-foreground">Max file size: 2MB</div>
                          </div>
                        </div>
                        {infraFiles.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 max-h-12 overflow-y-auto">
                            {infraFiles.map(f => (
                              <div key={f.name} className="flex items-center bg-green-50 border border-green-200 rounded px-2 py-0.5 text-green-700 font-semibold text-xs max-w-xs md:max-w-none">
                                <CheckCircle className="h-4 w-4 mr-1 text-green-500 shrink-0" />
                                <span className="truncate md:whitespace-normal" title={f.name}>{f.name}</span>
                                <button
                                  onClick={() => removeInfraFile(f.name)}
                                  className="ml-1 p-0.5 hover:bg-green-200 rounded-full transition-colors"
                                  title="Remove file"
                                >
                                  <X className="h-3 w-3 text-green-600" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {infraError && <div className="text-xs text-red-500 mt-2">{infraError}</div>}
                      </div>
                      {/* Cancelled Cheque (Required) */}
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-muted-foreground">
                                Upload Cancelled Cheque <span className="text-red-500">*</span>
                              </p>
                              <p className="text-xs text-muted-foreground">Required for bank verification</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <input
                              type="file"
                              id="cheque-upload"
                              accept="image/*,application/pdf"
                              className="hidden"
                              onChange={handleChequeChange}
                            />
                            <label htmlFor="cheque-upload">
                              <Button asChild variant="outline" size="sm" className="cursor-pointer" style={{ background: chequeFile ? '#fef3c7' : undefined }}>
                                <span>Choose File</span>
                              </Button>
                            </label>
                            <div className="text-xs text-muted-foreground">Max file size: 2MB</div>
                          </div>
                        </div>
                        {chequeFile && (
                          <div className="mt-2 flex items-center bg-green-50 border border-green-200 rounded px-2 py-0.5 text-green-700 font-semibold text-xs max-w-xs md:max-w-none">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500 shrink-0" />
                            <span className="truncate md:whitespace-normal" title={chequeFile.name}>{chequeFile.name}</span>
                            <button
                              onClick={removeChequeFile}
                              className="ml-1 p-0.5 hover:bg-green-200 rounded-full transition-colors"
                              title="Remove file"
                            >
                              <X className="h-3 w-3 text-green-600" />
                            </button>
                          </div>
                        )}
                        {chequeError && <div className="text-xs text-red-500 mt-2">{chequeError}</div>}
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
                    <Button 
                      type="button" 
                      variant="hero" 
                      disabled={isSubmitting}
                      onClick={async () => {
                        console.log("Submit button clicked!");
                        console.log("Current section:", currentSection);
                        console.log("Total sections:", sections.length);
                        console.log("Is submitting:", isSubmitting);
                        
                        // Manually trigger form submission
                        const formData = form.getValues();
                        console.log("Form values:", formData);
                        await onSubmit(formData);
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
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