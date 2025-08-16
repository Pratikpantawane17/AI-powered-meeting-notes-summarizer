import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Send, Mail, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Toaster, toast } from 'react-hot-toast';

const FileUpload = ({ file,   onFileSelect, onFileRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/plain') {
      onFileSelect(selectedFile);

     
      toast.success('File uploaded successfully!');
    } 
    else {
      toast.error('Please upload a valid text file (.txt)');
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

    } 
    else {
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

export default FileUpload
