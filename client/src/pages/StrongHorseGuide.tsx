import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left hover:text-orange transition-colors"
      >
        <span className="font-semibold text-navy">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

function LeadCaptureForm({ variant = "default" }: { variant?: "default" | "compact" }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your free guide.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead-capture/strong-horse-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "The-Strong-Horse-Solution-Dan-Bizzarro.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Your Guide is Downloading!",
        description: "Check your downloads folder for 'The Strong Horse Solution'.",
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setMobile("");
    } catch (error) {
      console.error("Lead capture error:", error);
      toast({
        title: "Something Went Wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-strong-horse-firstname-compact"
            className="border-gray-300"
          />
          <Input
            type="text"
            placeholder="Surname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-strong-horse-lastname-compact"
            className="border-gray-300"
          />
        </div>
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          data-testid="input-strong-horse-email-compact"
          className="border-gray-300"
        />
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          disabled={isSubmitting}
          data-testid="input-strong-horse-mobile-compact"
          className="border-gray-300"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3"
          data-testid="button-download-strong-horse-pdf-compact"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download the Free Guide
            </>
          )}
        </Button>
      </form>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange/10 rounded-full mb-4">
          <Download className="h-8 w-8 text-orange" />
        </div>
        <h2 className="text-2xl font-playfair font-bold text-navy">
          Get Your Free Guide
        </h2>
        <p className="text-gray-600 mt-2">
          Enter your details below and I'll send you the guide right away.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-navy font-medium">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-strong-horse-firstname"
            className="border-gray-300 focus:border-navy focus:ring-navy"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-navy font-medium">
            Surname
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your surname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-strong-horse-lastname"
            className="border-gray-300 focus:border-navy focus:ring-navy"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-navy font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-strong-horse-email"
            className="border-gray-300 focus:border-navy focus:ring-navy"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-navy font-medium">
            Mobile Number
          </Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-strong-horse-mobile"
            className="border-gray-300 focus:border-navy focus:ring-navy"
          />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <Mail className="h-4 w-4 text-navy mt-0.5 flex-shrink-0" />
            <span>Your details are safe with me. I'll only use them to send you helpful training tips and updates about clinics.</span>
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 rounded-lg transition-all duration-300"
          data-testid="button-download-strong-horse-pdf"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Your Guide...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download the Free Guide
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default function StrongHorseGuide() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <SEOHead
        title="The Strong Horse Solution - Free Training Guide | Dan Bizzarro Method"
        description="Turn your strong, heavy or rushing horse into a softer, lighter, more rideable partner. Free downloadable guide with practical exercises for riders of all levels."
        canonical="/guides/strong-horse"
      />
      <Navigation />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        
        {/* HERO SECTION */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-orange/10 text-orange px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  Free Training Guide
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6 leading-tight">
                  Turn Your Strong, Heavy or Rushing Horse Into a Softer, Lighter, More Rideable Partner
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  A simple, practical guide that shows you exactly how to change a strong horse on the flat and over fences — without pulling, fighting, or feeling out of control.
                </p>
                
                <div className="hidden lg:block">
                  <div className="bg-navy/5 rounded-lg p-4 border-l-4 border-orange">
                    <p className="text-gray-700 italic">
                      "A strong horse doesn't become light by being held. It becomes light when the communication becomes clear."
                    </p>
                    <p className="text-navy font-semibold mt-2">— Dan Bizzarro</p>
                  </div>
                </div>
              </div>

              <LeadCaptureForm />
            </div>
          </div>
        </section>

        {/* SECTION 1: THE PROBLEM */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-6 text-center">
              If your horse feels strong, heavy or rushing… you're not alone.
            </h2>
            <p className="text-gray-600 text-lg text-center mb-8">
              Many riders deal with horses who lean, pull, run through the hand, get quick before or after jumps, or feel strong the moment they get tense. This isn't because you're doing something wrong — it's because your horse is struggling to find balance and understand what's expected.
            </p>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-navy mb-6">Common frustrations:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "A horse that gets stronger the more you try to slow them",
                  "Leaning on the reins or becoming \"heavy\" in your hand",
                  "Rushing into or after fences",
                  "Ignoring half-halts or not reacting to transitions",
                  "Feeling out of control in the canter",
                  "Struggling to keep rhythm and straightness"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-navy font-semibold text-lg">
                  You're the hero in this story.
                </p>
                <p className="text-gray-600 mt-2">
                  Your horse just needs a clearer system — and that's what this guide gives you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHAT THE GUIDE TEACHES */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-6 text-center">
              A proven, step-by-step method to create balance, softness and control
            </h2>
            <p className="text-gray-600 text-lg text-center mb-10">
              This guide shows you exactly how I take a strong, heavy horse and turn it into a soft, adjustable, easy-to-ride partner. It comes directly from the Dan Bizzarro Method and from the work I do every day with riders who face the same challenges you do.
            </p>
            
            <div className="bg-navy rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6 text-orange">What's inside the guide:</h3>
              <div className="space-y-4">
                {[
                  "Why strong horses lean, rush or pull — and how to fix it",
                  "How to create self-carriage without pulling",
                  "A simple warm-up routine that instantly reduces heaviness",
                  "The 5-Second Transition system for balance and control",
                  "GO/WOAH exercises that improve adjustability in trot and canter",
                  "How to improve straightness and rhythm (the real key to softness)",
                  "The \"Black or White\" reaction test for instant lightness",
                  "A full jumping framework for strong horses",
                  "A 90-second reset to use at competitions",
                  "Troubleshooting for real riding problems"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-orange flex-shrink-0 mt-0.5" />
                    <p className="text-gray-100">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <p className="text-xl font-semibold text-white">
                  Clear steps. Simple language. Instant results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: WHY THIS WORKS */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-6 text-center">
              A method built for everyday riders — not just professionals
            </h2>
            <p className="text-gray-600 text-lg text-center mb-8">
              I've coached thousands of riders dealing with strong, heavy and rushing horses. The solution is never more force, more pulling, or stronger bits. The solution is clarity, balance, rhythm and better reactions — the pillars of the Dan Bizzarro Method.
            </p>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border-l-4 border-orange">
              <p className="text-gray-700 mb-4">
                As an international event rider and coach, I've spent more than 20 years helping riders develop horses who are softer, lighter and more confident. This guide gives you the same simple tools I use in my lessons every day.
              </p>
              <div className="mt-6 space-y-2 text-navy font-semibold">
                <p>You don't need to be braver.</p>
                <p>You don't need to fight harder.</p>
                <p>You just need a clearer system — and your horse will thank you for it.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: TRANSFORMATION */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-10 text-center">
              Imagine riding a horse who stays soft, balanced and adjustable
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="text-2xl">🙋</span> Rider transformation:
                </h3>
                <div className="space-y-3">
                  {[
                    "You feel calmer and more in control",
                    "You know exactly what to do when the horse gets strong",
                    "You spend less time fighting and more time actually riding",
                    "Your aids feel clearer and more effective",
                    "Your confidence improves because the horse becomes predictable"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="text-2xl">🐴</span> Horse transformation:
                </h3>
                <div className="space-y-3">
                  {[
                    "Softer neck",
                    "Lighter contact",
                    "Better balance",
                    "More responsiveness",
                    "More adjustability",
                    "Less rushing, leaning and pulling"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-center text-xl font-semibold text-navy mt-10">
              This is the difference between surviving a ride… and enjoying it.
            </p>
          </div>
        </section>

        {/* SECTION 5: CTA */}
        <section className="py-16 bg-orange">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-playfair font-bold text-white mb-6">
              Ready to make your strong horse easier, softer and more enjoyable to ride?
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <LeadCaptureForm variant="compact" />
            </div>
            <div className="mt-6">
              <Link href="/coaching/private-lessons">
                <Button variant="outline" className="border-navy bg-white text-navy hover:bg-navy hover:text-white">
                  Or Book a Lesson
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6: FAQ */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
              <FAQItem
                question="Does this work for mares/geldings/young horses?"
                answer="Yes. Strong behaviour is a balance problem, not a personality problem. The exercises work for all horses."
              />
              <FAQItem
                question="Do I need to be an experienced rider to use this guide?"
                answer="No. Everything is written in simple steps. If you can ride walk, trot and canter, you can use the system."
              />
              <FAQItem
                question="Does this replace having lessons?"
                answer="No — but it will make every lesson easier, clearer and more productive."
              />
            </div>
          </div>
        </section>

        {/* SECTION 7: FINAL CTA */}
        <section className="py-16 bg-navy">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-playfair font-bold text-white mb-8">
              Take the first step toward a lighter, more rideable horse
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <LeadCaptureForm variant="compact" />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
