"use client";
import React, { useState } from "react";
import { User, Download, Notebook } from "lucide-react";
import ImagePreview from "@/components/uiComponents/ImagePreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Landmark, MessageSquareShare, ScrollText } from "lucide-react";

const AgentDashboard = () => {
  const personalInfo = {
    fullName: "Niraj Gurung",
    sonOf: "BHADRANANDA",
    dateOfBirth: "Feb 18, 1992",
    motherName: "",
    email: "",
    gender: "Male",
    nationality: "Nepalese",
    maritalStatus: "Single",
  };

  const businessInfo = {
    agentCode: "05001134",
    licenseNo: "JET/16",
    licenseValidity: "Active",
    training: "TRAINING/AGENT",
  };

  const documents = [
    { name: "Exam Certificate", uploaded: true },
    { name: "Citizenship (front side)", uploaded: true },
    { name: "Citizenship (back side)", uploaded: true },
    { name: "Pan Card", uploaded: true },
    { name: "Movement", uploaded: false },
    { name: "Character Certificate", uploaded: true },
    { name: "Training Certificate", uploaded: true },
    { name: "Equivalent", uploaded: false },
    { name: "Application form", uploaded: true },
    { name: "License Document", uploaded: true },
    { name: "Bank Voucher", uploaded: false },
    { name: "Other Documents", uploaded: true },
  ];

  const [kycData, setKycData] = useState<{ [key: string]: string }>({
    photoFileUrl: "/images/esewa.png",
  });

  const displayData = (field: string | number): string => {
    if (!kycData) return "Loading...";
    const value = kycData[field];
    return value || "N/A";
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="col-span-1 lg:col-span-4">
              <Card className="rounded-lg border-1 gap-3 sticky top-0 ">
                <div className="flex flex-wrap items-start gap-5 mx-5">
                  <Image
                    src="/images/profile.jpeg"
                    alt="Description"
                    width={120}
                    height={120}
                    className="rounded-lg flex-shrink-0 transition-all duration-300 w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover"
                  />
                  <div className="flex flex-col flex-1 min-w-0 max-w-full break-words">
                    <span className="text-lg font-bold break-words">
                      Prithivi narayan bir bikram shah
                    </span>
                    <span className="text-md text-gray-400 font-bold break-words">
                      #Agent Code
                    </span>
                    <Separator className="my-2 border-t-1 border-dashed border-gray-300 bg-transparent" />
                    <span className="text-gray-700 text-sm">9841563155</span>
                    <span className="text-gray-700 text-sm">
                      ProposalEmail@gmail.com
                    </span>
                    <Button variant={"outline"} size={"sm"} className="mt-2">
                      <MessageSquareShare />
                      Message
                    </Button>
                  </div>
                </div>
                <CardContent>
                  <Separator className="mb-2" />
                  <div className=" space-y-4 mb-4">
                    <h1 className="text-lg font-semibold mb-3">Address</h1>
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-700">
                        Province: <b>Bagmati</b>
                      </span>
                      <span className="text-gray-700">
                        District: <b>Kathmandu</b>
                      </span>
                      <span className="text-gray-700">
                        Municipality: <b>Nagarjun Municipality</b>
                      </span>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className=" space-y-4 ">
                    <h1 className="text-lg font-semibold mb-3">
                      Account Status
                    </h1>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Landmark className="h-5 w-5 text-gray-500" />{" "}
                        <span>Bank Account</span>
                      </div>
                      <Badge className="bg-green-500 text-white dark:bg-green-600">
                        Approved
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ScrollText className="h-5 w-5 text-gray-500" />{" "}
                        <span>KYC</span>
                      </div>
                      <Badge className="bg-red-500 text-white dark:bg-green-600">
                        Not Approved
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1 lg:col-span-8 space-y-4 bg-white rounded-lg border-1">
              {/* LICENSE DETAILS */}
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  License Details
                </h2>
                <div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700 text-sm">
                        Agent Code:
                        <span className="ml-1">
                          <b>{businessInfo.agentCode}</b>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700 text-sm">
                        License No:
                        <span className="ml-1">
                          <b>{businessInfo.licenseNo}</b>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700 text-sm">
                        License Validity:
                        <span className="ml-1">
                          <b>{businessInfo.licenseValidity}</b>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700 text-sm">
                        Training:
                        <span className="ml-1">
                          <b>{businessInfo.training}</b>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* PERSONAL INFORMATION */}
                <div className="mt-3">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">
                    Personal Information
                  </h2>
                  <div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[
                        ["Full Name", personalInfo.fullName],
                        ["Date of Birth", personalInfo.dateOfBirth],
                        ["Father Name", "Ram Gurung"],
                        ["Mother Name", "-"],
                        ["Gender", personalInfo.gender],
                        ["Marital Status", personalInfo.maritalStatus],
                        ["Email", personalInfo.email || "-"],
                        ["Nationality", personalInfo.nationality],
                      ].map(([label, value], index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            {label}:
                            <span className="ml-1">
                              <b>{value}</b>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* TRAINING INFORMATION */}
                <div className="mt-3">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">
                    Training Information
                  </h2>
                  <div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[
                        ["Superior Agent", "-"],
                        ["Reporting Manager", "-"],
                        ["Training Id", "179 Chitlango 15-31"],
                        ["Trainer Name", "Narayan Prasad Ghimire"],
                        [
                          "Training Date",
                          "From:30th Shrawan to:30th Bhadra-16",
                        ],
                        ["Training Result", "Chakmanda 31-5/6"],
                      ].map(([label, value], index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            {label}:
                            <span className="ml-1">
                              <b>{value}</b>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* DOCUMENTS */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      Documents
                    </h3>
                    <Button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Export All</span>
                    </Button>
                  </div>
                  <div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className="border p-2 rounded-lg bg-gray-10 space-y-2"
                        >
                          <p className="flex items-center text-gray-700 text-sm">
                            {doc.name}
                          </p>
                          <ImagePreview
                            label="Photo"
                            imageUrl="photoFileUrl"
                            displayData={displayData}
                          />
                          <p className="text-xs mt-2 text-gray-500">
                            {doc.uploaded ? "Uploaded" : "Not Uploaded"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="text-sm text-gray-500 p-6 rounded-lg text-center">
            Generated by SAINIK LIFE HO.NPO-68370-2075-75-75:00AE
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
