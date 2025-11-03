
import React from 'react';

interface SoilQualityGaugeProps {
  quality: number;
}

export const SoilQualityGauge: React.FC<SoilQualityGaugeProps> = ({ quality }) => {
  const percentage = Math.max(0, Math.min(100, quality));
  const rotation = (percentage / 100) * 180 - 90;

  const getQualityInfo = () => {
    if (percentage < 40) {
      return { label: 'Poor', color: 'text-red-500', bg: 'bg-red-500', gradientFrom: 'from-red-400', gradientTo: 'to-red-600' };
    }
    if (percentage < 70) {
      return { label: 'Average', color: 'text-yellow-500', bg: 'bg-yellow-500', gradientFrom: 'from-yellow-400', gradientTo: 'to-yellow-600' };
    }
    return { label: 'Good', color: 'text-green-500', bg: 'bg-green-500', gradientFrom: 'from-green-400', gradientTo: 'to-green-600' };
  };

  const { label, color, bg, gradientFrom, gradientTo } = getQualityInfo();
  
  const circumference = Math.PI * 100;
  const strokeDashoffset = circumference - (percentage / 100) * (circumference / 2);

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-32 scale-125 my-8">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 200 100"
      >
        <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#ef4444'}} />
                <stop offset="50%" style={{stopColor: '#f59e0b'}} />
                <stop offset="100%" style={{stopColor: '#22c55e'}} />
            </linearGradient>
        </defs>
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          className="opacity-20"
        />
        {/* Foreground Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${circumference/2} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {/* Needle */}
      <div 
        className="absolute bottom-0 w-1 h-16 origin-bottom transition-transform duration-1000 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className={`w-full h-full rounded-full ${bg} shadow-lg`}></div>
         <div className={`absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full border-4 border-white ${bg} shadow-md`}></div>
      </div>
       <div className="absolute -bottom-2 w-12 h-12 bg-white rounded-full shadow-inner"></div>

      <div className="z-10 absolute bottom-4 text-center">
        <span className={`text-4xl font-bold ${color}`}>{quality}</span>
        <span className="text-sm font-medium text-gray-600 block -mt-1">{label}</span>
      </div>
    </div>
  );
};
