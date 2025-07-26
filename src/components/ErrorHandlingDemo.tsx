import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Demo schema
const demoFormSchema = z.object({
  establishedYear: z.string().min(1, "Established Year is required"),
  accountNumber: z.string().min(1, "Account Number is required"),
  ifscCode: z.string().min(1, "IFSC Code is required"),
  passPercentage: z.string().optional(),
});

type DemoFormData = z.infer<typeof demoFormSchema>;

export const ErrorHandlingDemo = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      establishedYear: "",
      accountNumber: "",
      ifscCode: "",
      passPercentage: "",
    },
  });

  // Helper function to get field error from backend
  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName];
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors[fieldName];
  };

  const onSubmit = async (data: DemoFormData) => {
    setIsSubmitting(true);
    setFieldErrors({});

    // Simulate API call with error response
    setTimeout(() => {
      // Simulate the error response format you provided
      const errorResponse = {
        status: false,
        message: {
          establishedYear: "The Established Year field must contain only numbers.",
          accountNumber: "The Account Number field must contain only numbers.",
          ifscCode: "Invalid IFSC Code format.",
          passPercentage: "The Pass % field must contain only numbers."
        },
        data: []
      };

      // Set the field errors
      setFieldErrors(errorResponse.message);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Error Handling Demo</CardTitle>
            <CardDescription>
              This demonstrates how field-specific errors from the backend are displayed.
              Submit the form to see the error handling in action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          className={`${(form.formState.errors.establishedYear && form.formState.touchedFields.establishedYear) || hasFieldError('establishedYear') ? 'border-red-500' : ''}`}
                          onChange={e => { 
                            field.onChange(e); 
                            form.clearErrors('establishedYear'); 
                            setFieldErrors(prev => ({ ...prev, establishedYear: undefined })); 
                          }}
                        />
                      </FormControl>
                      {(form.formState.errors.establishedYear?.message && form.getValues('establishedYear') !== '') || getFieldError('establishedYear') ? (
                        <FormMessage>
                          {getFieldError('establishedYear') || form.formState.errors.establishedYear?.message}
                        </FormMessage>
                      ) : null}
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
                          className={`${(form.formState.errors.accountNumber && form.formState.touchedFields.accountNumber) || hasFieldError('accountNumber') ? 'border-red-500' : ''}`}
                          onChange={e => { 
                            field.onChange(e); 
                            form.clearErrors('accountNumber'); 
                            setFieldErrors(prev => ({ ...prev, accountNumber: undefined })); 
                          }}
                        />
                      </FormControl>
                      {(form.formState.errors.accountNumber?.message && form.getValues('accountNumber') !== '') || getFieldError('accountNumber') ? (
                        <FormMessage>
                          {getFieldError('accountNumber') || form.formState.errors.accountNumber?.message}
                        </FormMessage>
                      ) : null}
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
                          className={`${(form.formState.errors.ifscCode && form.formState.touchedFields.ifscCode) || hasFieldError('ifscCode') ? 'border-red-500' : ''}`}
                          onChange={e => { 
                            field.onChange(e); 
                            form.clearErrors('ifscCode'); 
                            setFieldErrors(prev => ({ ...prev, ifscCode: undefined })); 
                          }}
                        />
                      </FormControl>
                      {(form.formState.errors.ifscCode?.message && form.getValues('ifscCode') !== '') || getFieldError('ifscCode') ? (
                        <FormMessage>
                          {getFieldError('ifscCode') || form.formState.errors.ifscCode?.message}
                        </FormMessage>
                      ) : null}
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
                          className={`${hasFieldError('passPercentage') ? 'border-red-500' : ''}`}
                          onChange={e => { 
                            field.onChange(e); 
                            setFieldErrors(prev => ({ ...prev, passPercentage: undefined })); 
                          }}
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

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Expected Error Response Format:</h3>
              <pre className="text-xs bg-background p-2 rounded overflow-auto">
{`{
  "status": false,
  "message": {
    "establishedYear": "The Established Year field must contain only numbers.",
    "accountNumber": "The Account Number field must contain only numbers.",
    "ifscCode": "Invalid IFSC Code format.",
    "passPercentage": "The Pass % field must contain only numbers."
  },
  "data": []
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 