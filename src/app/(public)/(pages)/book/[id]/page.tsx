"use client";

import {
  CalendarIcon,
  MapPin,
  Star,
  CreditCard,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";

export default function BookingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Mock provider data
  const provider = {
    id: 1,
    name: "Sarah Johnson",
    service: "Interior Design",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 85,
    location: "San Francisco, CA",
    verified: true,
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b12b2134?w=150&h=150&fit=crop&crop=face",
    responseTime: "1 hour",
  };

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const durationOptions = [
    { value: "1", label: "1 hour", price: 85 },
    { value: "2", label: "2 hours", price: 170 },
    { value: "3", label: "3 hours", price: 255 },
    { value: "4", label: "4 hours", price: 340 },
    { value: "custom", label: "Custom duration", price: 0 },
  ];

  const selectedDuration = durationOptions.find((d) => d.value === duration);
  const totalPrice = selectedDuration ? selectedDuration.price : 0;
  const serviceFee = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </Button>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Book a Service
            </h1>
            <p className="text-gray-600">
              Schedule your appointment with {provider.name}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={provider.profileImage}
                        alt={provider.name}
                      />
                      <AvatarFallback>
                        {provider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">
                          {provider.name}
                        </h3>
                        {provider.verified && (
                          <Badge className="bg-cyan-100 text-cyan-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium">
                        {provider.service}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            {provider.rating} ({provider.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{provider.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                  <CardDescription>Tell us about your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project, requirements, and any specific details..."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Estimated Duration *</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}{" "}
                            {option.price > 0 && `- $${option.price}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {duration === "custom" && (
                    <div>
                      <Label htmlFor="custom-hours">Custom Hours</Label>
                      <Input
                        id="custom-hours"
                        type="number"
                        placeholder="Enter number of hours"
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Date & Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                  <CardDescription>
                    Choose your preferred date and time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">
                      Select Date *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-2",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-base font-medium">
                      Select Time *
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className="text-sm"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How should the provider contact you?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="address">Service Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter the address where the service will be performed..."
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Service Rate</span>
                      <span>${provider.hourlyRate}/hour</span>
                    </div>
                    {selectedDuration &&
                      selectedDuration.value !== "custom" && (
                        <div className="flex justify-between">
                          <span>Duration</span>
                          <span>{selectedDuration.label}</span>
                        </div>
                      )}
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span>Date</span>
                        <span>{format(selectedDate, "MMM d, yyyy")}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between">
                        <span>Time</span>
                        <span>{selectedTime}</span>
                      </div>
                    )}
                  </div>

                  {totalPrice > 0 && (
                    <>
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Service fee (5%)</span>
                          <span>${serviceFee}</span>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>${finalTotal}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedDate || !selectedTime || !duration}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirm & Pay
                  </Button>

                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                    <Shield className="w-4 h-4 text-cyan-600" />
                    <span>Secure payment & money-back guarantee</span>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Signals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Booking Confirmation</p>
                      <p className="text-gray-600">
                        You'll receive instant confirmation via email
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Provider Contact</p>
                      <p className="text-gray-600">
                        The provider will contact you within{" "}
                        {provider.responseTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Service Delivery</p>
                      <p className="text-gray-600">
                        Enjoy your service with payment protection
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
