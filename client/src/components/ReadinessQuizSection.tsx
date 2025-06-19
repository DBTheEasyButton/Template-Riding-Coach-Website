import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle, TrendingUp, Users } from "lucide-react";

export default function ReadinessQuizSection() {
  return (
    <section id="readiness-quiz" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-navy mb-6">Eventing Readiness Quiz</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover if you and your horse are ready for your target eventing level with personalized assessment and expert recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Quiz Card */}
          <div>
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="p-4 bg-blue-600 rounded-xl mr-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-navy text-3xl">Assessment Quiz</CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      Comprehensive readiness evaluation for all eventing levels
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-8 text-lg">
                  Take our interactive quiz to assess your preparation for BE80, BE90, BE100, or Novice level eventing. 
                  Get tailored feedback based on your horse's fitness, training consistency, and your confidence level.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-5 h-5 mr-3 text-blue-600" />
                      <span>Horse fitness assessment</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Target className="w-5 h-5 mr-3 text-blue-600" />
                      <span>Jumping consistency evaluation</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <TrendingUp className="w-5 h-5 mr-3 text-blue-600" />
                      <span>Cross-country experience check</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3 text-blue-600" />
                      <span>Rider confidence assessment</span>
                    </div>
                  </div>
                </div>

                <Link to="/readiness-quiz">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-6">
                    Start Readiness Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">Personalized Recommendations</h3>
                  <p className="text-gray-600">
                    Receive specific training suggestions based on your current preparation level and target goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">Identify Focus Areas</h3>
                  <p className="text-gray-600">
                    Discover which aspects of your training need attention before competing at your target level.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">Build Confidence</h3>
                  <p className="text-gray-600">
                    Gain clarity on your readiness and confidence to compete safely and successfully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}