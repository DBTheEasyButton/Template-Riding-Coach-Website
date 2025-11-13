import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Clinic Terms & Conditions | Dan Bizzarro Method"
        description="Review our clinic terms and conditions including registration, payment, cancellation policy, safety requirements, and liability information for Dan Bizzarro Method equestrian clinics."
        keywords="clinic terms, booking policy, cancellation policy, equestrian clinic terms, Dan Bizzarro clinics, safety requirements"
        canonical="https://danbizzarromethod.com/terms-and-conditions"
      />
      <Navigation />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-navy mb-8">Clinic Terms and Conditions</h1>
          
          <div className="space-y-8 text-gray-700">
            {/* Registration and Payment */}
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">Registration and Payment</h2>
              <ul className="space-y-3 list-disc ml-6">
                <li>All clinic registrations must be completed online with full payment at the time of booking.</li>
                <li>Clinic places are allocated on a first-come, first-served basis upon receipt of payment.</li>
                <li>Payment must be made by debit or credit card through our secure payment system.</li>
                <li>Registration confirmation will be sent via email within 24 hours of payment.</li>
                <li>Clinic fees are non-refundable once payment is confirmed, except under the specific circumstances outlined in our cancellation policy.</li>
              </ul>
            </section>

            {/* Cancellation Policy */}
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">Cancellation and Refund Policy</h2>
              <div className="bg-orange/10 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-orange mb-3">Important: No Self-Cancellation After Payment</h3>
                <p className="text-sm">
                  Once your clinic registration is confirmed and paid, you cannot cancel your booking through the online system. 
                  All cancellation requests must be made directly by contacting Dan Bizzarro Method.
                </p>
              </div>
              <ul className="space-y-3 list-disc ml-6">
                <li><strong>Participant-Initiated Cancellations:</strong> Refunds may be considered at the sole discretion of Dan Bizzarro Method under the following conditions:
                  <ul className="mt-2 space-y-2 list-disc ml-6">
                    <li>Cancellation request is made more than 7 days before the clinic start date</li>
                    <li>If there is a waiting list, your place can be filled by another participant</li>
                    <li>All refund requests must be made by email to dan@danbizzarromethod.com with a valid reason</li>
                  </ul>
                </li>
                <li><strong>Within 7 Days of Clinic:</strong> No refunds will be provided for cancellations made within 7 days of the clinic start date, regardless of circumstances.</li>
                <li><strong>Clinic Cancellation by Dan Bizzarro Method:</strong> In the unlikely event that we need to cancel a clinic, participants will receive a full refund or the option to transfer to another available clinic.</li>
                <li><strong>Weather Conditions:</strong> Clinics may proceed in light rain. In cases of severe weather that pose safety risks, the clinic may be rescheduled, and participants will be offered alternative dates or a full refund.</li>
              </ul>
            </section>

            {/* Health and Safety */}
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">Health and Safety</h2>
              <ul className="space-y-3 list-disc ml-6">
                <li>All participants must wear appropriate safety equipment including a properly fitted riding helmet that meets current safety standards (PAS 015 or equivalent).</li>
                <li>Body protectors are mandatory for cross-country sessions and recommended for jumping sessions.</li>
                <li>Participants must disclose any medical conditions or medications that may affect their ability to participate safely.</li>
                <li>Emergency contact information must be provided and kept up to date.</li>
                <li>Participants ride at their own risk and must have appropriate insurance coverage.</li>
                <li>The instructor reserves the right to exclude any participant who is deemed unsafe or disruptive.</li>
              </ul>
            </section>

            {/* Horse Requirements */}
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">Horse Requirements</h2>
              <ul className="space-y-3 list-disc ml-6">
                <li>Horses must be suitable for the level of training being undertaken.</li>
                <li>All horses must have current vaccinations and be in good health.</li>
                <li>Horses showing signs of illness or lameness will not be permitted to participate.</li>
                <li>Appropriate tack must be used and be in good repair.</li>
                <li>The instructor may recommend adjustments to tack or equipment for safety reasons.</li>
              </ul>
            </section>

            {/* Liability and Insurance */}
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">Liability and Insurance</h2>
              <ul className="space-y-3 list-disc ml-6">
                <li>Equestrian activities carry inherent risks. Participants acknowledge and accept these risks.</li>
                <li>Dan Bizzarro Method, its instructors, and venue owners will not be liable for any injury, loss, or damage to persons, horses, or property.</li>
                <li>Participants are strongly advised to have personal accident and public liability insurance.</li>
                <li>Professional indemnity insurance is in place for instruction provided.</li>
              </ul>
            </section>

            {/* Clinic Conduct */}
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">Clinic Conduct</h2>
              <ul className="space-y-3 list-disc ml-6">
                <li>Participants must arrive on time and prepared for their session.</li>
                <li>Mobile phones should be switched off or on silent during sessions.</li>
                <li>Spectators are welcome but must remain in designated areas.</li>
                <li>Alcohol consumption is prohibited on clinic premises.</li>
                <li>Smoking is not permitted in any buildings or near horses.</li>
              </ul>
            </section>

            {/* Data Protection and Privacy - UK GDPR */}
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">Data Protection and Privacy (UK GDPR)</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-navy mb-3">Your Consent and Rights</h3>
                <p className="text-sm mb-3">
                  By accepting these terms and conditions and registering for our clinics, you provide explicit consent for the following data processing activities in accordance with UK GDPR regulations:
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-navy mb-3">Email Marketing and Communications</h4>
                  <ul className="space-y-2 list-disc ml-6 text-sm">
                    <li>Your email address and personal details will be automatically added to our mailing list</li>
                    <li>We will send you newsletters, clinic announcements, training tips, and promotional content</li>
                    <li>You consent to receive marketing communications via email from Dan Bizzarro Method</li>
                    <li>You can unsubscribe from marketing emails at any time using the unsubscribe link in any email</li>
                    <li>Your data may be used for targeted marketing based on your interests and clinic participation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-navy mb-3">Photography and Video Usage Rights</h4>
                  <ul className="space-y-2 list-disc ml-6 text-sm">
                    <li>During clinics, photographs and videos may be taken for promotional and educational purposes</li>
                    <li>You consent to Dan Bizzarro Method using your image and likeness in photographs and videos</li>
                    <li>These images and videos may be used on social media platforms including but not limited to Instagram, Facebook, YouTube, and TikTok</li>
                    <li>Images may also be used on our website, in marketing materials, and promotional content</li>
                    <li>No additional compensation will be provided for the use of your image</li>
                    <li>If you do not wish to be photographed or filmed, please inform Dan at the start of the clinic</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-navy mb-3">Data Processing and Storage</h4>
                  <ul className="space-y-2 list-disc ml-6 text-sm">
                    <li>Personal information collected during registration will be used for clinic management, communication, and marketing purposes</li>
                    <li>Your data will be stored securely and processed in accordance with UK GDPR requirements</li>
                    <li>We will not share your personal information with third parties for their marketing purposes without explicit consent</li>
                    <li>Medical information provided will be kept confidential and only shared with qualified first aiders or medical professionals in case of emergency</li>
                    <li>Emergency contact information may be shared with venue staff and emergency services if required</li>
                    <li>Data retention: Your personal data will be retained for up to 7 years for business and legal compliance purposes</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-navy mb-3">Your GDPR Rights</h4>
                  <ul className="space-y-2 list-disc ml-6 text-sm">
                    <li><strong>Right to Access:</strong> You can request a copy of all personal data we hold about you</li>
                    <li><strong>Right to Rectification:</strong> You can request correction of inaccurate personal data</li>
                    <li><strong>Right to Erasure:</strong> You can request deletion of your personal data (subject to legal obligations)</li>
                    <li><strong>Right to Restrict Processing:</strong> You can request limitation of how we process your data</li>
                    <li><strong>Right to Data Portability:</strong> You can request transfer of your data to another service</li>
                    <li><strong>Right to Object:</strong> You can object to processing of your data for marketing purposes</li>
                    <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent at any time (this won't affect previous processing)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-navy mb-2">Data Controller Contact</h4>
                  <p className="text-sm">
                    Dan Bizzarro Method is the data controller for your personal information. 
                    To exercise any of your GDPR rights or for data protection queries, contact:
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Email:</strong> dan@danbizzarromethod.com<br/>
                    <strong>Phone:</strong> +44 7767 291713
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="mb-2">For any questions about these terms or to make a cancellation request:</p>
                <p className="font-semibold">Email: dan@danbizzarromethod.com</p>
                <p className="font-semibold">Phone: +44 7767 291713</p>
                <p className="text-sm mt-4 text-gray-600">
                  By registering for a clinic, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
}