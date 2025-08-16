import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Send, Mail, Check, X, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// File Upload Component
const FileUpload = ({ file, onFileSelect, onFileRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/plain') {
      onFileSelect(selectedFile);
      toast.success('File uploaded successfully!');
    } else {
      toast.error('Please select a valid text file (.txt)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/plain') {
      onFileSelect(droppedFile);
      toast.success('File uploaded successfully!');
    } else {
      toast.error('Please drop a valid text file (.txt)');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="mr-2 h-5 w-5" />
        Upload Meeting Transcript
      </h2>
      
      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Drop your transcript file here, or click to browse</p>
          <p className="text-sm text-gray-500">Supports .txt files only</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload transcript file"
          />
        </div>
      ) : (
        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            onClick={onFileRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

// Prompt Input Component
const PromptInput = ({ prompt, onPromptChange }) => {
  const predefinedPrompts = [
    "Summarize in bullet points for executives",
    "Highlight only action items and deadlines", 
    "Create a detailed technical summary",
    "Focus on decisions made and next steps"
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Summarization Instructions
      </h2>
      
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Enter your custom instructions for how you'd like the meeting summarized..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</p>
        <div className="flex flex-wrap gap-2">
          {predefinedPrompts.map((template, index) => (
            <button
              key={index}
              onClick={() => onPromptChange(template)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Summary Generator Component
const SummaryGenerator = ({ file, prompt, onGenerateSummary, isGenerating }) => {
  const canGenerate = file && prompt.trim();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
      <button
        onClick={onGenerateSummary}
        disabled={!canGenerate || isGenerating}
        className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all transform ${
          canGenerate && !isGenerating
            ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        aria-label="Generate AI summary"
      >
        {isGenerating ? (
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
        ) : (
          <Zap className="mr-2 h-5 w-5" />
        )}
        {isGenerating ? 'Generating Summary...' : 'Generate AI Summary'}
      </button>
      
      {!canGenerate && !isGenerating && (
        <p className="text-sm text-gray-500 mt-2">
          Please upload a file and enter instructions to continue
        </p>
      )}
    </div>
  );
};

// Summary Editor Component
const SummaryEditor = ({ summary, onSummaryChange }) => {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Generated Summary (Editable)
      </h2>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex">
          <div className="w-1/2 border-r border-gray-300">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
              <span className="text-sm font-medium text-gray-700">Edit (Markdown)</span>
            </div>
            <textarea
              value={summary}
              onChange={(e) => onSummaryChange(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset resize-none"
              rows={12}
              placeholder="Your AI-generated summary will appear here..."
            />
          </div>
          <div className="w-1/2">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
              <span className="text-sm font-medium text-gray-700">Preview</span>
            </div>
            <div className="px-4 py-3 h-80 overflow-y-auto prose prose-sm max-w-none">
              <ReactMarkdown>{summary || 'Preview will appear here...'}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-2">
        You can edit the summary above before sharing
      </p>
    </div>
  );
};

// Email Share Component
const EmailShare = ({ summary, onShare, isSharing }) => {
  const [emails, setEmails] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmails = (emailString) => {
    if (!emailString.trim()) return false;
    
    const emailList = emailString.split(',').map(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    for (const email of emailList) {
      if (!emailRegex.test(email)) {
        setEmailError(`Invalid email format: ${email}`);
        return false;
      }
    }
    
    setEmailError('');
    return true;
  };

  const handleShare = () => {
    if (!summary.trim()) {
      toast.error('Please generate a summary before sharing');
      return;
    }
    
    if (!validateEmails(emails)) {
      return;
    }
    
    onShare(emails.split(',').map(email => email.trim()));
  };

  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Mail className="mr-2 h-5 w-5" />
        Share Summary via Email
      </h2>
      
      <div className="mb-4">
        <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Email Addresses
        </label>
        <input
          id="emails"
          type="text"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Enter email addresses separated by commas"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            emailError ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {emailError && (
          <p className="text-red-600 text-sm mt-1">{emailError}</p>
        )}
      </div>

      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
          isSharing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 shadow-lg'
        }`}
      >
        {isSharing ? (
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
        ) : (
          <Send className="mr-2 h-5 w-5" />
        )}
        {isSharing ? 'Sending...' : 'Share Summary'}
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  
  // State management
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // File handling
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSummary(''); // Clear existing summary when new file is uploaded
  };

  const handleFileRemove = () => {
    setFile(null);
    setSummary('');
  };

  // Summary generation (placeholder for AI integration)
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Placeholder summary - replace with actual AI integration
      const mockSummary = `# Meeting Summary

## Key Points:
• Discussed project timeline and milestones
• Reviewed budget allocation for Q4
• Identified potential risks and mitigation strategies
• Assigned action items to team members

## Action Items:
1. John to finalize technical specifications by Friday
2. Sarah to coordinate with design team for UI mockups
3. Mike to prepare budget report for next week's review
4. Schedule follow-up meeting for progress check

## Decisions Made:
- Approved moving forward with the new feature set
- Decided to extend deadline by one week for quality assurance
- Allocated additional resources for testing phase

## Next Steps:
- Weekly progress reviews every Tuesday
- Final presentation scheduled for month-end
- Stakeholder approval meeting set for next Friday

 *This summary was generated based on your instructions: "${prompt}"*`;

      setSummary(mockSummary);
      setIsGenerating(false);
    }, 2000);
  };

  // Email sharing (placeholder for backend integration)
  const handleShare = (emailList) => {
    setIsSharing(true);
    
    // Simulate email sending
    setTimeout(() => {
      toast.success(`Summary shared successfully with: ${emailList.join(', ')}`);
      setIsSharing(false);
    }, 1500);
  };

  
  return (
    
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Meeting Notes Summarizer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your meeting transcript, customize the summary style, and share insights with your team
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* File Upload Section */}
          <FileUpload 
            file={file}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
          />

          {/* Prompt Input Section */}
          <PromptInput 
            prompt={prompt}
            onPromptChange={setPrompt}
          />

          {/* Generate Summary Section */}
          <SummaryGenerator 
            file={file}
            prompt={prompt}
            onGenerateSummary={handleGenerateSummary}
            isGenerating={isGenerating}
          />

          {/* Summary Editor Section */}
          <SummaryEditor 
            summary={summary}
            onSummaryChange={setSummary}
          />

          {/* Email Share Section */}
          <EmailShare 
            summary={summary}
            onShare={handleShare}
            isSharing={isSharing}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Upload your meeting transcripts and get AI-powered summaries in seconds</p>
        </footer>
      </div>
    </div>
  );
};

export default App;