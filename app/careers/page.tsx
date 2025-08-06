"use client"
import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, MapPin, Clock, DollarSign, Users, Building2, Sun, Moon } from 'lucide-react';
import Link from "next/link";
import JobApplicationForm from '@/components/JobApplicationForm';
import { useTheme } from '@/components/theme-provider';
import BrandedLoading from '@/components/BrandedLoading';

// Job interface
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  posted: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  about: string;
  applicationProcess: string[];
}

// Careers Page Component
const CareersPage: React.FC<{ jobs: Job[]; onViewJob: (job: Job) => void; isDark: boolean }> = ({ jobs, onViewJob, isDark }) => {
  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Back to Home Button - Top Left */}
      <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-50">
        <Link href="/" className={`inline-flex items-center gap-2 transition-all duration-300 group px-4 py-2 lg:px-6 lg:py-3 rounded-full backdrop-blur-sm border-2 text-sm lg:text-base font-medium ${
          isDark 
            ? 'text-white hover:text-gray-300 bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30' 
            : 'text-gray-800 hover:text-gray-600 bg-white/80 hover:bg-white/90 border-gray-200 hover:border-gray-300'
        }`}>
          <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      {/* Fixed Left Side */}
      <div className="w-full lg:w-1/2 p-6 lg:p-16 flex flex-col justify-center relative min-h-screen lg:min-h-0">
        {/* Subtle gradient overlay */}
        <div className={`absolute inset-0 pointer-events-none ${
          isDark 
            ? 'bg-gradient-to-br from-white/5 to-transparent' 
            : 'bg-gradient-to-br from-gray-100/50 to-transparent'
        }`}></div>
        
        <div className="max-w-lg relative z-10">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-none mb-8 lg:mb-12 tracking-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Join our
            <br />
            <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
              isDark ? 'from-white to-gray-300' : 'from-gray-900 to-gray-600'
            }`}>
              ranks
            </span>
          </h1>
          
          <p className={`text-lg lg:text-xl leading-relaxed font-light ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            This is where you get the chance to become one of our people. Check out our openings and don't be a stranger.
          </p>
          
          {/* Decorative element */}
          <div className={`mt-8 lg:mt-12 w-24 h-px ${
            isDark ? 'bg-gradient-to-r from-white/50 to-transparent' : 'bg-gradient-to-r from-gray-400/50 to-transparent'
          }`}></div>
        </div>
      </div>

      {/* Scrollable Right Side - Job Cards */}
      <div className="w-full lg:w-1/2 overflow-y-auto h-screen">
        <div className="p-6 lg:p-16 space-y-6 lg:space-y-8">
          {jobs.map((job, index) => (
            <div 
              key={job.id} 
              className={`group relative backdrop-blur-xl border-2 rounded-2xl lg:rounded-3xl p-6 lg:p-10 transition-all duration-500 hover:shadow-2xl ${
                isDark 
                  ? 'bg-black/80 border-white/20 hover:bg-black/90 hover:border-white/30 hover:shadow-white/10' 
                  : 'bg-white/80 border-gray-200 hover:bg-white/90 hover:border-gray-300 hover:shadow-gray-200/50'
              }`}
            >
              {/* Glassy effect overlay */}
              <div className={`absolute inset-0 rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-100/50 to-transparent'
              }`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6 lg:mb-8">
                  <div className={`text-xs lg:text-sm font-bold px-3 py-1 lg:px-4 lg:py-2 rounded-full backdrop-blur-sm border ${
                    isDark 
                      ? 'text-gray-400 bg-white/5 border-white/10' 
                      : 'text-gray-600 bg-gray-100/50 border-gray-200'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                <div className="mb-6 lg:mb-8">
                  <h2 className={`text-xl lg:text-3xl font-bold mb-3 lg:mb-4 transition-colors duration-300 ${
                    isDark ? 'text-white group-hover:text-gray-100' : 'text-gray-900 group-hover:text-gray-800'
                  }`}>
                    {job.title}
                  </h2>
                  <div className={`text-xs lg:text-sm font-semibold uppercase tracking-wider inline-block px-4 py-2 lg:px-6 lg:py-3 rounded-full backdrop-blur-sm border ${
                    isDark 
                      ? 'text-gray-300 bg-white/5 border-white/10' 
                      : 'text-gray-600 bg-gray-100/50 border-gray-200'
                  }`}>
                    {job.type}
                  </div>
                </div>
                
                <div className="mb-8 lg:mb-12">
                  <p className={`leading-relaxed text-sm lg:text-base font-light ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {job.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => onViewJob(job)}
                    className={`inline-flex items-center gap-2 lg:gap-3 transition-all duration-300 group/btn px-6 py-3 lg:px-8 lg:py-4 rounded-full backdrop-blur-sm border text-sm lg:text-base font-medium ${
                      isDark 
                        ? 'text-white hover:text-gray-200 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20' 
                        : 'text-gray-800 hover:text-gray-700 bg-gray-100/50 hover:bg-gray-200/50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="tracking-wide">View detail</span>
                    <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Job Detail Page Component
const JobDetailPage: React.FC<{ job: Job; onBack: () => void; onApply: (job: Job) => void; isDark: boolean }> = ({ job, onBack, onApply, isDark }) => {
  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="w-full px-4 lg:px-8 py-8 lg:py-12">
        <div className="max-w-[1700px] mx-auto">
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 mb-8 lg:mb-12 transition-all duration-300 group px-4 py-2 lg:px-6 lg:py-3 rounded-full backdrop-blur-sm border-2 text-sm lg:text-base font-medium ${
              isDark 
                ? 'text-white hover:text-gray-300 bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30' 
                : 'text-gray-800 hover:text-gray-600 bg-white/80 hover:bg-white/90 border-gray-200 hover:border-gray-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium tracking-wide">Back to careers</span>
          </button>
          
          {/* Hero Section - Full Width */}
          <div className="mb-12 lg:mb-16">
            <div className={`relative backdrop-blur-xl border-2 rounded-2xl lg:rounded-3xl p-6 lg:p-12 overflow-hidden ${
              isDark ? 'bg-black/80 border-white/20' : 'bg-white/80 border-gray-200'
            }`}>
              {/* Gradient background */}
              <div className={`absolute inset-0 ${
                isDark ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-100/50 to-transparent'
              }`}></div>
              
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-2">
                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-4 lg:mb-6 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                        isDark ? 'from-white to-gray-300' : 'from-gray-900 to-gray-600'
                      }`}>
                        {job.title}
                      </span>
                    </h1>
                    <p className={`text-base lg:text-lg leading-relaxed font-light mb-4 lg:mb-6 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {job.description}
                    </p>
                    <div className={`w-24 h-px ${
                      isDark ? 'bg-gradient-to-r from-white/50 to-transparent' : 'bg-gradient-to-r from-gray-400/50 to-transparent'
                    }`}></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`backdrop-blur-sm border-2 rounded-xl lg:rounded-2xl p-4 lg:p-5 ${
                      isDark ? 'bg-white/5 border-white/20' : 'bg-white/80 border-gray-200'
                    }`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-xs font-semibold uppercase tracking-wider ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Location</span>
                          </div>
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.location}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-xs font-semibold uppercase tracking-wider ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Type</span>
                          </div>
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.type}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-xs font-semibold uppercase tracking-wider ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Experience</span>
                          </div>
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.experience}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-xs font-semibold uppercase tracking-wider ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Salary</span>
                          </div>
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.salary}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onApply(job)}
                      className={`w-full py-3 lg:py-4 px-4 lg:px-6 rounded-xl lg:rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group text-sm lg:text-base shadow-2xl ${
                        isDark 
                          ? 'bg-white text-black hover:bg-gray-100 hover:shadow-white/20' 
                          : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-gray-900/20'
                      }`}
                    >
                      <span>Apply now</span>
                      <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Grid - Full Width */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Left Column */}
            <div className="space-y-6 lg:space-y-8">
              <div className={`backdrop-blur-xl border-2 rounded-2xl lg:rounded-3xl p-6 lg:p-8 ${
                isDark ? 'bg-black/80 border-white/20' : 'bg-white/80 border-gray-200'
              }`}>
                <h2 className={`text-xl lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center gap-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`}></div>
                  Key responsibilities
                </h2>
                <ul className="space-y-3 lg:space-y-4">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className={`leading-relaxed flex items-start gap-3 text-sm lg:text-base ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                        isDark ? 'bg-gray-400' : 'bg-gray-500'
                      }`}></div>
                      <span className="font-light">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={`backdrop-blur-xl border-2 rounded-2xl lg:rounded-3xl p-6 lg:p-8 ${
                isDark ? 'bg-black/80 border-white/20' : 'bg-white/80 border-gray-200'
              }`}>
                <h2 className={`text-xl lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center gap-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`}></div>
                  What we offer
                </h2>
                <ul className="space-y-3 lg:space-y-4">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className={`leading-relaxed flex items-start gap-3 text-sm lg:text-base ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                        isDark ? 'bg-gray-400' : 'bg-gray-500'
                      }`}></div>
                      <span className="font-light">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6 lg:space-y-8">
              <div className={`backdrop-blur-xl border-2 rounded-2xl lg:rounded-3xl p-6 lg:p-8 ${
                isDark ? 'bg-black/80 border-white/20' : 'bg-white/80 border-gray-200'
              }`}>
                <h2 className={`text-xl lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center gap-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`}></div>
                  Requirements
                </h2>
                <ul className="space-y-3 lg:space-y-4">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className={`leading-relaxed flex items-start gap-3 text-sm lg:text-base ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                        isDark ? 'bg-gray-400' : 'bg-gray-500'
                      }`}></div>
                      <span className="font-light">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={`backdrop-blur-xl border-2 rounded-2xl lg:rounded-3xl p-6 lg:p-8 ${
                isDark ? 'bg-black/80 border-white/20' : 'bg-white/80 border-gray-200'
              }`}>
                <h2 className={`text-xl lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center gap-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`}></div>
                  Application process
                </h2>
                <ul className="space-y-3 lg:space-y-4">
                  {job.applicationProcess.map((step, index) => (
                    <li key={index} className={`leading-relaxed flex items-start gap-3 text-sm lg:text-base ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <div className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isDark ? 'bg-white/10 text-white' : 'bg-gray-900/10 text-gray-900'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-light pt-1">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA - Full Width */}
          <div className="mt-12 lg:mt-16">
            <div className={`backdrop-blur-xl border-2 rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden ${
              isDark ? 'bg-black/80 border-white/20' : 'bg-white/80 border-gray-200'
            }`}>
              <div className={`absolute inset-0 ${
                isDark ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-100/50 to-transparent'
              }`}></div>
              <div className="relative z-10">
                <h3 className={`text-2xl lg:text-3xl font-bold mb-4 lg:mb-5 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Ready to join our team?
                </h3>
                <p className={`text-base lg:text-lg mb-6 lg:mb-8 font-light ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Take the next step in your career and become part of our innovative team.
                </p>
                <button 
                  onClick={() => onApply(job)}
                  className={`py-3 lg:py-4 px-6 lg:px-10 rounded-xl lg:rounded-2xl font-bold transition-all duration-300 inline-flex items-center gap-2 lg:gap-3 group shadow-2xl text-sm lg:text-lg ${
                    isDark 
                      ? 'bg-white text-black hover:bg-gray-100 hover:shadow-white/20' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-gray-900/20'
                  }`}
                >
                  <span>Apply for this position</span>
                  <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle: React.FC<{ isDark: boolean; toggleTheme: () => void }> = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 lg:top-8 lg:right-8 z-50 p-3 rounded-full backdrop-blur-sm border-2 transition-all duration-300 ${
        isDark 
          ? 'text-white bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30' 
          : 'text-gray-800 bg-white/80 border-gray-200 hover:bg-white/90 hover:border-gray-300'
      }`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

// Main Careers Complete Component
const CareersComplete: React.FC = () => {
  const [currentView, setCurrentView] = useState<'careers' | 'job-detail'>('careers');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/jobs')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load jobs');
        setLoading(false);
      });
  }, []);

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('job-detail');
  };

  const handleBackToCareers = () => {
    setCurrentView('careers');
    setSelectedJob(null);
  };

  const handleApply = (job: Job) => {
    setJobToApply(job);
    setShowApplicationForm(true);
  };

  const handleCloseApplicationForm = () => {
    setShowApplicationForm(false);
    setJobToApply(null);
  };

  if (loading) {
    return <BrandedLoading minDuration={7000} />;
  }
  
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-2xl ${
        isDark ? 'bg-black text-red-500' : 'bg-gray-50 text-red-600'
      }`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      
      {currentView === 'careers' ? (
        <CareersPage jobs={jobs} onViewJob={handleViewJob} isDark={isDark} />
      ) : (
        <JobDetailPage job={selectedJob!} onBack={handleBackToCareers} onApply={handleApply} isDark={isDark} />
      )}
      
      {showApplicationForm && jobToApply && (
        <JobApplicationForm 
          job={jobToApply} 
          onClose={handleCloseApplicationForm} 
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default CareersComplete;