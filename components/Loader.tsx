
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-8 animate-fade-in">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      <p className="text-green-700 font-semibold">Analyzing your soil...</p>
      <p className="text-sm text-gray-500 text-center max-w-xs">Our AI is cultivating insights from your image. This might take a moment.</p>
    </div>
  );
};
