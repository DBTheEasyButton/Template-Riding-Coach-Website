import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoyaltyStatus } from "@/components/LoyaltyStatus";
import LoyaltyLeaderboard from "@/components/LoyaltyLeaderboard";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Mail, Search, Target, Users, Gift, Trophy } from "lucide-react";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";

export default function Loyalty() {
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchedEmail(email.trim());
    }
  };

  const seoConfig = getSEOConfig('/loyalty');

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
      />
      
      <Navigation />

      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-playfair font-bold text-navy mb-6">
              Loyalty Rewards Programme
            </h1>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-xl text-dark max-w-3xl mx-auto">
              Earn points with every clinic, unlock discount codes, and compete for bi-annual prizes. 
              Share your unique referral code to earn bonus points when friends join!
            </p>
          </div>

          {/* How It Works Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-playfair font-bold text-navy text-center mb-12">
              How the Loyalty Programme Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-orange/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mb-3">
                    <Target className="h-6 w-6 text-orange" />
                  </div>
                  <CardTitle className="text-lg text-navy">Earn Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-dark text-sm">
                    Get <strong>10 points</strong> for every clinic you attend. Your points accumulate throughout the year!
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-orange" />
                  </div>
                  <CardTitle className="text-lg text-navy">Refer Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-dark text-sm">
                    Share your unique referral code. When a new client uses it, you both earn <strong>20 bonus points!</strong>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mb-3">
                    <Gift className="h-6 w-6 text-orange" />
                  </div>
                  <CardTitle className="text-lg text-navy">Unlock Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-dark text-sm">
                    Every <strong>50 points</strong> automatically generates a unique <strong>20% discount code</strong> for your next clinic!
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mb-3">
                    <Trophy className="h-6 w-6 text-orange" />
                  </div>
                  <CardTitle className="text-lg text-navy">Win Prizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-dark text-sm">
                    The <strong>top 5 riders</strong> win special prizes! First reset 30 June 2025, then bi-annually (June & December).
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Check Your Status Section */}
          <section className="mb-16 bg-gray-50 rounded-2xl p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-playfair font-bold text-navy mb-3">
                  <Search className="h-8 w-8 text-orange inline-block mr-2" />
                  Check Your Status
                </h2>
                <p className="text-dark">
                  Enter your email to view your points, referral code, available discounts, and leaderboard position
                </p>
              </div>
              
              <Card>
                <CardContent className="pt-6">
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
                        data-testid="input-loyalty-email"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-orange hover:bg-orange/90 text-white"
                      data-testid="button-check-status"
                    >
                      Check My Status
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>

          {searchedEmail && (
            <div className="mb-16 flex justify-center">
              <LoyaltyStatus email={searchedEmail} />
            </div>
          )}

          {/* Live Leaderboard Section */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-playfair font-bold text-navy mb-3">
                Live Leaderboard
              </h2>
              <p className="text-dark max-w-2xl mx-auto">
                See where you rank! The top 5 riders at the end of each period win prizes. 
                Points will first reset on 30 June 2025, then bi-annually (30 June & 31 December) thereafter.
              </p>
            </div>
            <LoyaltyLeaderboard />
          </section>

          {/* CTA Section */}
          <section className="bg-navy rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-playfair font-bold mb-4">Ready to Start Earning Points?</h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Register for your first clinic today and begin your journey to exclusive rewards, discounts, and prizes!
            </p>
            <Button 
              size="lg" 
              className="bg-orange hover:bg-orange/90 text-white text-lg px-8 py-6"
              asChild
            >
              <a href="/#clinics" data-testid="button-view-clinics">View Available Clinics</a>
            </Button>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}