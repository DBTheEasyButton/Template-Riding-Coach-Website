import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Star, Trophy, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface LoyaltyStatusProps {
  email: string;
}

interface LoyaltyProgram {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  clinicEntries: number;
  totalSpent: number;
  loyaltyTier: string;
  lastClinicDate: string;
  availableDiscounts?: LoyaltyDiscount[];
}

interface LoyaltyDiscount {
  id: number;
  discountCode: string;
  discountType: string;
  discountValue: number;
  minimumEntries: number;
  expiresAt: string;
  isUsed: boolean;
}

export function LoyaltyStatus({ email }: LoyaltyStatusProps) {
  const [showDiscounts, setShowDiscounts] = useState(false);

  const { data: loyaltyProgram, isLoading } = useQuery<LoyaltyProgram>({
    queryKey: ['/api/loyalty', email],
    enabled: !!email,
    retry: false
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyProgram) {
    return (
      <Card className="w-full max-w-md border-dashed">
        <CardContent className="p-6 text-center">
          <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Join Our Loyalty Program</h3>
          <p className="text-sm text-gray-600">
            Register for your first clinic to start earning rewards!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getNextRewardEntries = () => {
    const nextMilestone = Math.ceil(loyaltyProgram.clinicEntries / 5) * 5;
    return nextMilestone === loyaltyProgram.clinicEntries ? nextMilestone + 5 : nextMilestone;
  };

  const getProgressPercentage = () => {
    const remainder = loyaltyProgram.clinicEntries % 5;
    return (remainder / 5) * 100;
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'gold':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'silver':
        return <Star className="h-5 w-5 text-gray-400" />;
      default:
        return <Gift className="h-5 w-5 text-amber-600" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const formatPrice = (pence: number) => {
    return `£${(pence / 100).toFixed(2)}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Loyalty Status</CardTitle>
          <Badge className={`capitalize ${getTierColor(loyaltyProgram.loyaltyTier)}`}>
            <span className="flex items-center gap-1">
              {getTierIcon(loyaltyProgram.loyaltyTier)}
              {loyaltyProgram.loyaltyTier}
            </span>
          </Badge>
        </div>
        <CardDescription>
          Track your clinic entries and earn rewards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Clinic Entries</span>
            <span className="font-medium">{loyaltyProgram.clinicEntries}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Spent</span>
            <span className="font-medium">{formatPrice(loyaltyProgram.totalSpent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Last Clinic</span>
            <span className="font-medium">
              {new Date(loyaltyProgram.lastClinicDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Next Reward</span>
            <span className="font-medium">
              {loyaltyProgram.clinicEntries % 5}/5
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
          <p className="text-xs text-gray-600 text-center">
            {5 - (loyaltyProgram.clinicEntries % 5)} more entries for 15% discount
          </p>
        </div>

        {loyaltyProgram.availableDiscounts && loyaltyProgram.availableDiscounts.length > 0 && (
          <Dialog open={showDiscounts} onOpenChange={setShowDiscounts}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowDiscounts(true)}
              >
                <Gift className="h-4 w-4 mr-2" />
                View Available Rewards ({loyaltyProgram.availableDiscounts.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Available Rewards</DialogTitle>
                <DialogDescription>
                  Use these discount codes during clinic registration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {loyaltyProgram.availableDiscounts.map((discount) => (
                  <Card key={discount.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-lg">
                            {discount.discountValue}% OFF
                          </h4>
                          <p className="text-sm text-gray-600">
                            Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {discount.discountCode}
                            </span>
                          </p>
                        </div>
                        <Badge variant="secondary">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(discount.expiresAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Earned after {discount.minimumEntries} clinic entries
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}