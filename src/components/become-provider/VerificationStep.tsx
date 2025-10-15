"use client";

import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function VerificationStep() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Blockchain Verification Process</h4>
        <p className="text-sm text-blue-700">
          Our AI-powered verification system will check your credentials and create a tamper-proof reputation profile on the blockchain.
        </p>
      </div>

      <div>
        <Label htmlFor="idUpload">Government ID Upload</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
        </div>
      </div>

      <div>
        <Label htmlFor="certifications">Professional Certifications</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Upload certificates and licenses</p>
        </div>
      </div>

      <div>
        <Label htmlFor="backgroundCheck">Background Check Authorization</Label>
        <div className="flex items-center space-x-2 mt-2">
          <input type="checkbox" id="backgroundCheck" className="rounded" />
          <label htmlFor="backgroundCheck" className="text-sm">
            I authorize Taskoria to conduct a background check for verification purposes
          </label>
        </div>
      </div>
    </div>
  );
}