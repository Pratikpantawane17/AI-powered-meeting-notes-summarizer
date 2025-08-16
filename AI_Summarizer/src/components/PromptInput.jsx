import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Send, Mail, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Toaster, toast } from 'react-hot-toast';

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


export default PromptInput;