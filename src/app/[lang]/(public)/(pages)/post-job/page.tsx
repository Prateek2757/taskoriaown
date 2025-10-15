
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import  JobPostingForm from "@/components/JobPostingForm";
import Link from "next/link";

const PostJob = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <JobPostingForm />
      </div>
    </div>
  );
};

export default PostJob;
