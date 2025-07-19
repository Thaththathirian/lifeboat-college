import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Award, Building } from "lucide-react";
import { CollegeRegistrationForm } from "./CollegeRegistrationForm";

export const CollegeLanding = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <CollegeRegistrationForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
            College Partnership Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join our mission to provide quality education and scholarships to deserving students. 
            Partner with us to make a difference in students' lives.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-scale-in">
          <div className="bg-card p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Student Management</h3>
            <p className="text-muted-foreground">
              Manage scholarship applications, track student progress, and support their academic journey.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
            <Award className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Scholarship Program</h3>
            <p className="text-muted-foreground">
              Participate in our comprehensive scholarship program and help students achieve their dreams.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
            <Building className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Infrastructure Support</h3>
            <p className="text-muted-foreground">
              Showcase your facilities and get support for infrastructure development and placement training.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card p-12 rounded-2xl shadow-card">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Ready to Partner with Us?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Complete your college profile to join our network of partner institutions 
            and start making a difference in students' lives.
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => setShowForm(true)}
            className="text-lg px-8 py-6 h-auto"
          >
            <GraduationCap className="mr-3 h-6 w-6" />
            Create College Profile
          </Button>
        </div>
      </div>
    </div>
  );
};