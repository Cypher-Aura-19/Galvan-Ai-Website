"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  X,
  Loader2,
  User,
  Mail,
  Phone,
  File,
  MessageSquare
} from 'lucide-react';

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
};

type Job = {
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
};

interface JobApplicationFormProps {
  job: Job;
  onClose: () => void;
  isDark?: boolean;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, onClose, isDark = true }) => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    coverLetter: '',
    resume: null as File | null,
    resumeUrl: null as string | null,
  });
  const [responses, setResponses] = useState<{[key: string]: any}>({});
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: any}>({});
  const [errors, setErrors] = useState<{[key: string]: string | undefined}>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Always 3 steps: Personal Info, Questionnaire (optional), Review
  const totalSteps = 3;

  useEffect(() => {
    fetchQuestionnaire();
  }, [job.id]);

  const fetchQuestionnaire = async () => {
    try {
      const response = await fetch(`/api/questionnaires?jobId=${job.id}`);
      if (response.ok) {
        const questionnaires = await response.json();
        const activeQuestionnaire = questionnaires.find((q: Questionnaire) => q.isActive);
        setQuestionnaire(activeQuestionnaire || null);
      }
    } catch (error) {
      console.error('Error fetching questionnaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field: string, value: any): string | null => {
    const suspiciousPatterns = [
      /<script/i, /javascript:/i, /on\w+\s*=/i, /data:/i, /vbscript:/i, /expression\(/i,
      /<iframe/i, /<object/i, /<embed/i, /<form/i, /<input/i, /<textarea/i, /<select/i
    ];

    switch (field) {
      case 'applicantName':
        if (!value.trim()) {
          return 'Name is required';
        }
        const sanitizedName = value.trim();
        if (sanitizedName.length < 2 || sanitizedName.length > 30) {
          return 'Name must be between 2 and 30 characters';
        }
        if (suspiciousPatterns.some(pattern => pattern.test(sanitizedName))) {
          return 'Invalid characters detected in name';
        }
        break;

      case 'applicantEmail':
        if (!value.trim()) {
          return 'Email is required';
        }
        const sanitizedEmail = value.trim().toLowerCase();
        if (sanitizedEmail.length > 254) {
          return 'Email address too long';
        }
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(sanitizedEmail)) {
          return 'Invalid email format';
        }
        if (suspiciousPatterns.some(pattern => pattern.test(sanitizedEmail))) {
          return 'Invalid characters detected in email';
        }
        break;

      case 'applicantPhone':
        if (!value || !value.trim()) {
          return 'Phone number is required';
        }
        const sanitizedPhone = value.trim();
        if (sanitizedPhone.length < 10 || sanitizedPhone.length > 20) {
          return 'Phone number must be between 10 and 20 characters';
        }
        if (suspiciousPatterns.some(pattern => pattern.test(sanitizedPhone))) {
          return 'Invalid characters detected in phone number';
        }
        break;

      case 'coverLetter':
        if (!value || !value.trim()) {
          return 'Cover letter is required';
        }
        const sanitizedCoverLetter = value.trim();
        if (sanitizedCoverLetter.length < 10) {
          return 'Cover letter must be at least 10 characters';
        }
        if (sanitizedCoverLetter.length > 1000) {
          return 'Cover letter must be less than 1000 characters';
        }
        if (suspiciousPatterns.some(pattern => pattern.test(sanitizedCoverLetter))) {
          return 'Invalid characters detected in cover letter';
        }
        break;

      case 'resume':
        if (!value) {
          return 'Resume is required';
        }
        if (value.type !== 'application/pdf') {
          return 'Resume must be a PDF file';
        }
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (value.size > maxSize) {
          return 'Resume file size must be less than 2MB';
        }
        break;
    }
    return null;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  };

  const validateQuestionField = (question: Question, value: any): string | null => {
    if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `Please provide your ${question.label.toLowerCase()}`;
    }

    if (value && question.validation) {
      const { minLength, maxLength, min, max, allowedFileTypes, maxFileSize } = question.validation;
      
      // Text input validation
      if (['text', 'textarea', 'email'].includes(question.type) && typeof value === 'string') {
        if (minLength && value.length < minLength) {
          return `Minimum ${minLength} characters required`;
        }
        if (maxLength && value.length > maxLength) {
          return `Maximum ${maxLength} characters allowed`;
        }
      }
      
      // Number validation
      if (question.type === 'number' && typeof value === 'number') {
        if (min !== undefined && value < min) {
          return `Minimum value is ${min}`;
        }
        if (max !== undefined && value > max) {
          return `Maximum value is ${max}`;
        }
      }
    }

    // Security pattern detection
    if (value && typeof value === 'string') {
      const suspiciousPatterns = [
        /<script/i, /javascript:/i, /on\w+\s*=/i, /data:/i, /vbscript:/i, /expression\(/i,
        /<iframe/i, /<object/i, /<embed/i, /<form/i, /<input/i, /<textarea/i, /<select/i
      ];
      
      if (suspiciousPatterns.some(pattern => pattern.test(value))) {
        return 'Invalid characters detected';
      }
    }

    return null;
  };

  const handleQuestionResponse = (questionId: string, answer: any) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
    
    // Real-time validation for questionnaire fields
    const question = questionnaire?.questions.find(q => q.id === questionId);
    if (question) {
      const error = validateQuestionField(question, answer);
      setErrors(prev => ({
        ...prev,
        [questionId]: error || undefined
      }));
    }
  };

  const uploadFile = async (file: File, questionId?: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    if (questionId) {
      formData.append('questionId', questionId);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const result = await response.json();
    return result.fileUrl;
  };

  const handleFileUpload = async (file: File, questionId?: string) => {
    try {
      // Validate file before upload
      if (questionId && questionnaire) {
        const question = questionnaire.questions.find(q => q.id === questionId);
        if (question && question.validation) {
          const { allowedFileTypes, maxFileSize } = question.validation;
          
          // Check file type
          if (allowedFileTypes && allowedFileTypes.length > 0) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (!fileExtension || !allowedFileTypes.includes(fileExtension)) {
              throw new Error(`Only ${allowedFileTypes.map(t => t.toUpperCase()).join(', ')} files are allowed`);
            }
          }
          
          // Check file size
          if (maxFileSize && file.size > maxFileSize) {
            const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
            throw new Error(`File size must be less than ${maxSizeMB}MB`);
          }
        }
      } else {
        // For resume upload - validate PDF and 2MB limit
        if (file.type !== 'application/pdf') {
          throw new Error('Resume must be a PDF file');
        }
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
          throw new Error('Resume file size must be less than 2MB');
        }
      }

      const fileUrl = await uploadFile(file, questionId);
      
      if (questionId) {
        // For questionnaire file questions
        setResponses(prev => ({
          ...prev,
          [questionId]: {
            fileUrl,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          }
        }));
        setUploadedFiles(prev => ({ ...prev, [questionId]: file }));
      } else {
        // For resume upload
        setFormData(prev => ({
          ...prev,
          resume: file,
          resumeUrl: fileUrl
        }));
        
        // Clear any resume errors after successful upload
        setErrors(prev => ({
          ...prev,
          resume: undefined
        }));
      }
    } catch (error) {
      console.error('File upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      
      // Check if this is a file size error from the server
      const isSizeError = errorMessage.includes('file too large') || 
                          errorMessage.includes('Maximum size') || 
                          errorMessage.includes('less than 2MB');
      
      // Only show the error message if it's not related to file size
      // since we already handle that client-side
      if (!isSizeError) {
        setError(errorMessage);
      }
      
      // Set field-specific error for resume
      if (!questionId) {
        // If it's a size error, use our standard client-side message
        const displayError = isSizeError ? 'Resume file size must be less than 2MB' : errorMessage;
        setErrors(prev => ({
          ...prev,
          resume: displayError
        }));
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (step === 1) {
      // Enhanced security validation for name - MANDATORY
      if (!formData.applicantName.trim()) {
        newErrors.applicantName = 'Name is required';
      } else {
        const sanitizedName = formData.applicantName.trim();
        if (sanitizedName.length < 2 || sanitizedName.length > 30) {
          newErrors.applicantName = 'Name must be between 2 and 30 characters';
        }
        
        // Check for suspicious patterns
        const suspiciousPatterns = [
          /<script/i, /javascript:/i, /on\w+\s*=/i, /data:/i, /vbscript:/i, /expression\(/i,
          /<iframe/i, /<object/i, /<embed/i, /<form/i, /<input/i, /<textarea/i, /<select/i
        ];
        
        if (suspiciousPatterns.some(pattern => pattern.test(sanitizedName))) {
          newErrors.applicantName = 'Invalid characters detected in name';
        }
      }

      // Enhanced security validation for email - MANDATORY
      if (!formData.applicantEmail.trim()) {
        newErrors.applicantEmail = 'Email is required';
      } else {
        const sanitizedEmail = formData.applicantEmail.trim().toLowerCase();
        if (sanitizedEmail.length > 254) {
          newErrors.applicantEmail = 'Email address too long';
        } else {
          // Enhanced email validation (RFC 5322 compliant)
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          if (!emailRegex.test(sanitizedEmail)) {
            newErrors.applicantEmail = 'Invalid email format';
          }
          
          // Check for suspicious patterns
          const suspiciousPatterns = [
            /<script/i, /javascript:/i, /on\w+\s*=/i, /data:/i, /vbscript:/i, /expression\(/i,
            /<iframe/i, /<object/i, /<embed/i, /<form/i, /<input/i, /<textarea/i, /<select/i
          ];
          
          if (suspiciousPatterns.some(pattern => pattern.test(sanitizedEmail))) {
            newErrors.applicantEmail = 'Invalid characters detected in email';
          }
        }
      }

      // Validate phone number - MANDATORY
      if (!formData.applicantPhone.trim()) {
        newErrors.applicantPhone = 'Phone number is required';
      } else {
        const sanitizedPhone = formData.applicantPhone.trim();
        if (sanitizedPhone.length < 10 || sanitizedPhone.length > 20) {
          newErrors.applicantPhone = 'Phone number must be between 10 and 20 characters';
        }
        
        const suspiciousPatterns = [
          /<script/i, /javascript:/i, /on\w+\s*=/i, /data:/i, /vbscript:/i, /expression\(/i,
          /<iframe/i, /<object/i, /<embed/i, /<form/i, /<input/i, /<textarea/i, /<select/i
        ];
        
        if (suspiciousPatterns.some(pattern => pattern.test(sanitizedPhone))) {
          newErrors.applicantPhone = 'Invalid characters detected in phone number';
        }
      }

      // Validate resume file - MANDATORY
      if (!formData.resume) {
        newErrors.resume = 'Resume is required';
      } else {
        // Check file type - only PDF allowed
        if (formData.resume.type !== 'application/pdf') {
          newErrors.resume = 'Resume must be a PDF file';
        }
        
        // Check file size - max 2MB
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (formData.resume.size > maxSize) {
          newErrors.resume = 'Resume file size must be less than 2MB';
          // Clear any server-side file size errors to avoid duplicate messages
          if (error && error.includes('file size')) {
            setError(null);
          }
        }
      }

      // Validate cover letter - MANDATORY
      if (!formData.coverLetter.trim()) {
        newErrors.coverLetter = 'Cover letter is required';
      } else {
        const sanitizedCoverLetter = formData.coverLetter.trim();
        if (sanitizedCoverLetter.length < 10) {
          newErrors.coverLetter = 'Cover letter must be at least 10 characters';
        } else if (sanitizedCoverLetter.length > 1000) {
          newErrors.coverLetter = 'Cover letter must be less than 1000 characters';
        }
        
        const suspiciousPatterns = [
          /<script/i, /javascript:/i, /on\w+\s*=/i, /data:/i, /vbscript:/i, /expression\(/i,
          /<iframe/i, /<object/i, /<embed/i, /<form/i, /<input/i, /<textarea/i, /<select/i
        ];
        
        if (suspiciousPatterns.some(pattern => pattern.test(sanitizedCoverLetter))) {
          newErrors.coverLetter = 'Invalid characters detected in cover letter';
        }
      }
    }

    // Validate questionnaire only if it exists and we're on step 2
    if (step === 2 && questionnaire) {
      // Check if there are any required questions
      const requiredQuestions = questionnaire.questions.filter(q => q.required);
      
      if (requiredQuestions.length > 0) {
        // Validate all required questions
        requiredQuestions.forEach(question => {
          const answer = responses[question.id];
          // Required field validation - ALL required questions must be answered
          if (question.type === 'checkbox') {
            if (!Array.isArray(answer) || answer.length === 0) {
              newErrors[question.id] = 'This field is required';
            }
          } else if (
            !answer ||
            (typeof answer === 'string' && answer.trim() === '') ||
            (typeof answer === 'object' && answer !== null && !answer.fileUrl && !answer.fileName)
          ) {
            newErrors[question.id] = 'This field is required';
          }
        });

        // Additional validation for answered questions
        questionnaire.questions.forEach(question => {
          const answer = responses[question.id];
          
          // Only validate if there's an answer and validation rules exist
          if (answer && question.validation) {
            const { minLength, maxLength, min, max, allowedFileTypes, maxFileSize } = question.validation;
            
            // Text input validation
            if (['text', 'textarea', 'email'].includes(question.type) && typeof answer === 'string') {
              if (minLength && answer.length < minLength) {
                newErrors[question.id] = `Minimum ${minLength} characters required`;
              }
              if (maxLength && answer.length > maxLength) {
                newErrors[question.id] = `Maximum ${maxLength} characters allowed`;
              }
            }
            
            // Number validation
            if (question.type === 'number' && typeof answer === 'number') {
              if (min !== undefined && answer < min) {
                newErrors[question.id] = `Minimum value is ${min}`;
              }
              if (max !== undefined && answer > max) {
                newErrors[question.id] = `Maximum value is ${max}`;
              }
            }
            
            // File validation
            if (question.type === 'file' && answer && typeof answer === 'object' && 'fileUrl' in answer) {
              const file = uploadedFiles[question.id];
              if (file) {
                // Check file type
                if (allowedFileTypes && allowedFileTypes.length > 0) {
                  const fileExtension = file.name.split('.').pop()?.toLowerCase();
                  if (!fileExtension || !allowedFileTypes.includes(fileExtension)) {
                    newErrors[question.id] = `Only ${allowedFileTypes.map(t => t.toUpperCase()).join(', ')} files are allowed`;
                  }
                }
                
                // Check file size
                if (maxFileSize && file.size > maxFileSize) {
                  const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
                  newErrors[question.id] = `File size must be less than ${maxSizeMB}MB`;
                }
              }
            }
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setSubmitting(true);
    setError(null);

    try {
      // Prepare application data
      const applicationData: any = {
        jobId: job.id,
        jobTitle: job.title,
        applicantName: formData.applicantName,
        applicantEmail: formData.applicantEmail,
        applicantPhone: formData.applicantPhone,
        coverLetter: formData.coverLetter,
        resume: formData.resumeUrl ? {
          fileUrl: formData.resumeUrl,
          fileName: formData.resume!.name,
          fileSize: formData.resume!.size,
          fileType: formData.resume!.type
        } : undefined,
        responses: [],
      };

      // Add questionnaire data if it exists
      if (questionnaire) {
        applicationData.questionnaireId = questionnaire._id;
        applicationData.responses = questionnaire.questions
          .filter(q => q.required || responses[q.id])
          .map(question => ({
            questionId: question.id,
            questionLabel: question.label,
            questionType: question.type,
            answer: responses[question.id] || ''
          }));
      }

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to submit application');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';
    const error = errors[question.id];

    switch (question.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div>
            <input
              type={question.type === 'email' ? 'email' : question.type === 'number' ? 'number' : 'text'}
              value={value}
              onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
              placeholder={question.placeholder || `Enter your ${question.label.toLowerCase()}`}
              maxLength={question.validation?.maxLength}
              min={question.validation?.min}
              max={question.validation?.max}
              className={`w-full px-4 py-3 border-2 rounded-2xl transition-all backdrop-blur-sm ${
                error 
                  ? 'border-red-500/50' 
                  : isDark 
                    ? 'bg-white/5 border-white/20 focus:border-white/40 text-white placeholder-zinc-400' 
                    : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500'
              } focus:outline-none`}
            />
            {question.validation?.maxLength && (
              <div className="flex justify-between items-center mt-1">
                <p className={`text-sm ml-auto ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {String(value).length}/{question.validation.maxLength}
                </p>
              </div>
            )}
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
              placeholder={question.placeholder || `Enter your ${question.label.toLowerCase()}`}
              rows={4}
              maxLength={question.validation?.maxLength}
              className={`w-full px-4 py-3 border-2 rounded-2xl transition-all backdrop-blur-sm resize-none ${
                error 
                  ? 'border-red-500/50' 
                  : isDark 
                    ? 'bg-white/5 border-white/20 focus:border-white/40 text-white placeholder-zinc-400' 
                    : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500'
              } focus:outline-none`}
            />
            {question.validation?.maxLength && (
              <div className="flex justify-between items-center mt-1">
                <p className={`text-sm ml-auto ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {String(value).length}/{question.validation.maxLength}
                </p>
              </div>
            )}
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div>
            <select
              value={value}
              onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-2xl transition-all backdrop-blur-sm ${
                error 
                  ? 'border-red-500/50' 
                  : isDark 
                    ? 'bg-white/5 border-white/20 focus:border-white/40 text-white' 
                    : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900'
              } focus:outline-none`}
            >
              <option value="">Select an option...</option>
              {question.options?.map((option, index) => (
                <option key={index} value={option} className={isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900"}>
                  {option}
                </option>
              ))}
            </select>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
                    className={`w-4 h-4 text-purple-600 border-2 focus:ring-purple-500 focus:ring-2 ${
                      isDark 
                        ? 'bg-white/5 border-white/20' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <span className={`transition-colors ${
                    isDark 
                      ? 'text-white group-hover:text-gray-200' 
                      : 'text-gray-900 group-hover:text-gray-700'
                  }`}>{option}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={option}
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleQuestionResponse(question.id, newValues);
                    }}
                    className={`w-4 h-4 text-purple-600 border-2 focus:ring-purple-500 focus:ring-2 ${
                      isDark 
                        ? 'bg-white/5 border-white/20' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <span className={`transition-colors ${
                    isDark 
                      ? 'text-white group-hover:text-gray-200' 
                      : 'text-gray-900 group-hover:text-gray-700'
                  }`}>{option}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, question.id);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept={question.validation?.allowedFileTypes?.map(type => `.${type}`).join(',') || ".pdf,.doc,.docx"}
              />
              <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                error 
                  ? 'border-red-500/50' 
                  : isDark 
                    ? 'border-white/20 hover:border-white/40' 
                    : 'border-gray-200 hover:border-gray-400'
              }`}>
                {value ? (
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className={isDark ? 'text-white/80' : 'text-gray-700'}>{value.fileName || value.name}</p>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Click to change</p>
                  </div>
                ) : (
                  <>
                    <Upload className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
                    <p className={isDark ? 'text-white/80' : 'text-gray-700'}>Click to upload file</p>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                      {question.validation?.allowedFileTypes 
                        ? `${question.validation.allowedFileTypes.map(t => t.toUpperCase()).join(', ')} files`
                        : 'PDF, DOC, DOCX files'
                      }
                      {question.validation?.maxFileSize && ` (max ${Math.round(question.validation.maxFileSize / (1024 * 1024))}MB)`}
                    </p>
                  </>
                )}
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div>
            <input
              type="date"
              value={value}
              onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-2xl transition-all backdrop-blur-sm ${
                error 
                  ? 'border-red-500/50' 
                  : isDark 
                    ? 'bg-white/5 border-white/20 focus:border-white/40 text-white' 
                    : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900'
              } focus:outline-none`}
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 ${isDark ? 'bg-black/80' : 'bg-gray-900/80'}`}>
        <div className={`rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl border text-center max-w-sm w-full mx-4 ${
          isDark 
            ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <Loader2 className={`w-6 h-6 lg:w-8 lg:h-8 animate-spin mx-auto mb-3 lg:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} />
          <p className={`text-sm lg:text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading application form...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 ${isDark ? 'bg-black/80' : 'bg-gray-900/80'}`}>
        <div className={`rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl border text-center max-w-md w-full mx-4 ${
          isDark 
            ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 text-green-400 mx-auto mb-4 lg:mb-6" />
          <h2 className={`text-xl lg:text-2xl font-bold mb-3 lg:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Application Submitted!</h2>
          <p className={`mb-4 lg:mb-6 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
            Thank you for your interest in the {job.title} position. We'll review your application and get back to you soon.
          </p>
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-xl lg:rounded-2xl font-bold transition-all ${
              isDark 
                ? 'bg-white text-black hover:bg-gray-100' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isDark ? 'bg-black/80' : 'bg-gray-900/80'}`}>
      <div className={`rounded-2xl lg:rounded-3xl shadow-2xl border max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
        isDark 
          ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-800' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 rounded-t-2xl lg:rounded-t-3xl p-4 lg:p-6 border-b ${
          isDark 
            ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <h1 className={`text-lg lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Apply for {job.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all ${
                    i + 1 <= currentStep 
                      ? (isDark ? 'bg-white' : 'bg-gray-900') 
                      : (isDark ? 'bg-white/20' : 'bg-gray-400')
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className={`flex items-center gap-2 lg:gap-4 text-xs lg:text-sm ${
            isDark ? 'text-zinc-400' : 'text-gray-500'
          }`}>
            <span>{job.department}</span>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.type}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {error && (
            <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-red-500/10 border border-red-500/30 rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-3">
              <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
              <p className="text-red-400 text-sm lg:text-base">{error}</p>
            </div>
          )}

          {/* Step 1: Personal Information - ALWAYS REQUIRED */}
          {currentStep === 1 && (
            <div className="space-y-4 lg:space-y-6">
              <div className="text-center mb-6 lg:mb-8">
                <h2 className={`text-lg lg:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
                <p className={isDark ? 'text-zinc-400' : 'text-gray-600'}>All fields are required. Please provide your complete details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className={`block mb-2 font-medium flex items-center gap-2 text-sm lg:text-base ${
                    isDark ? 'text-zinc-300' : 'text-gray-700'
                  }`}>
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => handleInputChange('applicantName', e.target.value)}
                    placeholder="Enter your full name"
                    maxLength={30}
                    className={`w-full px-3 lg:px-4 py-2 lg:py-3 border-2 rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all backdrop-blur-sm ${
                      errors.applicantName 
                        ? 'border-red-500/50' 
                        : isDark 
                          ? 'bg-white/5 border-white/20 focus:border-white/40 text-white placeholder-zinc-400' 
                          : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500'
                    } focus:outline-none`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.applicantName && (
                      <p className="text-red-400 text-sm">{errors.applicantName}</p>
                    )}
                    <p className="text-zinc-500 text-sm ml-auto">
                      {formData.applicantName.length}/30
                    </p>
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 font-medium flex items-center gap-2 text-sm lg:text-base ${
                    isDark ? 'text-zinc-300' : 'text-gray-700'
                  }`}>
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.applicantEmail}
                    onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
                    placeholder="Enter your email"
                    maxLength={254}
                    className={`w-full px-3 lg:px-4 py-2 lg:py-3 border-2 rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all backdrop-blur-sm ${
                      errors.applicantEmail 
                        ? 'border-red-500/50' 
                        : isDark 
                          ? 'bg-white/5 border-white/20 focus:border-white/40 text-white placeholder-zinc-400' 
                          : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500'
                    } focus:outline-none`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.applicantEmail && (
                      <p className="text-red-400 text-sm">{errors.applicantEmail}</p>
                    )}
                    <p className="text-zinc-500 text-sm ml-auto">
                      {formData.applicantEmail.length}/254
                    </p>
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 font-medium flex items-center gap-2 text-sm lg:text-base ${
                    isDark ? 'text-zinc-300' : 'text-gray-700'
                  }`}>
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.applicantPhone}
                    onChange={(e) => handleInputChange('applicantPhone', e.target.value)}
                    placeholder="Enter your phone number"
                    maxLength={20}
                    className={`w-full px-3 lg:px-4 py-2 lg:py-3 border-2 rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all backdrop-blur-sm ${
                      errors.applicantPhone 
                        ? 'border-red-500/50' 
                        : isDark 
                          ? 'bg-white/5 border-white/20 focus:border-white/40 text-white placeholder-zinc-400' 
                          : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500'
                    } focus:outline-none`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.applicantPhone && (
                      <p className="text-red-400 text-sm">{errors.applicantPhone}</p>
                    )}
                    <p className="text-zinc-500 text-sm ml-auto">
                      {formData.applicantPhone.length}/20
                    </p>
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 font-medium flex items-center gap-2 text-sm lg:text-base ${
                    isDark ? 'text-zinc-300' : 'text-gray-700'
                  }`}>
                    <File className="w-4 h-4" />
                    Resume/CV *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf"
                    />
                    <div className={`border-2 border-dashed rounded-xl lg:rounded-2xl p-3 lg:p-4 text-center transition-all cursor-pointer ${
                      errors.resume 
                        ? 'border-red-500/50' 
                        : isDark 
                          ? 'border-white/20 hover:border-white/40' 
                          : 'border-gray-200 hover:border-gray-400'
                    }`}>
                      {formData.resume ? (
                        <div className="text-center">
                          <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-green-400 mx-auto mb-2" />
                          <p className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{formData.resume.name}</p>
                          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Click to change</p>
                        </div>
                      ) : (
                        <>
                          <Upload className={`w-5 h-5 lg:w-6 lg:h-6 mx-auto mb-2 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
                          <p className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Upload resume (required)</p>
                          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>PDF only, max 2MB</p>
                        </>
                      )}
                    </div>
                    {errors.resume && (
                      <p className="text-red-400 text-sm mt-1">{errors.resume}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className={`block mb-2 font-medium flex items-center gap-2 text-sm lg:text-base ${
                  isDark ? 'text-zinc-300' : 'text-gray-700'
                }`}>
                  <MessageSquare className="w-4 h-4" />
                  Cover Letter *
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  placeholder="Tell us why you're interested in this position..."
                  rows={4}
                  maxLength={1000}
                  className={`w-full px-3 lg:px-4 py-2 lg:py-3 border-2 rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all backdrop-blur-sm resize-none ${
                    errors.coverLetter 
                      ? 'border-red-500/50' 
                      : isDark 
                        ? 'bg-white/5 border-white/20 focus:border-white/40 text-white placeholder-zinc-400' 
                        : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500'
                  } focus:outline-none`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.coverLetter && (
                    <p className="text-red-400 text-sm">{errors.coverLetter}</p>
                  )}
                  <p className="text-zinc-500 text-sm ml-auto">
                    {formData.coverLetter.length}/1000
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Questionnaire - REQUIRED QUESTIONS MUST BE ANSWERED */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {questionnaire ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{questionnaire.title}</h2>
                    <p className={isDark ? 'text-zinc-400' : 'text-gray-600'}>{questionnaire.description}</p>
                    <p className={`text-sm mt-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Questions marked with * are required and must be answered.</p>
                  </div>

                  <div className="space-y-6">
                    {questionnaire.questions.map((question, index) => (
                      <div key={question.id} className={`backdrop-blur-sm border-2 rounded-2xl p-6 ${
                        isDark 
                          ? 'bg-white/5 border-white/20' 
                          : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isDark 
                              ? 'bg-white/10 text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {question.label}
                              {question.required && <span className="text-red-400 ml-1">*</span>}
                            </h3>
                            {question.placeholder && (
                              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{question.placeholder}</p>
                            )}
                          </div>
                        </div>
                        
                        {renderQuestion(question)}
                        
                        {errors[question.id] && (
                          <p className="text-red-400 text-sm mt-2">{errors[question.id]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`} />
                  <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Additional Questions</h2>
                  <p className={isDark ? 'text-zinc-400' : 'text-gray-600'}>This position doesn't require additional information. You can proceed to review your application.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Submit - ALWAYS REQUIRED */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Review Your Application</h2>
                <p className={isDark ? 'text-zinc-400' : 'text-gray-600'}>Please review your information before submitting</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`backdrop-blur-sm border-2 rounded-2xl p-6 ${
                  isDark 
                    ? 'bg-white/5 border-white/20' 
                    : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>Name:</span>
                      <p className={isDark ? 'text-white' : 'text-gray-900'}>{formData.applicantName}</p>
                    </div>
                    <div>
                      <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>Email:</span>
                      <p className={isDark ? 'text-white' : 'text-gray-900'}>{formData.applicantEmail}</p>
                    </div>
                    {formData.applicantPhone && (
                      <div>
                        <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>Phone:</span>
                        <p className={isDark ? 'text-white' : 'text-gray-900'}>{formData.applicantPhone}</p>
                      </div>
                    )}
                    {formData.resume && (
                      <div>
                        <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>Resume:</span>
                        <p className={isDark ? 'text-white' : 'text-gray-900'}>{formData.resume.name}</p>
                        {formData.resumeUrl && (
                          <a 
                            href={formData.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                          >
                            View file
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`backdrop-blur-sm border-2 rounded-2xl p-6 ${
                  isDark 
                    ? 'bg-white/5 border-white/20' 
                    : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Job Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>Position:</span>
                      <p className={isDark ? 'text-white' : 'text-gray-900'}>{job.title}</p>
                    </div>
                    <div>
                      <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>Department:</span>
                      <p className={isDark ? 'text-white' : 'text-gray-900'}>{job.department}</p>
                    </div>
                    <div>
                      <span className={isDark ? 'text-zinc-400' : 'text-gray-600'}>Location:</span>
                      <p className={isDark ? 'text-white' : 'text-gray-900'}>{job.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {questionnaire && (
                <div className={`backdrop-blur-sm border-2 rounded-2xl p-6 ${
                  isDark 
                    ? 'bg-white/5 border-white/20' 
                    : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Responses</h3>
                  <div className="space-y-4">
                    {questionnaire.questions.map((question, index) => (
                      <div key={question.id} className={`border-b pb-4 last:border-b-0 ${
                        isDark ? 'border-white/10' : 'border-gray-200'
                      }`}>
                        <p className={`text-sm mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Q{index + 1}: {question.label}</p>
                        <p className={isDark ? 'text-white' : 'text-gray-900'}>
                          {Array.isArray(responses[question.id]) 
                            ? responses[question.id].join(', ')
                            : responses[question.id] && typeof responses[question.id] === 'object' && 'fileName' in responses[question.id]
                            ? responses[question.id].fileName
                            : responses[question.id] && typeof responses[question.id] === 'object' && 'name' in responses[question.id]
                            ? responses[question.id].name
                            : responses[question.id] || 'Not answered'
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 rounded-b-2xl lg:rounded-b-3xl p-4 lg:p-6 border-t ${
          isDark 
            ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={currentStep === 1 ? onClose : handleBack}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-bold transition-all flex items-center gap-2 text-sm lg:text-base ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            <div className="flex items-center gap-3 lg:gap-4">
              <span className={`text-xs lg:text-sm ${
                isDark ? 'text-zinc-400' : 'text-gray-500'
              }`}>
                Step {currentStep} of {totalSteps}
              </span>
              
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className={`px-6 lg:px-8 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-bold transition-all flex items-center gap-2 text-sm lg:text-base ${
                    isDark 
                      ? 'bg-white text-black hover:bg-gray-100' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Next
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 lg:px-8 py-2 lg:py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-xl lg:rounded-2xl text-white font-bold transition-all flex items-center gap-2 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;