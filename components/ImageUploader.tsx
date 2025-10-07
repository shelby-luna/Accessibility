
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imageUrl: string | null;
  onReset: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imageUrl, onReset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const uploaderContent = (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors duration-300
        ${isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-cyan-500'}`}
      onDragEnter={(e) => handleDragEvent(e, true)}
      onDragLeave={(e) => handleDragEvent(e, false)}
      onDragOver={(e) => handleDragEvent(e, true)}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <UploadIcon className="w-12 h-12 mx-auto text-slate-500 mb-4" />
        <p className="text-slate-300">
          <span className="font-semibold text-cyan-400 cursor-pointer" onClick={handleBrowseClick}>Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF, WEBP</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );

  const previewContent = (
    <div className="relative w-full h-full group">
      <img
        src={imageUrl || ''}
        alt="Uploaded preview"
        className="w-full h-full object-contain rounded-lg"
      />
      <button
        onClick={onReset}
        className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-full text-slate-200 hover:bg-black/80 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Remove image"
      >
        <XCircleIcon className="w-6 h-6" />
      </button>
    </div>
  );

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 h-96 flex items-center justify-center">
      {imageUrl ? previewContent : uploaderContent}
    </div>
  );
};
