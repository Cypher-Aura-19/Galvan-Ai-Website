import React from 'react';
import { ArrowLeft, Shield, Calendar } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="w-full px-8 py-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-gray-300 hover:text-white mb-6 transition-colors group bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-barlow text-white mb-2">Privacy Policy</h1>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">Last updated: August 8, 2025</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <p className="text-xl text-gray-300 leading-relaxed">
              At Galvan AI, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains the limited circumstances in which we collect information, how we use it, and how we safeguard it.
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="w-full px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-xl font-bold text-white mb-6">Table of Contents</h3>
                <nav className="space-y-2">
                  {[
                    'Introduction',
                    'Information We Collect',
                    'How We Use Your Information',
                    'Cookies and Tracking Technologies',
                    'Data Sharing',
                    'Data Security',
                    'Your Rights',
                    'Data Retention',
                    'Changes to This Policy',
                    'Contact Information'
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={`#section-${index + 1}`}
                      className="block text-gray-400 hover:text-white transition-colors py-1 text-sm"
                    >
                      {index + 1}. {item}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-12">
                <section id="section-1" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Introduction
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      Galvan AI ("we," "our," or "us") provides SaaS development and software services. We collect very limited information, only when necessary to respond to your requests or provide you with our services.
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-4 mt-6">
                      <p className="text-white font-medium mb-2">Key Points:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• We only collect personal data you voluntarily provide.</li>
                        <li>• We do not sell your data.</li>
                        <li>• No data is ever used to train AI models.</li>
                        <li>• We follow applicable data protection laws.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="section-2" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Information We Collect
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      We only collect information in the following situations:
                    </p>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">2.1 Career Applications</h3>
                      <p className="text-gray-300">
                        Name, email, phone number, résumé, and other details you provide when applying for a role.
                      </p>
                    </div>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">2.2 Newsletter Subscription</h3>
                      <p className="text-gray-300">
                        Email address you submit when signing up for our newsletter.
                      </p>
                    </div>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">2.3 Contact Requests</h3>
                      <p className="text-gray-300">
                        Name, company name, and description of your request when you ask for a call, a quote, or send us a message.
                      </p>
                    </div>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">2.4 Basic Website Data</h3>
                      <p className="text-gray-300">
                        Standard information automatically collected when you visit our website, including IP address, browser type, operating system, referring URL, and pages viewed.
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                      <p className="text-white font-medium">Note: None of the above information is used for AI training.</p>
                    </div>
                  </div>
                </section>

                <section id="section-3" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    How We Use Your Information
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      We use the collected information to:
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <ul className="text-gray-300 space-y-2">
                        <li>• Respond to inquiries and requests</li>
                        <li>• Provide requested services or information</li>
                        <li>• Process and evaluate career applications</li>
                        <li>• Send newsletters (only if you subscribed)</li>
                        <li>• Maintain and improve our website</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="section-4" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Cookies and Tracking Technologies
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      Our website may use cookies and analytics tools to improve your experience and track website performance. These tools collect general, non-identifiable information. You can disable cookies in your browser settings.
                    </p>
                  </div>
                </section>

                <section id="section-5" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    Data Sharing
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      We may share your information only:
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <ul className="text-gray-300 space-y-2">
                        <li>• With service providers who help us operate our website or communications (under confidentiality agreements)</li>
                        <li>• If required by law or legal process</li>
                        <li>• To protect our legal rights and safety</li>
                        <li>• In the event of a company merger, acquisition, or sale of assets (with notice)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="section-6" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                    Data Security
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      We use industry-standard measures to protect your data, including encryption, secure servers, and restricted access. However, no system is completely secure, and we cannot guarantee absolute protection.
                    </p>
                  </div>
                </section>

                <section id="section-7" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                    Your Rights
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      Depending on your location, you may have the right to:
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <ul className="text-gray-300 space-y-2">
                        <li>• Access the personal data we hold about you</li>
                        <li>• Request corrections or updates</li>
                        <li>• Request deletion of your data</li>
                        <li>• Withdraw consent for communications</li>
                      </ul>
                    </div>
                    <p className="text-gray-300">
                      To exercise these rights, contact us using the details below.
                    </p>
                  </div>
                </section>

                <section id="section-8" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">8</span>
                    Data Retention
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      We keep your information only as long as needed for the purposes described in this policy or as required by law. Data that is no longer needed will be securely deleted or anonymized.
                    </p>
                  </div>
                </section>

                <section id="section-9" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">9</span>
                    Changes to This Policy
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      We may update this Privacy Policy from time to time. Updates will be posted on this page with a new "Last Updated" date. Continued use of our website after changes are posted means you accept the updated policy.
                    </p>
                  </div>
                </section>

                <section id="section-10" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">10</span>
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">Privacy Team</h3>
                      <div className="space-y-3 text-gray-300">
                        <p><strong className="text-white">📧 Email:</strong> privacy@galvanai.com</p>
                        <p><strong className="text-white">📍 Address:</strong> Galvan AI, 123 Innovation Drive, Suite 403, San Francisco, CA 94105, USA</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;