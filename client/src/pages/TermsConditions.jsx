import React from 'react';
import { motion } from 'framer-motion';

function TermsConditions() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600 mb-8">Last Updated: November 10, 2024</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using the Bowtie Kreative Digital Marketing Audit Platform ("Service"), you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these Terms and Conditions, please do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Bowtie Kreative provides a digital marketing audit platform that analyzes your business's online presence and generates personalized reports with recommendations. The Service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Free digital marketing audit assessment</li>
                <li>Automated report generation and scoring</li>
                <li>Personalized recommendations</li>
                <li>Email delivery of audit reports</li>
                <li>Optional strategy consultation services (separate fee applies)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Obligations</h2>
              <p className="text-gray-700 mb-4">By using our Service, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to interfere with or disrupt the Service</li>
                <li>Not use automated systems to access the Service without permission</li>
                <li>Not impersonate any person or entity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-4">
                All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Bowtie Kreative and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700 mb-4">
                The audit reports generated for you are for your personal business use only and may not be resold, redistributed, or used for commercial purposes without express written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy and Limitations of Service</h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide accurate and helpful insights, the audit reports and recommendations are:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Generated automatically based on the information you provide</li>
                <li>General recommendations and not professional advice specific to your situation</li>
                <li>Subject to limitations based on automated analysis</li>
                <li>Not a substitute for professional marketing consultation</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We do not guarantee specific results or outcomes from implementing our recommendations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our Service may contain links to third-party websites or services (such as booking platforms) that are not owned or controlled by Bowtie Kreative. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Payment Terms (Strategy Calls)</h2>
              <p className="text-gray-700 mb-4">
                Strategy consultation services are offered at $250 per session. Payment terms include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Payment is required at the time of booking</li>
                <li>Cancellations must be made at least 24 hours in advance for a full refund</li>
                <li>No-shows or late cancellations forfeit the full payment</li>
                <li>Services are non-transferable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 mb-4">
                We do not warrant that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>The Service will meet your specific requirements</li>
                <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                <li>The results obtained from using the Service will be accurate or reliable</li>
                <li>Any errors in the Service will be corrected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                IN NO EVENT SHALL BOWTIE KREATIVE, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any interruption or cessation of transmission to or from the Service</li>
                <li>Any bugs, viruses, or other harmful code</li>
                <li>Any errors or omissions in any content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to defend, indemnify, and hold harmless Bowtie Kreative and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Bowtie Kreative operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
              <p className="text-gray-700 mb-4">
                These Terms constitute the entire agreement between you and Bowtie Kreative regarding the use of the Service and supersede all prior and contemporaneous written or oral agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="text-gray-700"><strong>Bowtie Kreative</strong></p>
                <p className="text-gray-700">Email: ryan@bowtiekreative.com</p>
                <p className="text-gray-700">Website: https://audit.bowtiekreative.com</p>
              </div>
            </section>

            <section className="mb-8">
              <p className="text-gray-700 italic">
                By using the Bowtie Kreative Digital Marketing Audit Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TermsConditions;
