import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Headphones, Check, Clock, MapPin, Wallet, RefreshCw, Play, ArrowRight, Star, Calendar } from "lucide-react";

export default function AudioLessons() {
  const testimonials = [
    {
      name: "Claire W.",
      content: "I can finally have a lesson whenever I want! No more waiting weeks for a slot or rushing to get to my trainer. I just pop in my earbuds and ride.",
      rating: 5
    },
    {
      name: "Hannah P.",
      content: "As a busy mum, finding time for lessons was impossible. Now I train with Dan's audio course during my morning rides. Game changer.",
      rating: 5
    },
    {
      name: "Katie R.",
      content: "I've spent so much money on lessons over the years. This audio course has given me more progress than months of weekly lessons.",
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: <Headphones className="w-8 h-8 text-orange" />,
      title: "Listen While You Ride",
      description: "Get real-time guidance through your earbuds while you're actually in the saddle. No more trying to remember what your instructor said last week."
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange" />,
      title: "No Booking Required",
      description: "Train whenever suits you — early morning, late evening, weekends. Your lesson is ready whenever you are, no scheduling required."
    },
    {
      icon: <Wallet className="w-8 h-8 text-orange" />,
      title: "No Weekly Fees",
      description: "Stop the constant drain of weekly lesson costs. Pay once, access forever. Get the same quality coaching without the ongoing expense."
    },
    {
      icon: <MapPin className="w-8 h-8 text-orange" />,
      title: "No Travel Needed",
      description: "Train at your own yard, your own arena, wherever you ride. Save the time, fuel, and stress of travelling to a trainer."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-orange" />,
      title: "Unlimited Replays",
      description: "Repeat any lesson as many times as you need. Master each exercise at your own pace without paying for another session."
    },
    {
      icon: <Clock className="w-8 h-8 text-orange" />,
      title: "Train On Your Schedule",
      description: "Whether you have 20 minutes before work or a full hour on Sunday — you decide when and how long you train."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Download the Lesson",
      description: "Access your audio lessons on your phone. They're designed to play through earbuds while you ride."
    },
    {
      step: "2",
      title: "Tack Up and Mount",
      description: "Get your horse ready as normal. Put in your earbuds (bone conduction headphones work brilliantly for safety)."
    },
    {
      step: "3",
      title: "Press Play and Ride",
      description: "I guide you through exercises in real time. Warm-up, main work, and cool-down — all spoken instructions while you ride."
    },
    {
      step: "4",
      title: "Repeat and Progress",
      description: "Replay lessons as often as you like. Each repetition builds muscle memory and deepens understanding for you and your horse."
    }
  ];

  const faqs = [
    {
      question: "Is it safe to use earbuds while riding?",
      answer: "Many riders use bone conduction headphones which sit outside your ears and allow you to hear your surroundings clearly. For arena work in a safe, controlled environment, regular earbuds at a sensible volume work fine. The lessons are designed for training at home or in safe settings — not for hacking on roads or in traffic."
    },
    {
      question: "Will this work for my level?",
      answer: "The 'From Strong to Light and Soft in 28 days' course is designed for riders who want to improve their horse's way of going, lighten the contact, and develop true self-carriage. Whether you're schooling at home, preparing for competition, or simply want a more enjoyable ride, the principles apply to all levels."
    },
    {
      question: "How is this different from watching training videos?",
      answer: "Videos require you to stop riding, watch, then try to remember what you saw. Audio lessons talk you through exercises in real time while you're actually doing them. It's like having a coach in your ear giving you feedback as you ride."
    },
    {
      question: "Can I download the lessons or do I need internet while riding?",
      answer: "You can download the lessons to your phone and listen offline. No internet needed while you're riding — perfect for yards with patchy signal."
    },
    {
      question: "What if I don't understand something or need help?",
      answer: "The lessons are designed to be clear and easy to follow. If you need additional support, you can always book a virtual lesson or attend one of my clinics to get personalised feedback on your progress."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Audio Lessons - Train While You Ride | Dan Bizzarro Method"
        description="Access expert horse training coaching through audio lessons you can listen to while riding. No booking, no travel, no weekly fees — just real-time guidance in your earbuds whenever you want."
        keywords="audio riding lessons, horse training audio course, listen while riding, equestrian audio lessons, Dan Bizzarro audio, online horse training, remote riding coaching"
        canonical="https://danbizzarromethod.com/coaching/audio-lessons"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-navy pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange/20 text-orange px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Headphones className="h-4 w-4" />
                <span>A New Way to Train</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
                Expert Coaching<br />
                <span className="text-orange">In Your Earbuds</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Listen to professional training guidance while you ride. No booking, no travel, no weekly fees — just real-time instruction whenever you want it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses/strong-horse-audio">
                  <Button 
                    className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
                    data-testid="button-hero-cta"
                  >
                    <Headphones className="mr-2 h-5 w-5" />
                    Try a Free Lesson
                  </Button>
                </Link>
                <Link href="/courses/strong-horse-audio">
                  <Button 
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
                    data-testid="button-hero-course"
                  >
                    View the 28-Day Course
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">From Strong to Light and Soft</p>
                    <p className="text-gray-400">28-Day Audio Course</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Day 1: Finding the Balance Point", "Day 2: Releasing the Poll", "Day 3: Softening the Jaw", "Day 4: Creating Forward Without Speed"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
                      <Play className="h-4 w-4 text-orange" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <span className="text-gray-400 text-sm">+ 24 more lessons</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-6">
            The Problem with Traditional Lessons
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            You love riding, but the traditional lesson model doesn't always fit modern life. Finding a slot, booking weeks ahead, driving to the trainer, paying £50-100 each time... and by the time you get home, you've forgotten half of what you learned. There has to be a better way.
          </p>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-navy mb-4">Audio Lessons Are the Solution</h3>
            <p className="text-gray-600">
              With audio lessons, the coaching comes to you. Pop in your earbuds, press play, and I'll guide you through exercises in real time while you ride. No scheduling. No travel. No ongoing costs. Just focused training whenever and wherever suits you.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
              Why Riders Love Audio Lessons
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              More flexibility, less expense, and coaching you can actually use while you're riding.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-navy mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">
              How Audio Lessons Work
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              It's as simple as pressing play. Here's what a typical session looks like.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white/10 rounded-xl p-6 h-full">
                  <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center text-white font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-orange/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Course Box */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy to-navy/90 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-2 text-orange mb-4">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-medium">Featured Course</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
                From Strong to Light and Soft<br />
                <span className="text-orange">in 28 Days</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Is your horse heavy in the hand, rushing, or leaning on the bit? This 28-day audio course guides you through a proven system to transform your horse's way of going — one ride at a time.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  "28 structured audio lessons",
                  "Listen while you ride",
                  "Progressive daily exercises",
                  "Develop true self-carriage",
                  "Lighten the contact naturally",
                  "Works for all disciplines"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses/strong-horse-audio">
                  <Button 
                    className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
                    data-testid="button-featured-course"
                  >
                    <Headphones className="mr-2 h-5 w-5" />
                    Start With a Free Lesson
                  </Button>
                </Link>
                <Link href="/courses/strong-horse-audio">
                  <Button 
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 text-lg rounded-xl w-full sm:w-auto"
                    data-testid="button-learn-more-course"
                  >
                    Learn More About the Course
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-8 text-center">
            What Riders Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{t.content}"</p>
                <p className="font-semibold text-navy text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-navy hover:text-orange">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Headphones className="h-12 w-12 text-orange mx-auto mb-6" />
          <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
            Ready to Try Audio Lessons?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Start with a free lesson from the "From Strong to Light and Soft" course. Experience what it's like to have expert coaching in your ear while you ride.
          </p>
          <Link href="/courses/strong-horse-audio">
            <Button 
              className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-10 text-lg rounded-xl"
              data-testid="button-final-cta"
            >
              <Headphones className="mr-2 h-5 w-5" />
              Get Your Free Audio Lesson
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
