
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imageUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
  };
  
  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <div 
        onClick={handleAreaClick}
        className="relative border-2 border-dashed border-green-300 rounded-lg p-6 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors duration-300"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {imageUrl ? (
          <img src={imageUrl} alt="Soil Preview" className="w-full h-auto max-h-80 object-contain rounded-md" />
        ) : (
          <div className="flex flex-col items-center justify-center text-green-700">
            <UploadIcon className="h-12 w-12 mb-3 text-green-500" />
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
      {imageUrl && (
        <button
          onClick={handleAreaClick}
          className="mt-4 text-sm text-green-600 hover:text-green-800 font-semibold"
        >
          Change image
        </button>
      )}
    </div>
  );
};
