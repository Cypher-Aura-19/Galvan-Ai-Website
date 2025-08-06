"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Settings,
  DragDrop2,
  CheckCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  GripVertical
} from "lucide-react";

type QuestionType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'email' | 'phone' | 'number' | 'date';

type Question = {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    // File upload restrictions
    allowedFileTypes?: string[]; // e.g., ['pdf', 'doc', 'docx']
    maxFileSize?: number; // in bytes
    maxFiles?: number; // for multiple file uploads
  };
  order: number;
};

type Questionnaire = {
  _id?: string;
  jobId: string;
  title: string;
  description: string;
  questions: Question[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type Job = {
  _id?: string;
  id: string;
  title: string;
  department: string;
};

const questionTypes = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'textarea', label: 'Text Area', icon: '📄' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'phone', label: 'Phone', icon: '📞' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
  { value: 'file', label: 'File Upload', icon: '📎' },
];

const emptyQuestion: Question = {
  id: '',
  type: 'text',
  label: '',
  placeholder: '',
  required: false,
  options: [],
  order: 0,
};

const emptyQuestionnaire: Questionnaire = {
  jobId: '',
  title: '',
  description: '',
  questions: [],
  isActive: true,
};

type View = "menu" | "add" | "edit" | "preview";

export default function QuestionnairesManagementPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Questionnaire>(emptyQuestionnaire);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionnaireToDelete, setQuestionnaireToDelete] = useState<Questionnaire | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchQuestionnaires();
    fetchJobs();
  }, []);

  async function fetchQuestionnaires() {
    setLoading(true);
    try {
      const res = await fetch("/api/questionnaires");
      if (res.ok) {
        const data = await res.json();
        setQuestionnaires(data);
      } else {
        toast.error("Failed to fetch questionnaires");
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    }
    setLoading(false);
  }

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function addQuestion() {
    const newQuestion: Question = {
      ...emptyQuestion,
      id: `question_${Date.now()}`,
      order: form.questions.length,
    };
    setForm(f => ({ ...f, questions: [...f.questions, newQuestion] }));
  }

  function updateQuestion(index: number, updates: Partial<Question>) {
    setForm(f => ({
      ...f,
      questions: f.questions.map((q, i) => i === index ? { ...q, ...updates } : q)
    }));
  }

  function removeQuestion(index: number) {
    setForm(f => ({
      ...f,
      questions: f.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i }))
    }));
  }

  function addOption(questionIndex: number) {
    setForm(f => ({
      ...f,
      questions: f.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: [...(q.options || []), ''] }
          : q
      )
    }));
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    setForm(f => ({
      ...f,
      questions: f.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options?.map((opt, j) => j === optionIndex ? value : opt) 
            }
          : q
      )
    }));
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    setForm(f => ({
      ...f,
      questions: f.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options?.filter((_, j) => j !== optionIndex) 
            }
          : q
      )
    }));
  }

  function moveQuestion(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= form.questions.length) return;
    
    setForm(f => {
      const newQuestions = [...f.questions];
      const [movedQuestion] = newQuestions.splice(fromIndex, 1);
      newQuestions.splice(toIndex, 0, movedQuestion);
      
      // Update order
      return {
        ...f,
        questions: newQuestions.map((q, i) => ({ ...q, order: i }))
      };
    });
  }

  function startEdit(questionnaire: Questionnaire) {
    setEditingId(questionnaire._id!);
    setForm({ ...questionnaire });
    setView("edit");
  }

  function resetForm() {
    setForm(emptyQuestionnaire);
    setEditingId(null);
    setView("menu");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!form.jobId.trim()) {
      toast.error("Please select a job");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (form.questions.length === 0) {
      toast.error("At least one question is required");
      return;
    }

    // Validate questions
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.label.trim()) {
        toast.error(`Question ${i + 1} label is required`);
        return;
      }
      if (['select', 'radio', 'checkbox'].includes(q.type) && (!q.options || q.options.length === 0)) {
        toast.error(`Question ${i + 1} (${q.type}) requires at least one option`);
        return;
      }
    }

    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, _id: editingId } : form;
    
    try {
      const res = await fetch("/api/questionnaires", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(editingId ? "Questionnaire updated successfully!" : "Questionnaire created successfully!");
        setTimeout(() => {
          setView("menu");
          setEditingId(null);
          setForm(emptyQuestionnaire);
          fetchQuestionnaires();
        }, 2000);
      } else {
        toast.error(data.error || "Failed to save questionnaire");
      }
    } catch (err) {
      toast.error("Network or server error");
      console.error(err);
    }
    setLoading(false);
  }

  function showDeleteConfirmation(questionnaire: Questionnaire) {
    setQuestionnaireToDelete(questionnaire);
    setShowDeleteModal(true);
  }

  async function handleDelete() {
    if (!questionnaireToDelete?._id) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/questionnaires", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: questionnaireToDelete._id }),
      });
      
      if (res.ok) {
        toast.success("Questionnaire deleted successfully!");
        fetchQuestionnaires();
        setShowDeleteModal(false);
        setQuestionnaireToDelete(null);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete questionnaire");
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    }
    setLoading(false);
  }

  function copyQuestionnaire(questionnaire: Questionnaire) {
    const newQuestionnaire = {
      ...questionnaire,
      title: `${questionnaire.title} (Copy)`,
      isActive: false,
    };
    delete newQuestionnaire._id;
    delete newQuestionnaire.createdAt;
    delete newQuestionnaire.updatedAt;
    
    setForm(newQuestionnaire);
    setView("add");
    toast.success("Questionnaire copied to form");
  }

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || jobId;
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
              <FileText className="w-8 h-8 text-purple-400 animate-pulse" />
              <div>
                <div className="text-lg font-bold text-white">Job Application Questionnaires</div>
                <div className="text-zinc-400 text-sm">Create and manage custom application forms for each job position.</div>
              </div>
            </div>
          </div>

          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-900/90 to-purple-700/60 rounded-2xl p-5 shadow-2xl border border-purple-900">
                <FileText className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-1 bg-gradient-to-r from-purple-400 via-white to-purple-600 bg-clip-text text-transparent drop-shadow-xl">
                  Questionnaires
                </h1>
                <p className="text-zinc-400 text-lg font-medium">
                  {questionnaires.length} total questionnaires • Design custom application forms
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setView("add")}
                className="px-8 py-3 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 rounded-2xl text-white font-bold shadow-2xl border border-purple-900 transition-all text-lg flex items-center gap-2 group"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Create Questionnaire
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-purple-200 drop-shadow">{questionnaires.length}</div>
                  <div className="text-zinc-400 text-base font-semibold">Total Questionnaires</div>
                </div>
                <FileText className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-green-200 drop-shadow">
                    {questionnaires.filter(q => q.isActive).length}
                  </div>
                  <div className="text-zinc-400 text-base font-semibold">Active Forms</div>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-blue-200 drop-shadow">
                    {questionnaires.reduce((total, q) => total + q.questions.length, 0)}
                  </div>
                  <div className="text-zinc-400 text-base font-semibold">Total Questions</div>
                </div>
                <Settings className="w-12 h-12 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          {view === "menu" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-zinc-400 text-lg">Loading questionnaires...</p>
                  </div>
                </div>
              ) : questionnaires.length === 0 ? (
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 rounded-3xl shadow-2xl p-16 border border-zinc-800 text-center">
                  <FileText className="w-24 h-24 text-zinc-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-zinc-300 mb-4">No Questionnaires Yet</h2>
                  <p className="text-zinc-500 text-lg max-w-md mx-auto mb-8">
                    Create your first questionnaire to collect detailed information from job applicants.
                  </p>
                  <button
                    onClick={() => setView("add")}
                    className="px-8 py-3 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 rounded-2xl text-white font-bold transition-all flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Questionnaire
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 rounded-3xl shadow-2xl border border-zinc-800">
                  {/* Table Header */}
                  <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 px-8 py-6 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Questionnaires</h3>
                        <p className="text-zinc-400">Manage and monitor all your application forms</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-zinc-800/50 rounded-lg px-4 py-2 border border-zinc-700">
                          <span className="text-zinc-300 text-sm font-medium">{questionnaires.length} Total Forms</span>
                        </div>
                        <div className="bg-green-900/20 rounded-lg px-4 py-2 border border-green-600/30">
                          <span className="text-green-200 text-sm font-medium">{questionnaires.filter(q => q.isActive).length} Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Table with Custom Scrollbar */}
                  <div className="overflow-x-auto custom-scrollbar">
                    <style jsx>{`
                      .custom-scrollbar::-webkit-scrollbar {
                        height: 12px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: #1f2937;
                        border-radius: 6px;
                        margin: 0 8px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(90deg, #a78bfa, #7c3aed);
                        border-radius: 6px;
                        border: 2px solid #1f2937;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(90deg, #7c3aed, #4c1d95);
                      }
                      .custom-scrollbar::-webkit-scrollbar-corner {
                        background: #1f2937;
                      }
                    `}</style>
                    <table className="min-w-full" style={{ minWidth: '1200px' }}>
                      <thead className="bg-zinc-950/80 sticky top-0 z-10">
                      <tr className="text-zinc-400 border-b border-zinc-800">
                          <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '200px' }}>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Title
                            </div>
                          </th>
                          <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '180px' }}>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                              </svg>
                              Job Position
                            </div>
                          </th>
                          <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '250px' }}>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Description
                            </div>
                          </th>
                          <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '140px' }}>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Questions
                            </div>
                          </th>
                          <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '120px' }}>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Status
                            </div>
                          </th>
                          <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '140px' }}>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Created
                            </div>
                          </th>
                          <th className="py-4 px-6 text-left font-semibold" style={{ minWidth: '160px' }}>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                              </svg>
                              Actions
                            </div>
                          </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {questionnaires.map((questionnaire, idx) => (
                        <tr
                          key={questionnaire._id}
                            className={idx % 2 === 0 ? "bg-zinc-900/50" : "bg-zinc-800/50" + " hover:bg-zinc-700/50 transition-all duration-200"}
                          onClick={() => {
                            setSelectedQuestionnaire(questionnaire);
                            setView("preview");
                          }}
                        >
                            <td className="py-4 px-6">
                              <div className="flex flex-col">
                                <span className="font-semibold text-purple-300 text-base">{questionnaire.title}</span>
                                <span className="text-zinc-500 text-sm">ID: {questionnaire._id}</span>
                            </div>
                          </td>
                            <td className="py-4 px-6">
                              <span className="text-zinc-200 font-medium">{getJobTitle(questionnaire.jobId)}</span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="max-w-xs">
                                <span className="text-zinc-300 text-sm leading-relaxed">{questionnaire.description}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-orange-600/20 text-orange-200 text-sm rounded-lg border border-orange-600/30 font-medium">
                                  {questionnaire.questions.length} questions
                            </span>
                              </div>
                          </td>
                            <td className="py-4 px-6">
                              <div className="flex gap-1">
                                {questionnaire.isActive ? (
                                  <span className="px-3 py-1 bg-green-600/20 text-green-200 text-sm rounded-lg border border-green-600/30 font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    Active
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-zinc-600/20 text-zinc-200 text-sm rounded-lg border border-zinc-600/30 font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                                    Inactive
                                  </span>
                                )}
                              </div>
                          </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-zinc-300">{new Date(questionnaire.createdAt || '').toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex gap-2">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setSelectedQuestionnaire(questionnaire);
                                  setView("preview");
                                }}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Preview
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  copyQuestionnaire(questionnaire);
                                }}
                                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-1"
                              >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Copy
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  startEdit(questionnaire);
                                }}
                                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-lg text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-1"
                              >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  showDeleteConfirmation(questionnaire);
                                }}
                                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-1"
                              >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>

                  {/* Table Footer */}
                  <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 px-8 py-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Showing {questionnaires.length} questionnaires</span>
                      <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Add/Edit Form */}
          {(view === "add" || view === "edit") && (
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 rounded-3xl shadow-2xl p-8 border border-zinc-800 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  {view === "edit" ? "Edit" : "Create"} Questionnaire
                </h2>
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-zinc-700 hover:bg-zinc-800 rounded-xl text-white font-bold transition-all"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-zinc-800/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Job Position *</label>
                      <select
                        name="jobId"
                        value={form.jobId}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        required
                      >
                        <option value="">Select a job position</option>
                        {jobs.map(job => (
                          <option key={job.id} value={job.id}>
                            {job.title} - {job.department}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-300 mb-2 font-medium">Status</label>
                      <select
                        name="isActive"
                        value={form.isActive.toString()}
                        onChange={(e) => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-zinc-300 mb-2 font-medium">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleFormChange}
                        placeholder="e.g., Software Engineer Application Form"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-zinc-300 mb-2 font-medium">Description *</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        placeholder="Brief description of this questionnaire..."
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Questions Section */}
                <div className="bg-zinc-800/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Questions ({form.questions.length})</h3>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  {form.questions.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                      <p className="text-zinc-400 text-lg">No questions yet. Add your first question to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {form.questions.map((question, index) => (
                        <div key={question.id} className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <h4 className="text-lg font-semibold text-white">Question {index + 1}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => moveQuestion(index, index - 1)}
                                disabled={index === 0}
                                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveQuestion(index, index + 1)}
                                disabled={index === form.questions.length - 1}
                                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeQuestion(index)}
                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-zinc-300 mb-2 font-medium">Question Type *</label>
                              <select
                                value={question.type}
                                onChange={(e) => updateQuestion(index, { type: e.target.value as QuestionType })}
                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                              >
                                {questionTypes.map(type => (
                                  <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 text-zinc-300">
                                <input
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                                  className="w-4 h-4 text-purple-600 bg-zinc-800 border-zinc-700 rounded focus:ring-purple-500"
                                />
                                Required
                              </label>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-zinc-300 mb-2 font-medium">Question Label *</label>
                            <input
                              type="text"
                              value={question.label}
                              onChange={(e) => updateQuestion(index, { label: e.target.value })}
                              placeholder="Enter your question..."
                              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                              required
                            />
                          </div>

                          {['text', 'textarea', 'email', 'phone', 'number'].includes(question.type) && (
                            <div className="mb-4">
                              <label className="block text-zinc-300 mb-2 font-medium">Placeholder</label>
                              <input
                                type="text"
                                value={question.placeholder || ''}
                                onChange={(e) => updateQuestion(index, { placeholder: e.target.value })}
                                placeholder="Optional placeholder text..."
                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                              />
                            </div>
                          )}

                          {['select', 'radio', 'checkbox'].includes(question.type) && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-zinc-300 font-medium">Options *</label>
                                <button
                                  type="button"
                                  onClick={() => addOption(index)}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-bold transition-all"
                                >
                                  Add Option
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(question.options || []).map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                      placeholder={`Option ${optionIndex + 1}`}
                                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                      required
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeOption(index, optionIndex)}
                                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Validation Settings */}
                          <div className="mb-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                            <h5 className="text-zinc-300 font-medium mb-3 flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Validation & Security Settings
                            </h5>
                            
                            {/* Text Input Validation */}
                            {['text', 'textarea', 'email'].includes(question.type) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-zinc-400 text-sm mb-1">Min Length</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={question.validation?.minLength || ''}
                                    onChange={(e) => updateQuestion(index, { 
                                      validation: { 
                                        ...question.validation, 
                                        minLength: e.target.value ? parseInt(e.target.value) : undefined 
                                      } 
                                    })}
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-400 text-sm mb-1">Max Length</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={question.validation?.maxLength || ''}
                                    onChange={(e) => updateQuestion(index, { 
                                      validation: { 
                                        ...question.validation, 
                                        maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                                      } 
                                    })}
                                    placeholder={question.type === 'text' ? '255' : question.type === 'textarea' ? '2000' : '254'}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Number Input Validation */}
                            {question.type === 'number' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-zinc-400 text-sm mb-1">Min Value</label>
                                  <input
                                    type="number"
                                    value={question.validation?.min || ''}
                                    onChange={(e) => updateQuestion(index, { 
                                      validation: { 
                                        ...question.validation, 
                                        min: e.target.value ? parseInt(e.target.value) : undefined 
                                      } 
                                    })}
                                    placeholder="No limit"
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-400 text-sm mb-1">Max Value</label>
                                  <input
                                    type="number"
                                    value={question.validation?.max || ''}
                                    onChange={(e) => updateQuestion(index, { 
                                      validation: { 
                                        ...question.validation, 
                                        max: e.target.value ? parseInt(e.target.value) : undefined 
                                      } 
                                    })}
                                    placeholder="No limit"
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm"
                                  />
                                </div>
                              </div>
                            )}

                            {/* File Upload Validation */}
                            {question.type === 'file' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-zinc-400 text-sm mb-1">Allowed File Types</label>
                                  <div className="flex flex-wrap gap-2">
                                    {['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'].map(fileType => (
                                      <label key={fileType} className="flex items-center gap-2 text-sm">
                                        <input
                                          type="checkbox"
                                          checked={question.validation?.allowedFileTypes?.includes(fileType) || false}
                                          onChange={(e) => {
                                            const currentTypes = question.validation?.allowedFileTypes || [];
                                            const newTypes = e.target.checked 
                                              ? [...currentTypes, fileType]
                                              : currentTypes.filter(t => t !== fileType);
                                            updateQuestion(index, { 
                                              validation: { 
                                                ...question.validation, 
                                                allowedFileTypes: newTypes 
                                              } 
                                            });
                                          }}
                                          className="w-3 h-3 text-purple-600 bg-zinc-900 border-zinc-700 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-zinc-300">.{fileType.toUpperCase()}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-zinc-400 text-sm mb-1">Max File Size (MB)</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="50"
                                      value={question.validation?.maxFileSize ? Math.round(question.validation.maxFileSize / (1024 * 1024)) : ''}
                                      onChange={(e) => updateQuestion(index, { 
                                        validation: { 
                                          ...question.validation, 
                                          maxFileSize: e.target.value ? parseInt(e.target.value) * 1024 * 1024 : undefined 
                                        } 
                                      })}
                                      placeholder="5"
                                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-zinc-400 text-sm mb-1">Max Files</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="10"
                                      value={question.validation?.maxFiles || ''}
                                      onChange={(e) => updateQuestion(index, { 
                                        validation: { 
                                          ...question.validation, 
                                          maxFiles: e.target.value ? parseInt(e.target.value) : undefined 
                                        } 
                                      })}
                                      placeholder="1"
                                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 bg-zinc-700 hover:bg-zinc-800 rounded-2xl text-white font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 rounded-2xl text-white font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {view === "edit" ? "Update" : "Create"} Questionnaire
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Preview Modal */}
          {view === "preview" && selectedQuestionnaire && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Questionnaire Preview</h2>
                  <button
                    onClick={() => {
                      setView("menu");
                      setSelectedQuestionnaire(null);
                    }}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{selectedQuestionnaire.title}</h3>
                    <p className="text-zinc-400">{selectedQuestionnaire.description}</p>
                  </div>

                  <div className="space-y-4">
                    {selectedQuestionnaire.questions.map((question, index) => (
                      <div key={question.id} className="bg-zinc-800/50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-semibold text-purple-400">Q{index + 1}</span>
                          <span className="text-sm text-zinc-500">({question.type})</span>
                          {question.required && (
                            <span className="text-red-400 text-sm">*</span>
                          )}
                        </div>
                        <p className="text-white font-medium mb-3">{question.label}</p>
                        
                        {/* Preview Input */}
                        {question.type === 'text' && (
                          <input
                            type="text"
                            placeholder={question.placeholder || "Enter your answer..."}
                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400"
                            disabled
                          />
                        )}
                        {question.type === 'textarea' && (
                          <textarea
                            placeholder={question.placeholder || "Enter your answer..."}
                            rows={3}
                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 resize-none"
                            disabled
                          />
                        )}
                        {question.type === 'email' && (
                          <input
                            type="email"
                            placeholder={question.placeholder || "Enter your email..."}
                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400"
                            disabled
                          />
                        )}
                        {question.type === 'select' && (
                          <select className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white" disabled>
                            <option value="">Select an option...</option>
                            {question.options?.map((option, i) => (
                              <option key={i} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                        {question.type === 'radio' && (
                          <div className="space-y-2">
                            {question.options?.map((option, i) => (
                              <label key={i} className="flex items-center gap-2 text-zinc-300">
                                <input type="radio" name={`preview-${question.id}`} className="text-purple-600" disabled />
                                {option}
                              </label>
                            ))}
                          </div>
                        )}
                        {question.type === 'checkbox' && (
                          <div className="space-y-2">
                            {question.options?.map((option, i) => (
                              <label key={i} className="flex items-center gap-2 text-zinc-300">
                                <input type="checkbox" className="text-purple-600" disabled />
                                {option}
                              </label>
                            ))}
                          </div>
                        )}
                        {question.type === 'file' && (
                          <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 text-center text-zinc-400">
                            Click to upload file
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && questionnaireToDelete && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-800 animate-fade-in">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Trash2 className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4">Delete Questionnaire</h2>
                  
                  <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
                    Are you sure you want to delete the questionnaire{" "}
                    <span className="text-white font-semibold">"{questionnaireToDelete.title}"</span>?
                  </p>
                  
                  <p className="text-zinc-400 text-sm mb-8">
                    This action cannot be undone. The questionnaire and all its questions will be permanently removed.
                  </p>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setQuestionnaireToDelete(null);
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
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminLayout>
  );
} 