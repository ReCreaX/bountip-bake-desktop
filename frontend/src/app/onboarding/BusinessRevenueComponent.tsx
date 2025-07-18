import { Upload, CheckCircle, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import uploadService from "@/services/uploadService"; // Adjust path as needed
import { COOKIE_NAMES } from "@/utils/cookiesUtils";

interface BusinessRevenueComponentProps {
  onRevenueChange?: (value: number) => void;
  onFileUpload?: (file: File) => void;
  onImageUpload?: (url: string) => void; // New prop for image URL
}

const BusinessRevenueComponent: React.FC<BusinessRevenueComponentProps> = ({
  onRevenueChange,
  onFileUpload,
  onImageUpload,
}) => {
  const [revenueValue, setRevenueValue] = useState<number>(50000);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setRevenueValue(value);
    onRevenueChange?.(value);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(""); // Clear any previous errors

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await uploadService.uploadImage(
        file,
        COOKIE_NAMES.BOUNTIP_REGISTERED_USERS,
        // "bountipRegisteredUsers"
      );
      console.log(response)

      if (response.status) {
        setUploadedImageUrl(response.data.url);
        onImageUpload?.(response.data.url); // Pass URL to parent
        console.log("Image uploaded successfully:", response.url);
      } else {
        throw new Error("No URL returned from upload service");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Failed to upload image. Please try again.");
      // Reset upload states on error
      setUploadedImageUrl("");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    // Clear previous error and upload states when attempting new upload
    setUploadError("");
    setUploadedImageUrl("");
    setUploadedFile(null);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please select a valid file type (JPG, PNG, SVG, PDF)");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploadedFile(file);
    onFileUpload?.(file);

    // Automatically upload the image
    await uploadImage(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
    // Reset the file input value to allow selecting the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    if (!isUploading) {
      // Clear error when user clicks to upload
      setUploadError("");
      fileInputRef.current?.click();
    }
  };

  const dismissError = () => {
    setUploadError("");
  };

  // Reset upload state when starting a new upload attempt

  return (
    <div className="w-full bg-white">
      {/* Revenue Range Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Business Revenue Range
        </h3>

        <div className="relative h-10">
          <h3
            className="absolute bottom-3 transform -translate-x-1/2 text-sm font-semibold text-emerald-600"
            style={{
              left: `calc(${(revenueValue / 1000000) * 100}% )`,
            }}
          >
            {formatCurrency(revenueValue)}
          </h3>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={revenueValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                (revenueValue / 1000000) * 100
              }%, #e5e7eb ${(revenueValue / 1000000) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>$0</span>
            <span>$1M+</span>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Upload your Business Logo
        </h3>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragOver
              ? "border-emerald-400 bg-emerald-50"
              : uploadError
              ? "border-red-300 hover:border-red-400 hover:bg-red-50"
              : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
          } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.svg,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-emerald-600 mb-4 animate-spin" />
                <p className="text-emerald-600 font-medium mb-1">
                  Uploading...
                </p>
                <p className="text-sm text-gray-600">
                  Please wait while we upload your file
                </p>
              </>
            ) : uploadedImageUrl ? (
              <>
                <CheckCircle className="w-12 h-12 text-emerald-600 mb-4" />
                <div className="text-center">
                  <p className="text-emerald-600 font-medium mb-1">
                    Image uploaded successfully!
                  </p>
                  <p className="text-sm text-gray-600">{uploadedFile?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to upload a different image
                  </p>
                </div>
              </>
            ) : uploadError ? (
              <>
                <Upload className="w-12 h-12 text-red-400 mb-4" />
                <div className="text-center">
                  <p className="text-red-600 font-medium mb-1">Upload failed</p>
                  <p className="text-sm text-gray-600">Click to try again</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <div className="text-center">
                  <p className="text-emerald-600 font-medium mb-1">
                    Click to upload or Drag your file here
                  </p>
                  <p className="text-sm text-gray-500">
                    Max file: 5mb, Png, jpg, svg, pdf
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md relative">
            <div className="flex items-start justify-between">
              <p className="text-sm text-red-600 flex-1">{uploadError}</p>
              <button
                onClick={dismissError}
                className="ml-2 text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default BusinessRevenueComponent;
