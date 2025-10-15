
import {  Shield, Users, Bot  } from "lucide-react";

const howItWorks = [
    {
      step: "1",
      title: "Post Your Job",
      description: "Describe your project with AI assistance to create the perfect job post",
      icon: <Bot className="w-8 h-8 text-blue-600" />
    },
    {
      step: "2", 
      title: "Get Matched",
      description: "Our AI analyzes your needs and connects you with verified providers",
      icon: <Users className="w-8 h-8 text-green-600" />
    },
    {
      step: "3",
      title: "Work & Pay Securely",
      description: "Collaborate through our platform with secure escrow payment protection",
      icon: <Shield className="w-8 h-8 text-purple-600" />
    }
  ];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How Taskoria Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get connected with the right professionals in just three simple steps
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {howItWorks.map((step, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
}