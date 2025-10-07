
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AltTextViewer } from './components/AltTextViewer';
import { generateAltText } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    // Reset state
    setImageUrl(URL.createObjectURL(file));
    setAltText('');
    setError(null);
    setIsLoading(true);

    try {
      const { base64, mimeType } = await fileToBase64(file);
      const generatedText = await generateAltText(base64, mimeType);
      setAltText(generatedText);
    } catch (err) {
      console.error(err);
      setError('Failed to generate alt text. Please try another image.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setImageUrl(null);
    setAltText('');
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            AI Alt Text Generator
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Improve web accessibility effortlessly. Upload an image to generate descriptive alt text using Gemini.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader 
            onImageSelect={handleImageSelect} 
            imageUrl={imageUrl}
            onReset={handleReset}
          />
          <AltTextViewer 
            altText={altText} 
            isLoading={isLoading} 
            error={error} 
            hasImage={!!imageUrl} 
          />
        </main>

        <footer className="text-center mt-12 text-slate-500">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
