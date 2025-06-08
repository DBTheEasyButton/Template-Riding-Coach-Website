import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button 
              onClick={goBack}
              variant="outline"
              className="mb-4 border-navy text-navy hover:bg-navy hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-playfair font-bold text-navy mb-4">Clinic Terms and Conditions</h1>
            <div className="w-24 h-1 bg-orange"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-dark leading-relaxed mb-6">
              Please read the following Terms and Conditions carefully before participating in the Show Jumping and Cross Country Clinic ("the Clinic") organized by Dan Bizzarro.
            </p>
            
            <p className="text-lg text-dark leading-relaxed mb-8 font-medium">
              By registering for and participating in the Clinic, you acknowledge and agree to these Terms and Conditions.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Clinic Operations</h2>
                <p className="text-dark leading-relaxed mb-4">
                  Clinics organised by Dan Bizzarro will go ahead as long as conditions are safe. Riders will be informed by email, text or telephone if a clinic has to be cancelled. If the trainer has to cancel a clinic at late notice, clinic fees will be refunded less an £8 administration fee.
                </p>
                <p className="text-dark leading-relaxed mb-4">
                  If a rider has to pull out of a clinic Dan will do his best to find a suitable replacement from the wait list (if applicable). If, however, this is not possible, the rider will forfeit their fee unless they can find a substitute for their place. All substituted riders must supply their name/address and payment and sign a disclaimer before they can be admitted to the clinic.
                </p>
                <p className="text-dark leading-relaxed">
                  All clinics organised by Dan Bizzarro must be paid for at the time of booking to ensure that a space is reserved. When booking, the bookee signs the Disclaimer for all the riders booking on to the clinic. He/she should ensure that riders are aware of and agree with the terms of the Disclaimer.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Preparation Requirements</h2>
                <p className="text-dark leading-relaxed">
                  Riders should turn up for their clinic in good time to prepare and be correctly turned out with correct body protector, hat, boots etc, and their horse suitably ready to start jumping at the allocated time, unless other instructions have been issued.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Assumption of Risk</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">a. Inherent Risks</h3>
                    <p className="text-dark leading-relaxed">
                      Participation in the Clinic involves inherent risks, including but not limited to falls, collisions, injuries, and accidents. By attending the Clinic, all participants, including riders, helpers, and spectators, assume full responsibility for any potential risks involved.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">b. Risk Assessment</h3>
                    <p className="text-dark leading-relaxed">
                      It is mandatory for every person entering the Clinic to conduct their own risk assessment of the clinic's location. This assessment should take into account factors such as terrain, weather conditions, and the presence of obstacles. Participants are solely responsible for their decision to participate based on their assessment.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">c. Facility Inspection</h3>
                    <p className="text-dark leading-relaxed">
                      It is a condition of riding that riders and their owners/trainers/parents (if the rider is under 18) and accompanying personnel have inspected the conditions and facilities prior to riding and that they are content that the ground conditions, and the construction and maintenance of the facilities and jumps are safe and acceptable to them. The owners of the facilities and Dan Bizzarro are not responsible for the ground conditions or damage caused to the ground or fences.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">d. Supervision</h3>
                    <p className="text-dark leading-relaxed">
                      All riders must be accompanied by another responsible adult (who can also be riding) and we recommend that each rider carries a mobile phone.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">e. Dogs</h3>
                    <p className="text-dark leading-relaxed">
                      Dogs are permitted if kept on a short lead at all times and under direct control. All dog mess must be cleared up immediately. Anyone found to be leaving dog poo-bags on or around the jumps will be asked to leave. Any dog that barks at horses or people and causes a nuisance must be removed immediately from the facilities.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">f. Working Farm Environment</h3>
                    <p className="text-dark leading-relaxed">
                      The clinics could be run in a working farm. As such, it has personnel, livestock and machinery on the premises. All users of the facilities and their connections agree to be aware of the risks associated with a working farm and to act accordingly.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">g. Minors</h3>
                    <p className="text-dark leading-relaxed">
                      Every rider under the age of 18 must be accompanied by a parent or a responsible adult.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Liability Release</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">a. Limited Liability</h3>
                    <p className="text-dark leading-relaxed">
                      Dan Bizzarro and any associated instructors, staff, or volunteers shall not be held responsible or liable for any accidents, injuries, losses, damages, or claims arising from or related to the Clinic.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">b. Waiver of Claims</h3>
                    <p className="text-dark leading-relaxed">
                      By participating in the Clinic, participants waive any and all claims, demands, and causes of action against Dan Bizzarro, his representatives, or any associated personnel, arising out of or in connection with the Clinic.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Safety Requirements</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">a. Safety Guidelines</h3>
                    <p className="text-dark leading-relaxed">
                      All participants are expected to adhere to safety guidelines and instructions provided by Dan Bizzarro and his representatives during the Clinic.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">b. Protective Equipment</h3>
                    <p className="text-dark leading-relaxed">
                      Riders must wear appropriate protective gear, including but not limited to helmets and body protectors, and ensure their horses are adequately equipped for the activities involved.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">c. Responsible Behavior</h3>
                    <p className="text-dark leading-relaxed">
                      All riders, spectators and accompanying people must behave responsibly and not cause a nuisance to other users of the facilities. Riders should ensure that consideration and due care is given to other users when riding on the flat and over jumps, and in the parking area.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Medical Conditions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">a. Fitness Requirements</h3>
                    <p className="text-dark leading-relaxed">
                      Participants must ensure they are physically and mentally fit to engage in the activities of the Clinic. It is the responsibility of each participant to consult with a medical professional to determine their suitability for participation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">b. Medical Disclosure</h3>
                    <p className="text-dark leading-relaxed">
                      Participants must disclose any known medical conditions, allergies, or other pertinent health information that may affect their ability to participate safely in the Clinic.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Personal Property</h2>
                <p className="text-dark leading-relaxed">
                  Dan Bizzarro and his representatives will not be liable for any loss, damage, or theft of personal property brought to the Clinic by participants or spectators.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Photography and Publicity</h2>
                <p className="text-dark leading-relaxed">
                  By participating in the Clinic, participants grant Dan Bizzarro and his representatives the right to capture and use photographs or videos of the Clinic for promotional or educational purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Changes and Cancellations</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">a. Schedule Modifications</h3>
                    <p className="text-dark leading-relaxed">
                      Dan Bizzarro reserves the right to modify the Clinic schedule, location, or activities due to unforeseen circumstances. Participants will be notified of any changes as soon as possible.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">b. Refund Policy</h3>
                    <p className="text-dark leading-relaxed">
                      In the event of a cancellation by Dan Bizzarro, participants will be entitled to a refund of any registration fees paid less an £8 administration fee.
                    </p>
                  </div>
                </div>
              </section>

              <div className="bg-navy/10 p-6 rounded-xl mt-8">
                <p className="text-navy font-semibold text-lg">
                  By participating in the Clinic, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}