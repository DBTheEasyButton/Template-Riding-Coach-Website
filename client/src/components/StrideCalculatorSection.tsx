import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Calculator, Target, Clock } from "lucide-react";

export default function StrideCalculatorSection() {
  return (
    <section id="stride-calculator" className="py-24 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Video Background */}
        <div className="relative text-center mb-16 rounded-2xl overflow-hidden">
          {/* Background Video for header only */}
          <div className="absolute inset-0">
            <video 
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/stride-calculator-demo.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="relative z-10 py-16">
            <h2 className="text-5xl font-playfair font-bold text-white mb-6">Stride Calculator</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Calculate precise pole spacing and distances based on your height and your horse's measurements
            </p>
          </div>
        </div>

        <div className="mb-16">
          {/* Main Calculator Card */}
          <div>
            <Card className="bg-white border-gray-200 shadow-xl h-full">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="p-4 bg-green-600 rounded-xl mr-6">
                    <Ruler className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-navy text-3xl">Stride Calculator</CardTitle>
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


        </div>


      </div>
    </section>
  );
}