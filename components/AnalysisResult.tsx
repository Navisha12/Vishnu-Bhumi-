
import React, { useState } from 'react';
import type { SoilAnalysis } from '../types';
import { SoilQualityGauge } from './SoilQualityGauge';
import { LeafIcon, RefreshIcon, SeedlingIcon, SparklesIcon, SunIcon, QuestionMarkCircleIcon } from './icons';
import { askFollowUpQuestion } from '../services/geminiService';

interface AnalysisResultProps {
  analysis: SoilAnalysis;
  imageUrl: string | null;
  imageFile: File | null;
  onReset: () => void;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white/60 rounded-xl p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h3 className="text-xl font-bold text-green-800">{title}</h3>
        </div>
        {children}
    </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, imageUrl, imageFile, onReset }) => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [askError, setAskError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !imageFile) return;

    setIsAsking(true);
    setAskError(null);
    setAnswer(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await askFollowUpQuestion(base64Image, imageFile.type, analysis, question);
      setAnswer(result);
    } catch (e) {
      console.error(e);
      setAskError("Sorry, I couldn't get an answer. Please try asking in a different way.");
    } finally {
      setIsAsking(false);
    }
  };


  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Image and Gauge */}
            <div className="lg:col-span-1 flex flex-col items-center gap-6">
                 {imageUrl && <img src={imageUrl} alt="Analyzed soil" className="w-full rounded-lg shadow-lg object-cover" />}
                 <div className="w-full flex justify-center">
                    <SoilQualityGauge quality={analysis.soilQuality} />
                 </div>
            </div>
            
            {/* Right Column: Details */}
            <div className="lg:col-span-2 space-y-6">
                <InfoCard title="Soil Summary" icon={<SparklesIcon className="w-6 h-6 text-yellow-500" />}>
                     <p className="text-gray-700 leading-relaxed"><strong className="font-semibold text-gray-800">Soil Type:</strong> {analysis.soilType}</p>
                     <p className="mt-2 text-gray-600">{analysis.summary}</p>
                </InfoCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard title="Crop Recommendations" icon={<SeedlingIcon className="w-6 h-6 text-green-600" />}>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {analysis.cropRecommendations.map((crop, i) => <li key={i}>{crop}</li>)}
                        </ul>
                    </InfoCard>

                    <InfoCard title="Rest & Recovery" icon={<SunIcon className="w-6 h-6 text-orange-500" />}>
                        <p className="text-gray-600">A rest period of <strong className="font-semibold text-gray-800">{analysis.restPeriod}</strong> is recommended to maintain or improve fertility.</p>
                    </InfoCard>
                </div>

                <InfoCard title="Improvement Plan" icon={<LeafIcon className="w-6 h-6 text-lime-600" />}>
                     <ul className="list-decimal list-inside space-y-2 text-gray-600">
                        {analysis.improvementSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </InfoCard>
            </div>
        </div>

        <div className="mt-8">
            <InfoCard title="Ask a Follow-up Question" icon={<QuestionMarkCircleIcon className="w-6 h-6 text-blue-500" />}>
                <div className="space-y-4">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., How does composting specifically help this soil type?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow duration-200"
                    rows={3}
                    disabled={isAsking}
                />
                <button
                    onClick={handleAskQuestion}
                    disabled={!question.trim() || isAsking}
                    className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {isAsking ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Getting Answer...</span>
                    </>
                    ) : (
                    'Ask Question'
                    )}
                </button>

                {askError && <p className="text-red-600 text-sm text-center">{askError}</p>}
                
                {answer && (
                    <div className="mt-4 p-4 bg-green-50/70 border-l-4 border-green-500 rounded-r-lg animate-fade-in">
                    <p className="text-gray-800 font-semibold mb-1">Answer:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
                    </div>
                )}
                </div>
            </InfoCard>
        </div>
      
        <div className="mt-8 text-center">
            <button
            onClick={onReset}
            className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
            <RefreshIcon className="w-5 h-5" />
            Analyze Another Image
            </button>
      </div>
    </div>
  );
};
