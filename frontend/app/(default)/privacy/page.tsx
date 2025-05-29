/**
 * Privacy Policy Page Component
 * 
 * Displays the privacy policy of the application, including:
 * - Information collection and usage
 * - Data security measures
 * - Cookie policy
 * - Third-party services
 * - Children's privacy
 * - Policy updates
 * - Contact information
 * 
 * Features:
 * - Clean and organized layout
 * - Responsive design
 * - Clear section headings
 * - Interactive elements (email link)
 */

export const metadata = {
  title: "Privacy Policy - AiTripPlanner",
  description: "Our privacy policy.",
};

/**
 * PrivacyPage Component
 * 
 * Renders the privacy policy page with sections covering:
 * 1. Introduction
 * 2. Information Collection and Use
 * 3. How We Use Your Information
 * 4. Log Data
 * 5. Cookies
 * 6. Data Security
 * 7. Third-Party Services
 * 8. Children's Privacy
 * 9. Changes to Privacy Policy
 * 10. Contact Information
 * 
 * Each section provides detailed information about our data handling practices
 * and user privacy protections.
 */
export default function PrivacyPage() {
  return (
    <section className="relative bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">Privacy Policy</h1>
            <div className="space-y-6 text-gray-700">
              <h2 className="text-2xl font-semibold">Introduction</h2>
              <p>
                AiTripPlanner ("us", "we", or "our") operates the AiTripPlanner website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>

              <h2 className="text-2xl font-semibold">Information Collection and Use</h2>
              <p>
                We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, personal identification information (if provided, e.g., during account creation - though current implementation might not require it), usage data, and cookies.
              </p>

              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <p>
                AiTripPlanner uses the collected data for various purposes:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service when you choose to do so (e.g., saving trips)</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>

              <h2 className="text-2xl font-semibold">Log Data</h2>
              <p>
                We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
              </p>

              <h2 className="text-2xl font-semibold">Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information (e.g., session information for logged-in users). Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some features of our Service may not function properly.
              </p>

              <h2 className="text-2xl font-semibold">Data Security</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data (if any is collected), we cannot guarantee its absolute security.
              </p>

              <h2 className="text-2xl font-semibold">Third-Party Services</h2>
              <p>
                Our Service uses third-party services like Google Places API and Gemini API. These services have their own privacy policies, and we encourage you to review them. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
              </p>

              <h2 className="text-2xl font-semibold">Children's Privacy</h2>
              <p>
                Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
              </p>

              <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>

              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:lidorpahima28@gmail.com" className="text-blue-600 hover:underline">lidorpahima28@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 