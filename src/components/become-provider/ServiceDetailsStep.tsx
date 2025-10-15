"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const skills = ["Eco-Friendly", "Fast Delivery", "24/7 Available", "Certified Professional"];

export default function ServiceDetailsStep() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="serviceCategory">Primary Service Category</Label>
        <select className="w-full p-2 border rounded-md" id="serviceCategory">
          <option>Select a category</option>
          <option>Home Services</option>
          <option>Professional Services</option>
          <option>Creative Services</option>
          <option>Technology Services</option>
          <option>Health & Wellness</option>
        </select>
      </div>

      <div>
        <Label htmlFor="services">Specific Services</Label>
        <Textarea id="services" rows={3} placeholder="List the specific services you offer" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input id="hourlyRate" type="number" placeholder="50" />
        </div>
        <div>
          <Label htmlFor="experience">Years of Experience</Label>
          <Input id="experience" type="number" placeholder="5" />
        </div>
      </div>

      <div>
        <Label>Special Skills/Certifications</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-blue-100">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}