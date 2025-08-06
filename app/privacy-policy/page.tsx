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
              <h1 className="text-5xl font-bold text-white mb-2">Privacy Policy</h1>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <p className="text-xl text-gray-300 leading-relaxed">
              At Galvan AI, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This comprehensive privacy policy outlines how we collect, use, process, and safeguard your data when you use our AI-powered software solutions.
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
                    'Information Sharing',
                    'Data Security',
                    'Your Rights and Choices',
                    'Cookies and Tracking',
                    'International Transfers',
                    'Data Retention',
                    'Children\'s Privacy',
                    'Policy Changes',
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
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Introduction
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      Galvan AI ("we," "our," or "us") is committed to protecting your privacy and maintaining the highest standards of data protection. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered software solutions and services (the "Service").
                    </p>
                    <p>
                      By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by the terms of this Privacy Policy. If you do not agree with our practices, please do not use our Service.
                    </p>
                    <div className="bg-black border border-gray-600 rounded-lg p-4 mt-6">
                      <p className="text-white font-medium mb-2">Key Principles:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Transparency in data collection and usage</li>
                        <li>• Minimal data collection - only what's necessary</li>
                        <li>• Strong security measures and encryption</li>
                        <li>• User control over personal information</li>
                        <li>• Compliance with global privacy regulations</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="section-2" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Information We Collect
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">2.1 Personal Information</h3>
                      <p className="text-gray-300 mb-4">We collect personal information that you voluntarily provide to us:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-white mb-2">Account Information:</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Full name and email address</li>
                            <li>• Company name and job title</li>
                            <li>• Phone number (optional)</li>
                            <li>• Profile picture (optional)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Billing Information:</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Payment method details</li>
                            <li>• Billing address</li>
                            <li>• Tax identification numbers</li>
                            <li>• Transaction history</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">2.2 Usage and Technical Information</h3>
                      <p className="text-gray-300 mb-4">We automatically collect information about your use of our Service:</p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-white mb-2">API Usage:</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Request logs and responses</li>
                            <li>• Usage patterns and frequency</li>
                            <li>• Error logs and debugging data</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Device Information:</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• IP address and location</li>
                            <li>• Browser type and version</li>
                            <li>• Operating system details</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Performance Data:</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Response times and latency</li>
                            <li>• Feature usage analytics</li>
                            <li>• System performance metrics</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">2.3 AI Training and Processing Data</h3>
                      <p className="text-gray-300 mb-4">
                        To improve our AI models and provide better services, we may collect and process:
                      </p>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Code snippets and programming queries (anonymized and aggregated)</li>
                        <li>• Documentation and technical content submitted for processing</li>
                        <li>• User feedback and ratings on AI-generated content</li>
                        <li>• Model interaction patterns and preferences</li>
                      </ul>
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mt-4">
                        <p className="text-white font-medium mb-2">🔒 Data Protection Notice:</p>
                        <p className="text-sm text-gray-300">
                          All training data is anonymized, encrypted, and processed in compliance with privacy regulations. 
                          We never use your proprietary code or sensitive business information for model training without explicit consent.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Continue with other sections... */}
                <section id="section-3" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    How We Use Your Information
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      We use the collected information for legitimate business purposes to provide, maintain, and improve our AI services:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Service Operations</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Providing AI-powered software solutions</li>
                          <li>• Processing API requests and responses</li>
                          <li>• Managing user accounts and subscriptions</li>
                          <li>• Delivering customer support and assistance</li>
                          <li>• Processing payments and billing</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Service Improvement</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Enhancing AI model accuracy and performance</li>
                          <li>• Developing new features and capabilities</li>
                          <li>• Analyzing usage patterns and user behavior</li>
                          <li>• Conducting research and development</li>
                          <li>• Personalizing user experience</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Security & Compliance</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Detecting and preventing fraud</li>
                          <li>• Ensuring system security and integrity</li>
                          <li>• Complying with legal obligations</li>
                          <li>• Monitoring for abuse and violations</li>
                          <li>• Maintaining audit trails</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Communication</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Sending service updates and notifications</li>
                          <li>• Providing technical support</li>
                          <li>• Sharing product announcements</li>
                          <li>• Conducting user surveys and feedback</li>
                          <li>• Marketing communications (with consent)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section id="section-12" className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                    <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">12</span>
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please don't hesitate to contact us:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Privacy Team</h3>
                        <div className="space-y-3 text-gray-300">
                          <p><strong className="text-white">Email:</strong> privacy@galvanai.com</p>
                          <p><strong className="text-white">Phone:</strong> +1 (555) 123-4567</p>
                          <p><strong className="text-white">Response Time:</strong> Within 48 hours</p>
                        </div>
                      </div>
                      
                      <div className="bg-black border border-gray-600 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Mailing Address</h3>
                        <div className="text-gray-300">
                          <p><strong className="text-white">Galvan AI Privacy Department</strong></p>
                          <p>123 Innovation Drive, Suite 400</p>
                          <p>San Francisco, CA 94105</p>
                          <p>United States</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black border border-gray-600 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">Data Protection Officer</h3>
                      <p className="text-gray-300 mb-4">
                        For EU residents and GDPR-related inquiries, you can contact our Data Protection Officer:
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-white">Email:</strong> dpo@galvanai.com<br />
                        <strong className="text-white">Subject Line:</strong> GDPR Inquiry - [Your Request Type]
                      </p>
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