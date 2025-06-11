import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoyaltyStatus } from "@/components/LoyaltyStatus";
import { Mail, Search } from "lucide-react";

export default function Loyalty() {
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchedEmail(email.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loyalty Program
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your clinic entries and earn exclusive rewards. Get 15% off after every 5 clinic registrations!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Check Your Status
              </CardTitle>
              <CardDescription>
                Enter your email address to view your loyalty program status and available rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Check Status
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Earn rewards automatically with every clinic registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Register for Clinics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Every clinic registration counts towards your loyalty status
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Earn Tier Status</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bronze (1+ entries), Silver (5+ entries), Gold (10+ entries)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Get Discounts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive 15% discount codes after every 5 clinic entries
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Use Your Rewards</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Apply discount codes during clinic registration checkout
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {searchedEmail && (
          <div className="mt-12 flex justify-center">
            <LoyaltyStatus email={searchedEmail} />
          </div>
        )}

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Register for your first clinic today and begin your journey to exclusive rewards and discounts.
          </p>
          <Button size="lg" asChild>
            <a href="/#clinics">View Available Clinics</a>
          </Button>
        </div>
      </div>
    </div>
  );
}