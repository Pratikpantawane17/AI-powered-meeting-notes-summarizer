import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Send, Mail, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';



const SummaryGenerator = ({ file, prompt, onGenerateSummary, isGenerating }) => {
  const canGenerate = file && prompt.trim();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
      <button
        onClick={onGenerateSummary}
        disabled={!canGenerate || isGenerating}
        className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all transform hover:cursor-pointer ${
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




export default SummaryGenerator;