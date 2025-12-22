import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, MapPin, Users, Award, CheckCircle, Clock, Coffee, Sun, Star, ChevronRight } from "lucide-react";
import burghleyJumpImage from "@assets/Burghley_(1)_1766404028280.png";
import burghleyWaterImage from "@assets/Burghley__1766404028280.png";
import cotswoldsImage from "@assets/IMG_2889_1766404028281.jpg";
import londonImage from "@assets/IMG_2896_1766404028280.jpg";
import coachingImage from "@assets/DBCLINIC-28_1764067051591.jpg";
import coachingImage2 from "@assets/DBCLINIC-56_1762982883601.jpg";

export default function GATUKTour() {
  const handleRegisterInterest = () => {
    window.open("https://globalamateurtour.com", "_blank");
  };

  return (
    <>
      <SEOHead
        title="GAT UK Eventing Tour - Cotswolds & Burghley 2026 | Dan Bizzarro Method"
        description="Join Daniele Bizzarro for an 11-day eventing experience in the Cotswolds, featuring world-class coaching and the 2026 Burghley Horse Trials."
        canonical="https://danbizzarromethod.com/gat-uk-tour"
      />
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center">
          <div className="absolute inset-0">
            <img 
              src={burghleyJumpImage} 
              alt="Burghley Horse Trials cross country jump"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <span className="inline-block bg-orange text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                September 2026 Tour
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6">
                GAT UK Eventing Tour
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light mb-4">
                Cotswolds & Burghley 2026
              </p>
              <p className="text-lg text-white/80 mb-8 max-w-2xl">
                Discover an equestrian experience that blends world-class coaching, behind-the-scenes access and the excitement of the Burghley Horse Trials.
              </p>
              <Button 
                onClick={handleRegisterInterest}
                className="bg-orange hover:bg-orange-hover text-white px-8 py-6 text-lg font-semibold rounded-xl"
                data-testid="button-register-interest-hero"
              >
                Register Your Interest
              </Button>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Imagine spending eleven days riding in the rolling English Cotswolds, building your eventing skills with international coach Daniele Bizzarro, exploring idyllic villages and finishing it all off by watching the 2026 Burghley Horse Trials from the best seats in the house. This is not a cookie-cutter package holiday – it's a thoughtfully curated experience for riders and supporters who want to learn, be inspired and soak up the heart of British eventing.
            </p>
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg inline-block">
              <p className="text-amber-800 font-medium">
                The May 2026 tour sold out in record time and we've created a September tour with the same programme to meet demand. Places are strictly limited to keep the groups small and the coaching personal.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy text-center mb-12">
              Quick Facts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-gray-100">
                <CardContent className="p-6 flex items-start gap-4">
                  <Award className="w-8 h-8 text-orange flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Discipline</h3>
                    <p className="text-gray-600">Eventing</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-gray-100">
                <CardContent className="p-6 flex items-start gap-4">
                  <Calendar className="w-8 h-8 text-orange flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Provisional Dates</h3>
                    <p className="text-gray-600">Late August – early September 2026 (11 days)</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-gray-100">
                <CardContent className="p-6 flex items-start gap-4">
                  <MapPin className="w-8 h-8 text-orange flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Location</h3>
                    <p className="text-gray-600">The Cotswolds, England</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-gray-100">
                <CardContent className="p-6 flex items-start gap-4">
                  <Users className="w-8 h-8 text-orange flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Age & Experience</h3>
                    <p className="text-gray-600">Any age and level – beginners through to seasoned competitors welcome</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-gray-100 md:col-span-2">
                <CardContent className="p-6 flex items-start gap-4">
                  <CheckCircle className="w-8 h-8 text-orange flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Key Inclusions</h3>
                    <p className="text-gray-600">Two full days at the Burghley Horse Trials, eight training sessions, training competition day, masterclasses & exclusive stable visits, curated sightseeing, horse hire</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What Makes This Tour Special */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy text-center mb-4">
              What Makes This Tour Special?
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Across 11 unforgettable days you'll live and breathe the sport of eventing. The tour combines elite coaching, insider access and authentic local experiences.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-semibold text-navy mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange" />
                    World-class Training
                  </h3>
                  <p className="text-gray-700">
                    Build a solid eventing foundation with daily sessions covering flatwork, gridwork, jumping technique and cross-country. You'll receive eight training sessions over five to six days, a training competition day and personalised feedback in small groups.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-xl font-semibold text-navy mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange" />
                    Behind-the-scenes Experiences
                  </h3>
                  <p className="text-gray-700">
                    Visit the yards of leading eventers, attend demonstrations and ask questions during intimate masterclasses. It's a rare chance to see how top riders train and care for their horses.
                  </p>
                </div>
                
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                  <h3 className="text-xl font-semibold text-navy mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange" />
                    Curated Sightseeing
                  </h3>
                  <p className="text-gray-700">
                    Between lessons you'll explore the Cotswolds – picture-perfect villages, historic manors, rolling countryside and cosy pubs. Optional extras include a stop at Clarkson's Farm and even a round of golf.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-xl font-semibold text-navy mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange" />
                    The Burghley Horse Trials
                  </h3>
                  <p className="text-gray-700">
                    Spend two full days at one of eventing's most iconic competitions, enjoying Cross-Country Day and the Showjumping Finale up close. Feel the buzz, watch the world's best and tick a bucket-list event off with new friends.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <img 
                  src={burghleyWaterImage} 
                  alt="Burghley Horse Trials water jump"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <img 
                  src={cotswoldsImage} 
                  alt="Beautiful Cotswolds village"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Meet Your Coach */}
        <section className="py-16 bg-navy text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={coachingImage} 
                  alt="Daniele Bizzarro coaching"
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
                  Meet Your Coach – Daniele Bizzarro
                </h2>
                <p className="text-white/90 mb-4">
                  Daniele Bizzarro is an Italian international event rider with a track record that speaks for itself. He represented Italy at the 2025 European Championships at Blenheim and has competed in numerous Nations Cup events.
                </p>
                <p className="text-white/90 mb-4">
                  Previously part of William Fox-Pitt's team, Dan now runs a thriving yard on the Gloucestershire/Oxfordshire border where he coaches riders at all levels. His Dan Bizzarro Method focuses on building confidence, harmony and partnership between horse and rider.
                </p>
                <p className="text-white/90">
                  Dan's approach is structured and supportive. He explains the why behind the exercises, sets progressive challenges and celebrates small wins. Riders from past tours rave about his ability to demystify complex skills and build confidence, whether you're perfecting your transitions or tackling your first cross-country combination.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy text-center mb-4">
              What's Included
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Your package fee covers almost everything so you can focus on riding and enjoying the experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                "Horse hire and stabling – well-trained horses matched to your level",
                "Eight training sessions with Dan Bizzarro and team",
                "Training competition day",
                "Two full days at the 2026 Burghley Horse Trials, including tickets and transfers",
                "Masterclasses & stable visits with top international riders",
                "Accommodation in charming Cotswolds lodging",
                "Daily breakfast plus welcome and farewell dinners",
                "Local transport, horse transport and facility hire",
                "Guided sightseeing and optional excursions",
                "GAT merchandise, groom support and the services of a Chef d'Equipe"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Flights and travel insurance are not included.
              </p>
              <div className="inline-flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-xl border-2 border-orange/20">
                <div className="text-center px-6">
                  <p className="text-sm text-gray-500 mb-1">Rider Packages</p>
                  <p className="text-2xl font-bold text-navy">£6,999 – £7,999</p>
                  <p className="text-xs text-gray-500">excluding flights</p>
                </div>
                <div className="hidden sm:block w-px bg-gray-200"></div>
                <div className="text-center px-6">
                  <p className="text-sm text-gray-500 mb-1">Supporter Packages</p>
                  <p className="text-2xl font-bold text-navy">£3,499 – £4,099</p>
                  <p className="text-xs text-gray-500">excluding flights</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Is This Tour For */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy mb-6">
                  Who Is This Tour For?
                </h2>
                <p className="text-gray-600 mb-6">
                  This experience is designed for a wide range of equestrians:
                </p>
                <ul className="space-y-4">
                  {[
                    "Amateur riders seeking professional coaching without the pressure of big-ticket competition",
                    "Aspiring eventers eager to sharpen their flat, show-jumping and cross-country skills under expert guidance",
                    "Seasoned riders looking for a fresh perspective and advanced exercises",
                    "Supporters and non-riders who want to accompany friends or family and enjoy the Cotswolds, masterclasses and Burghley spectacle",
                    "Adventurous families keen to combine riding with a holiday in one of England's most beautiful regions"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <img 
                  src={coachingImage2} 
                  alt="Coaching session"
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose GAT */}
        <section className="py-16 bg-emerald-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy mb-6">
              Why Choose Global Amateur Tour?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              GAT specialises in taking amateur riders to world-class venues, handling all the logistics so you can immerse yourself in training and exploration. Accommodation, horses, meals, transport and event tickets are arranged by the team, meaning all you need to do is arrive, ride, learn and enjoy. The tours maintain small groups to ensure individual attention and a supportive environment, and previous events have sold out quickly.
            </p>
          </div>
        </section>

        {/* Typical Day */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy text-center mb-12">
              What a Typical Day Looks Like
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center border-2 border-gray-100">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sun className="w-8 h-8 text-orange" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Morning Training</h3>
                  <p className="text-gray-600 text-sm">Flatwork, gymnastic grids or jumping exercises tailored to your level</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-100">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-8 h-8 text-orange" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Late Morning Break</h3>
                  <p className="text-gray-600 text-sm">Watch a demonstration or Q&A with Dan or a guest rider</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-100">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-orange" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Afternoon Session</h3>
                  <p className="text-gray-600 text-sm">Cross-country schooling or competition preparation</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-100">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-orange" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Evening</h3>
                  <p className="text-gray-600 text-sm">Explore a local village, visit a historic manor or simply relax at the hotel</p>
                </CardContent>
              </Card>
            </div>
            
            <p className="text-center text-gray-600 mt-8">
              <strong>Special days:</strong> Masterclasses, training competition day and the two days at Burghley are built into the schedule.
            </p>
          </div>
        </section>

        {/* London/England Image */}
        <section className="relative h-64 md:h-80">
          <img 
            src={londonImage} 
            alt="London, England"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/40"></div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold text-navy">
                  Do I need to bring my own horse?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  No. Quality horses suited to your ability are provided and their hire is included.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold text-navy">
                  What if I'm new to eventing?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Riders of all ages and experience levels are welcome. Dan's coaching and the small group format mean you'll get the support you need, whether you're cantering your first cross-country fences or refining your seat.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold text-navy">
                  Can supporters join without riding?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Absolutely. Many participants bring friends or family who enjoy the sightseeing, masterclasses and the Burghley Horse Trials. There are plenty of non-riding activities included.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold text-navy">
                  When should I book?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  The May tour sold out quickly and this September tour has limited spaces. Registering your interest now secures your place in the queue and ensures you receive the full application pack when registration opens.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-navy text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
              Ready to Ride?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              By combining personalised coaching, insider access and the electric atmosphere of the Burghley Horse Trials, the GAT UK Eventing Tour offers an equestrian adventure you'll talk about for years. We'd love to have you along.
            </p>
            <Button 
              onClick={handleRegisterInterest}
              className="bg-orange hover:bg-orange-hover text-white px-10 py-6 text-lg font-semibold rounded-xl"
              data-testid="button-register-interest-footer"
            >
              Register Your Interest
            </Button>
            <p className="text-white/70 mt-4 text-sm">
              Spots are limited and will be offered on a first-come, first-served basis.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
