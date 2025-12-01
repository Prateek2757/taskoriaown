import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, FileText, Lock, Users, AlertCircle, Phone, Award } from "lucide-react";
import Link from "next/link";

const TrustSafety = () => {
  const verificationSteps = [
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Identity Verification",
      description: "All providers must verify their identity with Australian photo ID (Driver's Licence or Passport) before joining Taskoria."
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "ABN Validation",
      description: "We verify Australian Business Numbers (ABN) through the Australian Business Register to ensure providers are legitimate trading entities."
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: "Licence Verification",
      description: "Trades requiring licences (electricians, plumbers, builders) must provide valid Australian trade licences which we verify with state authorities."
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-600" />,
      title: "Insurance Validation",
      description: "Providers must hold current Public Liability Insurance (minimum $10M coverage) and provide proof before accepting jobs."
    }
  ];

  const safetyFeatures = [
    {
      title: "Secure Escrow Payments",
      description: "Your payment is held securely until the job is completed to your satisfaction. Providers only get paid when you approve the work.",
      icon: <Lock className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Dispute Resolution",
      description: "If issues arise, our Australian-based support team mediates fairly. We aim to resolve disputes within 48 hours with transparent communication.",
      icon: <Users className="w-6 h-6 text-green-600" />
    },
    {
      title: "Taskoria Guarantee",
      description: "If a verified provider doesn't show up or complete the job as agreed, we'll help find a replacement or provide a full refund.",
      icon: <Shield className="w-6 h-6 text-purple-600" />
    },
    {
      title: "24/7 Support",
      description: "Australian-based customer support available around the clock for urgent issues, safety concerns, or payment disputes.",
      icon: <Phone className="w-6 h-6 text-orange-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
    

      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Australian Verified & Protected
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Trust & Safety at Taskoria
            </h1>
            <p className="text-xl text-muted-foreground">
              Australia's most secure service marketplace. Every provider verified, every payment protected, every job guaranteed.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How We Verify Providers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every service provider on Taskoria goes through our rigorous Australian verification process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {verificationSteps.map((step, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Your Protection Guarantee</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've built multiple layers of protection to keep your money and project safe
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {safetyFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-muted rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Dispute Resolution Process</h2>
                    <p className="text-muted-foreground">
                      If you're not satisfied with a service, here's how we help resolve issues fairly
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Report the Issue</h3>
                      <p className="text-sm text-muted-foreground">Contact us within 48 hours of job completion with details and evidence (photos, messages, etc.)</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Investigation</h3>
                      <p className="text-sm text-muted-foreground">Our Australian support team reviews evidence from both parties and mediates fairly within 48 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Resolution</h3>
                      <p className="text-sm text-muted-foreground">We may offer a partial/full refund, arrange for work to be completed, or facilitate a fair compromise</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Provider Badge System</h2>
            <p className="text-muted-foreground mb-8">
              Look for these badges when choosing a provider
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Bronze Verified</h3>
                  <p className="text-sm text-muted-foreground">ID + ABN verified</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Silver Verified</h3>
                  <p className="text-sm text-muted-foreground">Bronze + Licence verified</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Gold Verified</h3>
                  <p className="text-sm text-muted-foreground">Silver + Insurance verified</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
};

export default TrustSafety;
