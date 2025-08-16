import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Send, Mail, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';


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
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'Please generate a summary before sharing';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
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
        className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all hover:cursor-pointer ${
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

export default EmailShare;