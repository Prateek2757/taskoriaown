"use client";

import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PortfolioStep() {
  return (
    <div className="space-y-4">
      <div>
        <Label>Portfolio Images</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Upload your best work samples</p>
          <p className="text-xs text-gray-400">Multiple files supported</p>
        </div>
      </div>

      <div>
        <Label htmlFor="videoIntro">Video Introduction (Optional)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Upload a short video introducing yourself</p>
          <p className="text-xs text-gray-400">MP4, MOV up to 50MB</p>
        </div>
      </div>

      <div>
        <Label htmlFor="references">Professional References</Label>
        <Textarea
          id="references"
          placeholder="Provide contact information for 2-3 professional references"
          rows={3}
        />
      </div>
    </div>
  );
}