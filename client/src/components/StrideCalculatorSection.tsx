import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Calculator, Target, Clock } from "lucide-react";

export default function StrideCalculatorSection() {
  return (
    <section id="stride-calculator" className="py-24 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-navy mb-6">Stride Calculator</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Calculate precise pole spacing and distances based on your height and your horse's measurements
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Main Calculator Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-xl h-full">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="p-4 bg-green-600 rounded-xl mr-6">
                    <Ruler className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-navy text-3xl">Professional Stride Calculator</CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      Precise distance measurements for training and competition
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-8 text-lg">
                  Calculate exact distances for poles and jumps with measurements in yards, meters, 
                  and your personal step count based on your height and your horse's stride length.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calculator className="w-5 h-5 mr-3 text-green-600" />
                      <span>Trotting poles & jumping gymnastics</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Target className="w-5 h-5 mr-3 text-green-600" />
                      <span>Course related distances</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 text-green-600" />
                      <span>Personalized step counting</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Ruler className="w-5 h-5 mr-3 text-green-600" />
                      <span>Multiple measurement units</span>
                    </div>
                  </div>
                </div>

                <Link to="/stride-calculator">
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-6">
                    Open Stride Calculator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Card */}
          <div>
            <Card className="bg-white border-gray-200 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-navy text-xl">Why Use the Calculator?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-navy mb-2">Precision Training</h4>
                    <p className="text-sm text-gray-600">
                      Get exact measurements for setting up training exercises
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-navy mb-2">Course Walking</h4>
                    <p className="text-sm text-gray-600">
                      Convert distances to your personal step count for competition preparation
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-navy mb-2">Horse-Specific</h4>
                    <p className="text-sm text-gray-600">
                      Customized calculations based on your horse's size and stride
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Endorsement */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-playfair font-bold text-navy mb-4">
              "Precision in measurement leads to precision in performance"
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              Dan's competition-tested approach to distance measurement, refined through years of 
              international eventing experience. Get the same precision tools used by professional riders.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                <span>Used by professionals</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                <span>Competition tested</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                <span>Mobile optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}