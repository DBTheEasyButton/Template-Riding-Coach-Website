import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle, Mail } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function StrongHorseGuide() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
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

  return (
    <>
      <SEOHead
        title="The Strong Horse Solution - Free Training Guide | Dan Bizzarro Method"
        description="Learn how to turn a heavy, rushing horse into a soft, balanced partner. Free downloadable guide with practical exercises for riders of all levels."
        canonical="/guides/strong-horse"
      />
      <Navigation />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-orange/10 text-orange px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  Free Training Guide
                </span>
                <h1 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
                  The Strong Horse Solution
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  How to turn heaviness and rushing into balance, softness and control
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Understand why your horse gets strong — and how to fix it</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Simple warm-up system to create softness before every ride</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">4 core flatwork exercises that build self-carriage</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Specific techniques for jumping a strong horse safely</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">90-second competition reset when things go wrong</p>
                  </div>
                </div>

                <div className="bg-navy/5 rounded-lg p-4 border-l-4 border-orange">
                  <p className="text-gray-700 italic">
                    "A strong horse doesn't become light by being held. It becomes light when the communication becomes clear."
                  </p>
                  <p className="text-navy font-semibold mt-2">— Dan Bizzarro</p>
                </div>
              </div>

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
                        Download Free Guide
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-navy">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-playfair font-bold text-white mb-4">
              Ready to Work on Your Strong Horse in Person?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join me for a clinic or book a private lesson and we'll transform your horse's balance and responsiveness together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/coaching/clinics">
                <Button className="bg-orange hover:bg-orange-hover text-white px-8 py-3">
                  View Upcoming Clinics
                </Button>
              </Link>
              <Link href="/coaching/private-lessons">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-navy px-8 py-3">
                  Book a Private Lesson
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
