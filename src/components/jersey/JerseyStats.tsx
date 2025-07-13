import { Card, CardContent } from "@/components/ui/card";
import { Users, Crown, Star } from "lucide-react";

interface JerseyStatsProps {
  totalScans: number;
  uniqueUsers: number;
}

export function JerseyStats({ totalScans, uniqueUsers }: JerseyStatsProps) {
  const engagementRate =
    totalScans > 0 ? Math.round((uniqueUsers / totalScans) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{totalScans}</div>
          <div className="text-sm text-red-700 font-medium">Total Scans</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Crown className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600">{uniqueUsers}</div>
          <div className="text-sm text-blue-700 font-medium">Unique Users</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Star className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {engagementRate}%
          </div>
          <div className="text-sm text-green-700 font-medium">
            Engagement Rate
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
