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
              <h1 className="text-5xl font-bold text-white mb-2">Terms of Service</h1>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <p className="text-xl text-gray-300 leading-relaxed">
              Welcome to Galvan AI. These Terms of Service govern your use of our AI-powered software solutions and establish 
              the legal framework for our business relationship. Please read these terms carefully before using our services.
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
                    'User Accounts',
                    'Acceptable Use Policy',
                    'Intellectual Property',
                    'Payment Terms',
                    'API Usage & Limits',
                    'Privacy & Data',
                    'Disclaimers',
                    'Limitation of Liability',
                    'Indemnification',
                    'Termination',
                    'Governing Law',
                    'Changes to Terms',
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
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Acceptance of Terms
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      Welcome to Galvan AI. These Terms of Service ("Terms") constitute a legally binding agreement between you and Galvan AI ("we," "us," or "our") governing your access to and use of our AI-powered software solutions and services (the "Service").
                    </p>
                    <p>
                      By accessing, browsing, or using our Service in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use our Service.
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-4 mt-6">
                      <p className="text-white font-medium mb-2">Important Legal Notice:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• These Terms apply to all users of our Service</li>
                        <li>• You must be at least 18 years old to use our Service</li>
                        <li>• Business users must have authority to bind their organization</li>
                        <li>• Continued use constitutes acceptance of any updates to these Terms</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="terms-section-2" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Service Description
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      Galvan AI provides comprehensive artificial intelligence and machine learning solutions designed specifically for software development and technology companies:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Core AI Services</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• AI-powered code generation and completion</li>
                          <li>• Intelligent code review and optimization</li>
                          <li>• Automated testing and quality assurance</li>
                          <li>• Natural language to code translation</li>
                          <li>• Code documentation generation</li>
                          <li>• Bug detection and security analysis</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Platform Features</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• RESTful API and GraphQL endpoints</li>
                          <li>• Software Development Kits (SDKs)</li>
                          <li>• Real-time collaboration tools</li>
                          <li>• Analytics and performance monitoring</li>
                          <li>• Integration with popular IDEs</li>
                          <li>• Custom model training capabilities</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Enterprise Solutions</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• On-premises deployment options</li>
                          <li>• Custom AI model development</li>
                          <li>• Dedicated support and training</li>
                          <li>• Advanced security and compliance</li>
                          <li>• White-label solutions</li>
                          <li>• Service Level Agreements (SLAs)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Support Services</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• 24/7 technical support</li>
                          <li>• Comprehensive documentation</li>
                          <li>• Developer community forums</li>
                          <li>• Training and certification programs</li>
                          <li>• Implementation consulting</li>
                          <li>• Regular webinars and workshops</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-4">
                      <p className="text-white font-medium mb-2">🚀 Service Evolution:</p>
                      <p className="text-sm text-gray-300">
                        Our Service is continuously evolving. We regularly add new features, improve existing functionality, 
                        and may modify or discontinue certain features with appropriate notice to users.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Continue with other sections... */}
                <section id="terms-section-6" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                    Payment Terms
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      Our flexible pricing structure is designed to accommodate businesses of all sizes, from startups to enterprise organizations:
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Subscription Plans</h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                          <li>• <strong className="text-white">Starter:</strong> Individual developers</li>
                          <li>• <strong className="text-white">Professional:</strong> Small teams (5-20 users)</li>
                          <li>• <strong className="text-white">Business:</strong> Growing companies (21-100 users)</li>
                          <li>• <strong className="text-white">Enterprise:</strong> Large organizations (100+ users)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Billing Cycles</h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                          <li>• Monthly billing with no long-term commitment</li>
                          <li>• Annual billing with 20% discount</li>
                          <li>• Custom billing for enterprise clients</li>
                          <li>• Usage-based pricing for API calls</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Payment Methods</h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                          <li>• Credit and debit cards</li>
                          <li>• ACH bank transfers</li>
                          <li>• Wire transfers (enterprise)</li>
                          <li>• Purchase orders (qualified businesses)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">Payment Terms and Conditions</h3>
                      <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                        <div>
                          <h4 className="font-medium text-white mb-2">Billing and Collection:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Fees are billed in advance for subscription services</li>
                            <li>• Usage-based charges are billed monthly in arrears</li>
                            <li>• Payment is due within 30 days of invoice date</li>
                            <li>• Late payments may incur a 1.5% monthly service charge</li>
                            <li>• Accounts may be suspended for non-payment</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Refunds and Cancellations:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• 30-day money-back guarantee for new subscriptions</li>
                            <li>• Pro-rated refunds for annual plans cancelled early</li>
                            <li>• No refunds for usage-based charges</li>
                            <li>• Cancellation takes effect at end of billing period</li>
                            <li>• Enterprise refunds subject to contract terms</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section id="terms-section-15" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">15</span>
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      For questions about these Terms of Service, legal matters, or business inquiries, please contact our legal team:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Legal Department</h3>
                        <div className="space-y-3 text-gray-300">
                          <p><strong className="text-white">Email:</strong> legal@galvanai.com</p>
                          <p><strong className="text-white">Phone:</strong> +1 (555) 123-4567</p>
                          <p><strong className="text-white">Response Time:</strong> Within 72 hours</p>
                        </div>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Business Address</h3>
                        <div className="text-gray-300">
                          <p><strong className="text-white">Galvan AI Legal Department</strong></p>
                          <p>123 Innovation Drive, Suite 400</p>
                          <p>San Francisco, CA 94105</p>
                          <p>United States</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Contract Inquiries</h3>
                        <p className="text-gray-300 mb-4">
                          For enterprise contracts, partnerships, and business agreements:
                        </p>
                        <p className="text-gray-300">
                          <strong className="text-white">Email:</strong> contracts@galvanai.com<br />
                          <strong className="text-white">Subject Line:</strong> Contract Inquiry - [Company Name]
                        </p>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Compliance & Security</h3>
                        <p className="text-gray-300 mb-4">
                          For security, compliance, and regulatory inquiries:
                        </p>
                        <p className="text-gray-300">
                          <strong className="text-white">Email:</strong> compliance@galvanai.com<br />
                          <strong className="text-white">Subject Line:</strong> Compliance Inquiry - [Topic]
                        </p>
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