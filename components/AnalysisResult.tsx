
import React from 'react';
import type { SoilAnalysis } from '../types';
import { SoilQualityGauge } from './SoilQualityGauge';
import { LeafIcon, RefreshIcon, SeedlingIcon, SparklesIcon, SunIcon } from './icons';

interface AnalysisResultProps {
  analysis: SoilAnalysis;
  imageUrl: string | null;
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

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, imageUrl, onReset }) => {
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
