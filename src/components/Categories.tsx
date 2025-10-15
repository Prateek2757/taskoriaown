"use client";
import { Card, CardContent, CardDescription } from "../components/ui/card";

const categories = [
    { name: "Home Services", icon: "🏠", count: "500+ providers" },
    { name: "Professional", icon: "💼", count: "300+ providers" },
    { name: "Creative", icon: "🎨", count: "200+ providers" },
    { name: "Technology", icon: "💻", count: "150+ providers" },
    { name: "Health & Wellness", icon: "🏥", count: "100+ providers" },
    { name: "Education", icon: "📚", count: "80+ providers" }
  ];

export default function Categories() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Service Categories</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          From home services to professional consulting, find the perfect provider for any task
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Card key={category.name} className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-blue-200 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
  );
}