
import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const testimonials = [
    {
      name: "David Thompson",
      role: "Startup Founder",
      content: "Taskoria's AI matching system connected me with the perfect developer for my project. The blockchain verification gave me complete confidence in my choice.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Small Business Owner", 
      content: "The community features are amazing! I learned so much from other entrepreneurs and found incredible service providers through recommendations.",
      rating: 5
    }
  ];

function Testomonail() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover how Taskoria is transforming the way people connect with service providers
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
  )
}

export default Testomonail