import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Send, Mail, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Toaster, toast } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import PromptInput from './components/PromptInput';
import SummaryGenerator from './components/SummaryGenerator';
import SummaryEditor from './components/SummaryEditor';
import EmailShare from './components/EmailShare';

// Base URL for axios requests
axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}`;


const App = () => {
  
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

  // Summary generation
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    
    try {

      // Create FormData to send both file and prompt
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', prompt);


      const response = await axios.post('/api/generate-summary', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the AI-generated summary from backend response
      setSummary(response.data.summary);
      

     toast.success('Summary generated successfully!');
      
    } catch (error) {
      console.error('Error generating summary:', error);
      
      toast.error('Failed to generate summary. Please try again.');


      const mockSummary = setSummary(mockSummary);
    } finally {
      setIsGenerating(false);
    }
  };

  // Email sharing
  const handleShare = async (emailList) => {
    setIsSharing(true);
    
    try {
      const response = await axios.post('/api/send-email', {
        emails: emailList,
        summary: summary
      });


    toast.success('Email sent Successfully! Please check your Spam Folder');

    } catch (error) {
      console.error('Error sending email:', error);
      
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  
  return (
    
    <div className="min-h-screen bg-gray-50 py-8">
       {/* <Toaster 
        position="top-center"
        toastOptions={{
        style: {
            background: '#1c8217',  
            color: '#fff'        
          }
        }}
       /> */}

      <Toaster position="top-center"/>

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

          <FileUpload 
            file={file}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
          />


          <PromptInput 
            prompt={prompt}
            onPromptChange={setPrompt}
          />


          <SummaryGenerator 
            file={file}
            prompt={prompt}
            onGenerateSummary={handleGenerateSummary}
            isGenerating={isGenerating}
          />

  
          <SummaryEditor 
            summary={summary}
            onSummaryChange={setSummary}
          />


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