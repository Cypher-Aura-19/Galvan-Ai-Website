import React from 'react';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
              <FileText className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-barlow text-white mb-2">Terms of Service</h1>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">Last updated: August 8, 2025</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <p className="text-xl text-gray-300 leading-relaxed">
              Welcome to Galvan AI. These Terms of Service govern your use of our SaaS development, AI-powered solutions, and related software services. By accessing or using our services, you agree to these Terms. Please read them carefully before proceeding.
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
                    'Acceptance of Terms',
                    'Service Description',
                    'User Responsibilities',
                    'Payment Terms',
                    'Intellectual Property',
                    'Acceptable Use Policy',
                    'Limitation of Liability',
                    'Termination',
                    'Governing Law',
                    'Changes to These Terms',
                    'Contact Information'
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={`#terms-section-${index + 1}`}
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
                <section id="terms-section-1" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Acceptance of Terms
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      By using Galvan AI's services, you agree to comply with these Terms of Service and our Privacy Policy. If you do not agree, you may not use our services.
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-4 mt-6">
                      <p className="text-white font-medium mb-2">Key Points:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• These Terms apply to all clients and users of our services.</li>
                        <li>• You must be at least 18 years old or have legal parental/guardian consent.</li>
                        <li>• Services may only be used for lawful purposes.</li>
                        <li>• We may update these Terms from time to time, and continued use means acceptance of any changes.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="terms-section-2" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Service Description
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      Galvan AI provides professional AI-powered SaaS development, custom software solutions, automation tools, and technology consulting services.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Core Services:</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Custom SaaS platform development</li>
                          <li>• AI integration and automation solutions</li>
                          <li>• API development and system integration</li>
                          <li>• Web and mobile application development</li>
                          <li>• Data analytics and AI-powered insights</li>
                          <li>• UI/UX design and prototyping</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Platform & Service Features:</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Secure, scalable architecture</li>
                          <li>• Role-based access control</li>
                          <li>• Data encryption and compliance measures</li>
                          <li>• Documentation and knowledge transfer</li>
                          <li>• Ongoing support (as per agreement)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="terms-section-3" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    User Responsibilities
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      When working with Galvan AI, you agree to:
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <ul className="text-gray-300 space-y-2">
                        <li>• Provide accurate and complete project requirements</li>
                        <li>• Respond to requests for feedback in a timely manner</li>
                        <li>• Ensure all content and data you provide complies with applicable laws</li>
                        <li>• Not use our services for unlawful, harmful, or fraudulent activities</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="terms-section-4" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Payment Terms
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">Billing & Payment:</h3>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Pricing and payment schedules are defined in your signed agreement or invoice.</li>
                        <li>• Payments are due as specified in the agreement, unless otherwise stated.</li>
                        <li>• Late payments may result in suspension or termination of services.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">Refunds & Cancellations:</h3>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Refunds are only provided if stated in your agreement.</li>
                        <li>• Cancellations must be made in writing before the next billing cycle or project milestone.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="terms-section-5" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    Intellectual Property
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                      <p className="text-lg">
                        All source code, software, designs, documentation, and other deliverables created by Galvan AI specifically for you under a client agreement will become your property upon full payment, unless otherwise agreed in writing.
                      </p>
                      <p>
                        Any pre-existing tools, frameworks, templates, code libraries, or technologies developed and owned by Galvan AI prior to or outside of your project remain our sole property, but may be licensed for your use as agreed.
                      </p>
                      <p>
                        You may not copy, modify, or redistribute Galvan AI–owned assets outside the scope of your license without our prior written consent.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="terms-section-6" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                    Acceptable Use Policy
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      You must not:
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <ul className="text-gray-300 space-y-2">
                        <li>• Use our services for illegal or fraudulent purposes</li>
                        <li>• Distribute malware, spam, or malicious code</li>
                        <li>• Attempt to reverse-engineer, decompile, or copy any Galvan AI proprietary technology without permission</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="terms-section-7" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                    Limitation of Liability
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      To the fullest extent permitted by law, Galvan AI will not be liable for:
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <ul className="text-gray-300 space-y-2">
                        <li>• Indirect, incidental, or consequential damages</li>
                        <li>• Loss of profits, data, or business opportunities</li>
                        <li>• Service delays or interruptions outside our control</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="terms-section-8" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">8</span>
                    Termination
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      We reserve the right to suspend or terminate your services if:
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <ul className="text-gray-300 space-y-2">
                        <li>• You breach these Terms</li>
                        <li>• You fail to make required payments</li>
                        <li>• We are legally required to do so</li>
                      </ul>
                    </div>
                    <p className="text-gray-300">
                      Upon termination, your access to any active development environments, accounts, or proprietary tools may be revoked.
                    </p>
                  </div>
                </section>

                <section id="terms-section-9" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">9</span>
                    Governing Law
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      These Terms of Service are governed by and construed in accordance with the laws of Pakistan. Any disputes will be subject to the exclusive jurisdiction of the courts of Pakistan.
                    </p>
                  </div>
                </section>

                <section id="terms-section-10" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">10</span>
                    Changes to These Terms
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      We may update these Terms from time to time. Updates will be posted on our website with a revised "Last Updated" date. Continued use of our services after updates constitutes acceptance of the new Terms.
                    </p>
                  </div>
                </section>

                <section id="terms-section-11" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-xl sm:text-2xl font-light font-barlow mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">11</span>
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      For questions about these Terms of Service or our services, please contact us:
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">Contact Details</h3>
                      <div className="space-y-3 text-gray-300">
                        <p><strong className="text-white">📧 Email:</strong> legal@galvanai.com</p>
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

export default TermsOfService;