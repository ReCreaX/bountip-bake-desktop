import React, { useState, useRef } from "react";
import { CloudUpload} from "lucide-react";

const FileUploadComponent = ({ setImageUrl }: { setImageUrl: (url: string) => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: {
    preventDefault: () => void;
    dataTransfer: { files: Iterable<unknown> | ArrayLike<unknown> };
  }) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files) as File[];
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: Blob) => {
    setIsUploading(true);

    // Create a FileReader to convert file to base64 URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target) return;
      const imageUrl = e.target.result;
      setImageUrl(imageUrl as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full my-2.5">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border border-dashed border-[#D1D1D1] rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center space-y-2">
          <CloudUpload
            className={`w-8 h-8 text-[#15BA5C] ${
              isDragOver ? "text-blue-500" : "text-gray-400"
            }`}
          />

          {isUploading ? (
            <div className="text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Uploading...
            </div>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-700">
                Drag and drop or click here to upload
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent