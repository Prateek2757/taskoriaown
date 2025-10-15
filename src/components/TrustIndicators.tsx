
import { Shield, Award, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrustIndicatorsProps {
  verified: boolean;
  responseTime: string;
  completedJobs: number;
  specialBadges?: string[];
}

export const TrustIndicators = ({ 
  verified, 
  responseTime, 
  completedJobs, 
  specialBadges = [] 
}: TrustIndicatorsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {verified && (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Blockchain Verified
        </Badge>
      )}
      
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {responseTime} response
      </Badge>
      
      <Badge variant="outline" className="flex items-center gap-1">
        <Award className="w-3 h-3" />
        {completedJobs} jobs completed
      </Badge>
      
      {specialBadges.map((badge) => (
        <Badge key={badge} className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {badge}
        </Badge>
      ))}
    </div>
  );
};
