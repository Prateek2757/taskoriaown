"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


import ProgressSidebar from "@/components/become-provider/ProgressSidebar";
import BenefitsCard from "@/components/become-provider/BenifitsCard";
import PersonalInfoStep from "@/components/become-provider/PersonalInfoStep";
import ServiceDetailsStep from "@/components/become-provider/ServiceDetailsStep";
import VerificationStep from "@/components/become-provider/VerificationStep";
import PortfolioStep from "@/components/become-provider/PortfolioStep";


const BecomeProviderPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Service Details" },
    { number: 3, title: "Verification" },
    { number: 4, title: "Portfolio" },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep />;
      case 2: return <ServiceDetailsStep />;
      case 3: return <VerificationStep />;
      case 4: return <PortfolioStep />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Taskoria as a Provider
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with customers, grow your business, and become part of our trusted community of professionals
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProgressSidebar steps={steps} currentStep={currentStep} />
            <BenefitsCard />
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Step {currentStep}: {steps[currentStep - 1].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderStep()}

                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => {
                      if (currentStep < steps.length) {
                        setCurrentStep((s) => s + 1);
                      } else {
                        alert("Application submitted! We'll review and get back to you within 24 hours.");
                      }
                    }}
                  >
                    {currentStep === steps.length ? "Submit Application" : "Next"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeProviderPage;
