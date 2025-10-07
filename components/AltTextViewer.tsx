
import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface AltTextViewerProps {
  altText: string;
  isLoading: boolean;
  error: string | null;
  hasImage: boolean;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center text-slate-400">
    <svg className="animate-spin h-8 w-8 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="font-semibold">Generating Alt Text...</p>
    <p className="text-sm">The AI is analyzing your image.</p>
  </div>
);

const Placeholder: React.FC<{ hasImage: boolean }> = ({ hasImage }) => (
  <div className="text-center text-slate-400">
    {hasImage ? (
       <p>Waiting for analysis to complete...</p>
    ) : (
      <>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Your alt text will appear here</h3>
        <p>Upload an image to get started.</p>
      </>
    )}
  </div>
);

export const AltTextViewer: React.FC<AltTextViewerProps> = ({ altText, isLoading, error, hasImage }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
        setCopyStatus('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    if (altText) {
      navigator.clipboard.writeText(altText);
      setIsCopied(true);
      setCopyStatus('Alt text copied to clipboard.');
    }
  };

  let content;
  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = <div className="text-center text-red-300 bg-red-900/50 p-4 rounded-lg">{error}</div>;
  } else if (altText) {
    content = (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-300">Generated Alt Text:</h3>
        <div className="relative bg-slate-900/70 p-4 rounded-lg">
          <p className="text-slate-200 pr-12">{altText}</p>
          <button 
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
            aria-label="Copy alt text"
          >
            {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    );
  } else {
    content = <Placeholder hasImage={hasImage} />;
  }

  return (
    <section aria-labelledby="alt-text-viewer-heading" className="bg-slate-800/50 rounded-lg p-6 h-96 flex flex-col justify-center">
      <h2 id="alt-text-viewer-heading" className="sr-only">Alt Text Viewer</h2>
      <div role="status" className="flex flex-col justify-center h-full">
        {content}
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {copyStatus}
      </div>
    </section>
  );
};
