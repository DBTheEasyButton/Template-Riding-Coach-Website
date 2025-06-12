import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Target, Clock } from "lucide-react";

export default function CompetitionToolsSection() {
  return (
    <section id="competition-tools" className="py-24 bg-gradient-to-br from-forest to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold mb-6">Competition Preparation Tools</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Professional tools to help you prepare for every competition with precision and confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* One-Click Checklist Generator */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange rounded-lg mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">One-Click Checklist Generator</CardTitle>
                  <CardDescription className="text-green-100">
                    Comprehensive preparation lists
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Generate customized competition preparation checklists based on event type, level, and timeline. 
                Never miss a crucial preparation step again.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-green-100">
                  <Target className="w-4 h-4 mr-2" />
                  Tailored to competition level (Novice to CCI5*)
                </div>
                <div className="flex items-center text-sm text-green-100">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline-based preparation phases
                </div>
                <div className="flex items-center text-sm text-green-100">
                  <Clock className="w-4 h-4 mr-2" />
                  Track progress and completion
                </div>
              </div>
              <Link to="/competition-checklists">
                <Button className="w-full bg-orange hover:bg-orange/90 text-white font-semibold">
                  Generate Your Checklist
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Competition Calendar */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-italian-red rounded-lg mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Competition Calendar</CardTitle>
                  <CardDescription className="text-green-100">
                    Dan's upcoming events
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Follow Dan's competition journey through the 2024 season, from local events to the 
                European Championship at Blenheim Palace.
              </p>
              <div className="space-y-2 mb-6">
                <div className="text-sm text-green-100">• 9 upcoming competitions</div>
                <div className="text-sm text-green-100">• Intermediate to Championship level</div>
                <div className="text-sm text-green-100">• Live results and updates</div>
              </div>
              <Button 
                className="w-full bg-italian-red hover:bg-italian-red/90 text-white font-semibold"
                onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Clinic Registration */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-navy rounded-lg mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Training Clinics</CardTitle>
                  <CardDescription className="text-green-100">
                    Learn directly from Dan
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Join Dan's exclusive training clinics and masterclasses. Limited spaces available 
                for personalized coaching sessions.
              </p>
              <div className="space-y-2 mb-6">
                <div className="text-sm text-green-100">• Show jumping & cross country</div>
                <div className="text-sm text-green-100">• Small group sessions</div>
                <div className="text-sm text-green-100">• All levels welcome</div>
              </div>
              <Button 
                className="w-full bg-navy hover:bg-navy/90 text-white font-semibold"
                onClick={() => document.getElementById('clinics')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Training
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlight */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-playfair font-bold mb-4">Professional Competition Management</h3>
            <p className="text-green-100 max-w-2xl mx-auto mb-6">
              Dan's competition preparation methodology, refined through years of international experience, 
              now available as intelligent digital tools to elevate your performance.
            </p>
            <Link to="/competition-checklists">
              <Button size="lg" className="bg-orange hover:bg-orange/90 text-white font-semibold px-8">
                Start Your Preparation Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}