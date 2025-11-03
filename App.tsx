
import React, { useState, useCallback } from 'react';
import { analyzeSoilImage } from './services/geminiService';
import type { SoilAnalysis } from './types';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Loader } from './components/Loader';
import { LeafIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SoilAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove "data:image/jpeg;base64,"
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeSoilImage(base64Image, imageFile.type);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError("Failed to analyze the soil. The model may be unable to process this image. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <LeafIcon className="h-10 w-10 text-green-700"/>
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800 tracking-tight">Vishnu Bhoomi</h1>
        </div>
        <p className="text-lg text-green-700">Your AI Assistant for Regenerative Farming</p>
      </header>

      <main className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500">
        {!analysis && (
          <div className="flex flex-col items-center">
             <ImageUploader onImageChange={handleImageChange} imageUrl={imageUrl} />
             {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
             {isLoading ? (
                <Loader />
             ) : (
                <button
                onClick={handleAnalyzeClick}
                disabled={!imageFile || isLoading}
                className="mt-6 w-full max-w-xs bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Analyze Soil
              </button>
             )}
          </div>
        )}

        {analysis && !isLoading && (
            <AnalysisResult analysis={analysis} imageUrl={imageUrl} onReset={handleReset} />
        )}
      </main>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Vishnu Bhoomi. Empowering farmers with technology.</p>
      </footer>
    </div>
  );
};

export default App;
