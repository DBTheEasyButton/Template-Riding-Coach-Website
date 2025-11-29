import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Star, Trophy, Calendar, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
  points: number;
  referralCode: string;
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
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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
      <Card className="w-full max-w-md border-dashed border-2 border-orange/30">
        <CardContent className="p-6 text-center">
          <Star className="mx-auto h-12 w-12 text-orange mb-4" />
          <h3 className="text-lg font-semibold text-navy mb-2">Join Our Loyalty Programme</h3>
          <p className="text-sm text-dark">
            Register for your first clinic to start earning points and rewards!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getNextRewardPoints = () => {
    const nextMilestone = Math.ceil(loyaltyProgram.points / 50) * 50;
    return nextMilestone === loyaltyProgram.points ? nextMilestone + 50 : nextMilestone;
  };

  const getProgressPercentage = () => {
    const remainder = loyaltyProgram.points % 50;
    return (remainder / 50) * 100;
  };

  const copyReferralCode = () => {
    if (loyaltyProgram.referralCode) {
      navigator.clipboard.writeText(loyaltyProgram.referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
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
    <Card className="w-full max-w-md shadow-lg border-orange/20">
      <CardHeader className="pb-3 bg-gradient-to-r from-orange/5 to-orange/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-navy">Your Loyalty Status</CardTitle>
          <Badge className={`capitalize ${getTierColor(loyaltyProgram.loyaltyTier)}`}>
            <span className="flex items-center gap-1">
              {getTierIcon(loyaltyProgram.loyaltyTier)}
              {loyaltyProgram.loyaltyTier}
            </span>
          </Badge>
        </div>
        <CardDescription className="text-dark">
          Hello, {loyaltyProgram.firstName}! Track your points and rewards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Points Display */}
        <div className="bg-orange/5 rounded-lg p-4 text-center">
          <p className="text-sm text-dark mb-1">Total Points</p>
          <p className="text-4xl font-bold text-orange" data-testid="text-total-points">{loyaltyProgram.points}</p>
          <p className="text-xs text-gray-600 mt-1">{loyaltyProgram.clinicEntries} clinic{loyaltyProgram.clinicEntries !== 1 ? 's' : ''} attended</p>
        </div>

        {/* Referral Code */}
        {loyaltyProgram.referralCode && (
          <div className="border border-orange/20 rounded-lg p-4">
            <p className="text-sm text-dark mb-2 font-medium">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-center font-mono text-lg font-bold text-navy">
                {loyaltyProgram.referralCode}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={copyReferralCode}
                className="border-orange text-orange hover:bg-orange hover:text-white"
                data-testid="button-copy-referral"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Share with friends to earn 20 bonus points each!
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark">Total Spent</span>
            <span className="font-medium text-navy">{formatPrice(loyaltyProgram.totalSpent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark">Last Clinic</span>
            <span className="font-medium text-navy">
              {new Date(loyaltyProgram.lastClinicDate).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>

        {/* Progress to Next Discount */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark">Progress to Next Discount</span>
            <span className="font-medium text-navy">
              {loyaltyProgram.points % 50}/{50} points
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2 bg-gray-200" />
          <p className="text-xs text-gray-600 text-center">
            {50 - (loyaltyProgram.points % 50)} more points for 20% discount code!
          </p>
        </div>

        {/* Available Discounts */}
        {loyaltyProgram.availableDiscounts && loyaltyProgram.availableDiscounts.length > 0 && (
          <Dialog open={showDiscounts} onOpenChange={setShowDiscounts}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-orange hover:bg-orange-hover text-white"
                onClick={() => setShowDiscounts(true)}
                data-testid="button-view-rewards"
              >
                <Gift className="h-4 w-4 mr-2" />
                View Available Discount Codes ({loyaltyProgram.availableDiscounts.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-navy">Your Available Discount Codes</DialogTitle>
                <DialogDescription>
                  Use these codes during clinic registration to save money
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {loyaltyProgram.availableDiscounts.map((discount) => (
                  <Card key={discount.id} className="border-orange/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-2xl text-orange">
                            {discount.discountValue}% OFF
                          </h4>
                          <p className="text-sm text-dark mt-1">
                            Code: <span className="font-mono bg-orange/10 px-2 py-1 rounded font-bold text-navy">
                              {discount.discountCode}
                            </span>
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100">
                          <Calendar className="h-3 w-3 mr-1" />
                          Expires {new Date(discount.expiresAt).toLocaleDateString('en-GB')}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Earned with {discount.minimumEntries || ((loyaltyProgram.points / 10) * 10)} points
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