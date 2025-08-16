import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Send, Mail, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';


const SummaryEditor = ({ summary, onSummaryChange }) => {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Generated Summary (Editable)
      </h2>

      <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Edit Section */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-300">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
            <span className="text-sm font-medium text-gray-700">Edit (Markdown)</span>
          </div>
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset resize-none font-mono text-sm leading-relaxed"
            rows={12}
            placeholder="Your AI-generated summary will appear here..."
          />
        </div>

        {/* Preview Section */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
            <span className="text-sm font-medium text-gray-700">Preview</span>
          </div>
          <div className="px-4 py-3 h-80 overflow-y-auto prose prose-sm max-w-none">
            <ReactMarkdown
              children={summary}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold my-1" {...props} />,
                li: ({ node, ...props }) => <li className="ml-4 my-1 list-disc" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
              }}
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        You can edit the summary above before sharing
      </p>
    </div>
  );
};



export default SummaryEditor;