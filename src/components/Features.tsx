"use client";
import { Shield, Users, Bot, Award } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export const Features = () => {
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-blue-600" />,
      title: "AI-Powered Matching",
      description:
        "Our advanced AI connects you with the perfect service providers based on your specific needs and preferences.",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Professional Verification",
      description:
        "Every provider is verified through our tamper-proof system, ensuring trust and transparency.",
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      title: "Smart Quoting",
      description:
        "Get instant, accurate quotes powered by AI analysis of your project requirements.",
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "Community Driven",
      description:
        "Join our vibrant community forums where providers share knowledge and customers find insights.",
    },
  ];
  return (
    <div>
      {/* Features */}
      <section id="features" className="py-16 bg-gradient-to-b from-white to-muted/30">
        <div className="container max-w-6xl mx-auto px-2">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Taskoria?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of service marketplaces with
              cutting-edge technology and community focus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow border-0 bg-gradient-to-b from-white to-gray-50"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
