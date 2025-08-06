"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  MessageSquare, 
  User, 
  Mail, 
  Building, 
  Calendar, 
  Trash2, 
  Eye, 
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw
} from "lucide-react";

type ContactQuote = {
  _id?: string;
  name: string;
  email: string;
  company: string;
  projectDetails: string;
  createdAt: string;
};

export default function QuotesManagementPage() {
  const [quotes, setQuotes] = useState<ContactQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<ContactQuote | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<ContactQuote | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      } else {
        toast.error("Failed to fetch quotes");
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    }
    setLoading(false);
  }

  function showDeleteConfirmation(quote: ContactQuote) {
    setQuoteToDelete(quote);
    setShowDeleteModal(true);
  }

  async function handleDelete() {
    if (!quoteToDelete?._id) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: quoteToDelete._id }),
      });
      if (res.ok) {
        toast.success("Quote deleted successfully!");
        fetchQuotes();
        setShowModal(false); // Close detail modal after successful deletion
        setShowDeleteModal(false); // Close delete confirmation modal
        setQuoteToDelete(null);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete quote");
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    }
    setLoading(false);
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.projectDetails.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filtering
    let matchesDate = true;
    if (selectedDate) {
      const quoteDate = new Date(quote.createdAt);
      const filterDate = new Date(selectedDate);
      matchesDate = quoteDate.toDateString() === filterDate.toDateString();
    }
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportQuotes = () => {
    const csvContent = [
      ['Name', 'Email', 'Company', 'Project Details', 'Date'],
      ...filteredQuotes.map(quote => [
        quote.name,
        quote.email,
        quote.company,
        quote.projectDetails,
        formatDate(quote.createdAt)
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-quotes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Quotes exported successfully!");
  };

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
          {/* Info Banner */}
          <div className="mb-10">
            <div className="flex items-center gap-4 bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-lg animate-fade-in">
              <MessageSquare className="w-8 h-8 text-green-400 animate-pulse" />
              <div>
                <div className="text-lg font-bold text-white">Project Quotes Management</div>
                <div className="text-zinc-400 text-sm">View and manage all project inquiries and quotes from potential clients.</div>
              </div>
            </div>
          </div>

          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-900/90 to-green-700/60 rounded-2xl p-5 shadow-2xl border border-green-900">
                <MessageSquare className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-1 bg-gradient-to-r from-green-400 via-white to-green-600 bg-clip-text text-transparent drop-shadow-xl">
                  Project Quotes
                </h1>
                <p className="text-zinc-400 text-lg font-medium">
                  {quotes.length} total inquiries • Manage client project requests
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={exportQuotes}
                className="px-6 py-3 bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 rounded-2xl text-white font-bold shadow-2xl border border-green-900 transition-all text-lg flex items-center gap-2 group"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Export CSV
              </button>
              <button
                onClick={fetchQuotes}
                disabled={loading}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-white font-bold shadow-2xl border border-zinc-800 transition-all text-lg flex items-center gap-2 group disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 group-hover:scale-110 transition-transform ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-green-200 drop-shadow">{quotes.length}</div>
                  <div className="text-zinc-400 text-base font-semibold">Total Quotes</div>
                </div>
                <MessageSquare className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-blue-200 drop-shadow">
                    {quotes.filter(q => new Date(q.createdAt) > new Date(Date.now() - 24*60*60*1000)).length}
                  </div>
                  <div className="text-zinc-400 text-base font-semibold">Last 24h</div>
                </div>
                <Clock className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-purple-200 drop-shadow">
                    {quotes.filter(q => new Date(q.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
                  </div>
                  <div className="text-zinc-400 text-base font-semibold">This Week</div>
                </div>
                <Calendar className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-orange-200 drop-shadow">
                    {new Set(quotes.map(q => q.company)).size}
                  </div>
                  <div className="text-zinc-400 text-base font-semibold">Companies</div>
                </div>
                <Building className="w-12 h-12 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 rounded-2xl p-6 shadow-2xl border border-zinc-800 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search quotes by name, email, company, or project details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                >
                  <option value="all">All Quotes</option>
                  <option value="recent">Recent (24h)</option>
                  <option value="week">This Week</option>
                </select>
                {(selectedDate || searchTerm) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDate("");
                      setFilterStatus("all");
                    }}
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold transition-all flex items-center gap-2"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quotes Table */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
                <p className="text-zinc-400 text-lg">Loading quotes...</p>
              </div>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 rounded-3xl shadow-2xl p-16 border border-zinc-800 text-center">
              <MessageSquare className="w-24 h-24 text-zinc-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-zinc-300 mb-4">No Quotes Found</h2>
              <p className="text-zinc-500 text-lg max-w-md mx-auto">
                {searchTerm ? "No quotes match your search criteria." : "No project quotes have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl shadow-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-zinc-950/80">
                  <tr className="text-zinc-400 border-b border-zinc-800">
                    <th className="py-4 px-4 text-left font-semibold">Name</th>
                    <th className="py-4 px-4 text-left font-semibold">Email</th>
                    <th className="py-4 px-4 text-left font-semibold">Company</th>
                    <th className="py-4 px-4 text-left font-semibold">Project Details</th>
                    <th className="py-4 px-4 text-left font-semibold">Status</th>
                    <th className="py-4 px-4 text-left font-semibold">Submitted</th>
                    <th className="py-4 px-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote._id}
                      className="hover:bg-zinc-800/60 transition cursor-pointer group"
                      onClick={() => {
                        setSelectedQuote(quote);
                        setShowModal(true);
                      }}
                    >
                      <td className="py-3 px-4 font-semibold text-white group-hover:text-green-400">{quote.name}</td>
                      <td className="py-3 px-4 text-zinc-300">{quote.email}</td>
                      <td className="py-3 px-4 text-zinc-300">{quote.company}</td>
                      <td className="py-3 px-4 text-zinc-300">
                        <div className="max-w-xs truncate" title={quote.projectDetails}>
                          {quote.projectDetails}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                          New Quote
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{formatDate(quote.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedQuote(quote);
                              setShowModal(true);
                            }}
                            className="p-2 bg-zinc-800 hover:bg-green-700 rounded-xl text-green-400 hover:text-white transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              showDeleteConfirmation(quote);
                            }}
                            className="p-2 bg-zinc-800 hover:bg-red-700 rounded-xl text-red-400 hover:text-white transition-all"
                            title="Delete Quote"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Quote Detail Modal */}
        {showModal && selectedQuote && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Quote Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedQuote.name}</h3>
                    <p className="text-zinc-400">{selectedQuote.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-2xl">
                  <Building className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-zinc-400 text-sm">Company</p>
                    <p className="text-white font-semibold">{selectedQuote.company}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/50 rounded-2xl">
                  <p className="text-zinc-400 text-sm mb-2">Project Details</p>
                  <p className="text-white leading-relaxed">{selectedQuote.projectDetails}</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-2xl">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-zinc-400 text-sm">Submitted</p>
                    <p className="text-white font-semibold">{formatDate(selectedQuote.createdAt)}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => showDeleteConfirmation(selectedQuote)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-2xl text-white font-bold transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-white font-bold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && quoteToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-800 animate-fade-in">
              <div className="text-center">
                {/* Warning Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Trash2 className="w-10 h-10 text-white" />
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-4">Delete Quote</h2>
                
                {/* Message */}
                <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
                  Are you sure you want to delete the quote from{" "}
                  <span className="text-white font-semibold">{quoteToDelete.name}</span>{" "}
                  at <span className="text-white font-semibold">{quoteToDelete.company}</span>?
                </p>
                
                <p className="text-zinc-400 text-sm mb-8">
                  This action cannot be undone. The quote will be permanently removed from the system.
                </p>
                
                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setQuoteToDelete(null);
                    }}
                    className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-white font-bold transition-all border border-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-2xl text-white font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Delete Quote
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminLayout>
  );
} 