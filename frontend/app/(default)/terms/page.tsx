/**
 * Terms of Service Page Component
 * 
 * Displays the terms of service of the application, including:
 * - Terms acceptance
 * - Use license
 * - Disclaimers
 * - Limitations
 * - Revisions and errata
 * - External links policy
 * - Terms modifications
 * - Governing law
 * - Contact information
 * 
 * Features:
 * - Clean and organized layout
 * - Responsive design
 * - Clear section headings
 * - Interactive elements (email link)
 */

export const metadata = {
  title: "Terms of Service - AiTripPlanner",
  description: "Our terms of service.",
};

/**
 * TermsPage Component
 * 
 * Renders the terms of service page with sections covering:
 * 1. Acceptance of Terms
 * 2. Use License
 * 3. Disclaimer
 * 4. Limitations
 * 5. Revisions and Errata
 * 6. Links
 * 7. Site Terms of Use Modifications
 * 8. Governing Law
 * 9. Contact Information
 * 
 * Each section provides detailed information about the terms and conditions
 * governing the use of our service.
 */
export default function TermsPage() {
  return (
    <section className="relative bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">Terms of Service</h1>
            <div className="space-y-6 text-gray-700">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing and using AiTripPlanner (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this Service.
              </p>

              <h2 className="text-2xl font-semibold">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on AiTripPlanner's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on the Service;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
              <p>
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by AiTripPlanner at any time.
              </p>

              <h2 className="text-2xl font-semibold">3. Disclaimer</h2>
              <p>
                The materials on AiTripPlanner's website are provided "as is". AiTripPlanner makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-semibold">4. Limitations</h2>
              <p>
                In no event shall AiTripPlanner or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AiTripPlanner's website, even if AiTripPlanner or an AiTripPlanner authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h2 className="text-2xl font-semibold">5. Revisions and Errata</h2>
              <p>
                The materials appearing on AiTripPlanner's website could include technical, typographical, or photographic errors. AiTripPlanner does not warrant that any of the materials on its website are accurate, complete, or current. AiTripPlanner may make changes to the materials contained on its website at any time without notice.
              </p>

              <h2 className="text-2xl font-semibold">6. Links</h2>
              <p>
                AiTripPlanner has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AiTripPlanner of the site. Use of any such linked website is at the user's own risk.
              </p>

              <h2 className="text-2xl font-semibold">7. Site Terms of Use Modifications</h2>
              <p>
                AiTripPlanner may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
              </p>

              <h2 className="text-2xl font-semibold">8. Governing Law</h2>
              <p>
                Any claim relating to AiTripPlanner's website shall be governed by the laws of [Your Jurisdiction - Placeholder] without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:lidorpahima28@gmail.com" className="text-blue-600 hover:underline">lidorpahima28@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 