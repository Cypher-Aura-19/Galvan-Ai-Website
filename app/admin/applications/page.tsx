"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Mail,
  Phone,
  User,
  Building2,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Filter,
  FileDown,
  Search
} from "lucide-react";

type ApplicationResponse = {
  questionId: string;
  questionLabel: string;
  questionType: string;
  answer: string | string[] | {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
};

type JobApplication = {
  _id: string;
  jobId: string;
  jobTitle: string;
  questionnaireId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  resume?: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
  coverLetter?: string;
  responses: ApplicationResponse[];
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
};

type Job = {
  _id: string;
  title: string;
  department?: string;
  location?: string;
};

export default function ApplicationsManagementPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  
  // Filter states
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, selectedJob, dateFilter, searchTerm]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/job-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Filter by job
    if (selectedJob !== "all") {
      filtered = filtered.filter(app => app.jobId === selectedJob);
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(app => {
            const appDate = new Date(app.submittedAt);
            return appDate >= today;
          });
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(app => {
            const appDate = new Date(app.submittedAt);
            return appDate >= weekAgo;
          });
          break;
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(app => {
            const appDate = new Date(app.submittedAt);
            return appDate >= monthAgo;
          });
          break;
      }
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(term) ||
        app.applicantEmail.toLowerCase().includes(term) ||
        app.jobTitle.toLowerCase().includes(term) ||
        (app.applicantPhone && app.applicantPhone.includes(term))
      );
    }

    setFilteredApplications(filtered);
  };

  const exportToCSV = () => {
    if (filteredApplications.length === 0) {
      alert('No applications to export');
      return;
    }

    // Prepare CSV data
    const headers = [
      'Name',
      'Email', 
      'Phone',
      'Job Title',
      'Status',
      'Submitted Date',
      'Cover Letter',
      'Resume File'
    ];

    const csvData = filteredApplications.map(app => [
      app.applicantName,
      app.applicantEmail,
      app.applicantPhone || '',
      app.jobTitle,
      app.status,
      formatDate(app.submittedAt),
      app.coverLetter || '',
      app.resume ? app.resume.fileName : ''
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `job-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setUpdatingStatus(applicationId);
    setStatusError(null);
    try {
      const response = await fetch('/api/job-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: applicationId, status }),
      });
      const result = await response.json();
      if (response.ok) {
        fetchApplications(); // Refresh the list
      } else {
        setStatusError(result.error || 'Failed to update status');
      }
    } catch (error) {
      setStatusError('Error updating status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reviewed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shortlisted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'hired': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'hired': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAnswer = (answer: any) => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    
    if (answer && typeof answer === 'object' && 'fileUrl' in answer) {
      return (
        <div className="flex items-center gap-2">
          <span>{answer.fileName}</span>
          <a
            href={answer.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm underline flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            Download
          </a>
        </div>
      );
    }
    
    return answer || 'Not answered';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-14 px-4 relative min-h-screen bg-black">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Loading applications...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-14 px-4 relative min-h-screen bg-black">
        <button 
          onClick={() => router.push("/admin/dashboard")} 
          className="absolute top-8 left-8 px-7 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold z-20 shadow-2xl border border-zinc-800 backdrop-blur-lg transition-all duration-200"
        >
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </span>
        </button>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-lg animate-fade-in">
              <FileText className="w-8 h-8 text-blue-400 animate-pulse" />
              <div>
                <div className="text-lg font-bold text-white">Job Applications</div>
                <div className="text-zinc-400 text-sm">Review and manage all job applications with file access.</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-blue-200 drop-shadow">{filteredApplications.length}</div>
                  <div className="text-zinc-400 text-base font-semibold">Filtered Applications</div>
                </div>
                <FileText className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-yellow-200 drop-shadow">
                    {filteredApplications.filter(a => a.status === 'pending').length}
                  </div>
                  <div className="text-zinc-400 text-base font-semibold">Pending Review</div>
                </div>
                <Clock className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-green-200 drop-shadow">
                    {filteredApplications.filter(a => a.status === 'shortlisted').length}
                  </div>
                  <div className="text-zinc-400 text-base font-semibold">Shortlisted</div>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-purple-200 drop-shadow">
                    {filteredApplications.filter(a => a.status === 'hired').length}
                  </div>
                  <div className="text-zinc-400 text-base font-semibold">Hired</div>
                </div>
                <CheckCircle className="w-12 h-12 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Filters and Export */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-lg">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or job..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Job Filter */}
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors min-w-[200px]"
                  >
                    <option value="all">All Jobs</option>
                    {jobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title}
                      </option>
                    ))}
                  </select>

                  {/* Date Filter */}
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors min-w-[150px]"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportToCSV}
                  disabled={filteredApplications.length === 0}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all flex items-center gap-2 shadow-lg"
                >
                  <FileDown className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          {filteredApplications.length === 0 ? (
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 rounded-3xl shadow-2xl p-16 border border-zinc-800 text-center">
              <FileText className="w-24 h-24 text-zinc-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-zinc-300 mb-4">
                {applications.length === 0 ? 'No Applications Yet' : 'No Applications Match Filters'}
              </h2>
              <p className="text-zinc-500 text-lg max-w-md mx-auto">
                {applications.length === 0 
                  ? 'Job applications will appear here once candidates start applying to your positions.'
                  : 'Try adjusting your filters to see more applications.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl shadow-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-zinc-950/80">
                  <tr className="text-zinc-400 border-b border-zinc-800">
                    <th className="py-4 px-4 text-left font-semibold">Name</th>
                    <th className="py-4 px-4 text-left font-semibold">Email</th>
                    <th className="py-4 px-4 text-left font-semibold">Phone</th>
                    <th className="py-4 px-4 text-left font-semibold">Job</th>
                    <th className="py-4 px-4 text-left font-semibold">Resume</th>
                    <th className="py-4 px-4 text-left font-semibold">Status</th>
                    <th className="py-4 px-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="hover:bg-zinc-800/60 transition group"
                    >
                      <td className="py-3 px-4 font-semibold text-white group-hover:text-blue-400">{application.applicantName}</td>
                      <td className="py-3 px-4 text-zinc-300">{application.applicantEmail}</td>
                      <td className="py-3 px-4 text-zinc-300">{application.applicantPhone || <span className='text-zinc-500'>—</span>}</td>
                      <td className="py-3 px-4 text-zinc-300">{application.jobTitle}</td>
                      <td className="py-3 px-4">
                        {application.resume ? (
                          <a
                            href={application.resume.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors underline"
                            onClick={e => e.stopPropagation()}
                          >
                            <Download className="w-4 h-4" />
                            {application.resume.fileName}
                          </a>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedApplication(application);
                              setShowDetailModal(true);
                            }}
                            className="p-2 bg-zinc-800 hover:bg-blue-700 rounded-xl text-blue-400 hover:text-white transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Application Details</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedApplication(null);
                  }}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Applicant Information */}
                <div className="bg-zinc-800/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Applicant Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-zinc-400 text-sm">Name</span>
                      <p className="text-white font-medium">{selectedApplication.applicantName}</p>
                    </div>
                    <div>
                      <span className="text-zinc-400 text-sm">Email</span>
                      <p className="text-white font-medium">{selectedApplication.applicantEmail}</p>
                    </div>
                    {selectedApplication.applicantPhone && (
                      <div>
                        <span className="text-zinc-400 text-sm">Phone</span>
                        <p className="text-white font-medium">{selectedApplication.applicantPhone}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-zinc-400 text-sm">Applied for</span>
                      <p className="text-white font-medium">{selectedApplication.jobTitle}</p>
                    </div>
                    <div>
                      <span className="text-zinc-400 text-sm">Submitted</span>
                      <p className="text-white font-medium">{formatDate(selectedApplication.submittedAt)}</p>
                    </div>
                    <div>
                      <span className="text-zinc-400 text-sm">Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedApplication.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(selectedApplication.status)}
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resume */}
                {selectedApplication.resume && (
                  <div className="bg-zinc-800/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Resume/CV
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{selectedApplication.resume.fileName}</p>
                        <p className="text-zinc-400 text-sm">
                          {(selectedApplication.resume.fileSize / 1024 / 1024).toFixed(2)} MB • {selectedApplication.resume.fileType}
                        </p>
                      </div>
                      <a
                        href={selectedApplication.resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition-all flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div className="bg-zinc-800/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Cover Letter</h3>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>
                )}

                {/* Questionnaire Responses */}
                <div className="bg-zinc-800/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Questionnaire Responses</h3>
                  <div className="space-y-4">
                    {selectedApplication.responses.map((response, index) => (
                      <div key={response.questionId} className="border-b border-zinc-700 pb-4 last:border-b-0">
                        <p className="text-zinc-400 text-sm mb-2">Q{index + 1}: {response.questionLabel}</p>
                        <div className="text-white">
                          {renderAnswer(response.answer)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {statusError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {statusError}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 