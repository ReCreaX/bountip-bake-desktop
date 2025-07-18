"use client";
import React, { useEffect, useState, useRef } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import SettingFiles from "@/assets/icons/settings";
import { BusinessDetailsType } from "@/types/businessTypes";
import { COOKIE_NAMES } from "@/utils/cookiesUtils";
import { Check, ChevronDown, Plus, X, Upload, Loader2 } from "lucide-react";
import uploadService from "@/services/uploadService";
import Image from "next/image";
import { CiEdit } from "react-icons/ci";
import settingsService from "@/services/settingsService";
import { toast } from "sonner";

interface BusinessDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  outletId: string | number | null;
}
const defaultBusinessTypes = ["Bakery", "Restaurant", "Bar"];

export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  isOpen,
  onClose,
  outletId,
}) => {
  
  const [details, setDetails] = useState<BusinessDetailsType>({
    name: "Jacob Jones",
    email: "business@example.com",
    phone: "+2348062236427",
    country: "Nigeria",
    state: "Enugu",
    city: "Owerri",
    address: "Enugu",
    businessType: "Bakery",
    postalCode: "734007",
  });
  

  const [newBusinessType, setNewBusinessType] = useState("");
  const [businessTypes, setBusinessTypes] = useState(defaultBusinessTypes);
  const [businessType, setBusinessType] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isBusinessTypeOpen, setIsBusinessTypeOpen] = useState(false);

  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (details?.logoUrl) {
      setUploadedImageUrl(details.logoUrl);
    }
  }, [details]);

  const handleBusinessTypeSelect = (type: string) => {
    setBusinessType(type);
    setIsBusinessTypeOpen(false);
  };

  // Dummy form submission function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, country, state, city, address, postalCode } =
      details;
    if (
      !name ||
      !email ||
      !phone ||
      !country ||
      !state ||
      !city ||
      !address ||
      !postalCode ||
      !businessType ||
      !uploadedImageUrl
    ) {
      toast.error("Please fill out all required fields and upload a logo.");
      return;
    }
    const finalDetails = {
      ...details,
      businessType,
      logoUrl: uploadedImageUrl,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await settingsService.updateBusinessDetails(
      finalDetails,
      outletId as number
    );
    if (response.status) {
      toast.success("Business details updated successfully!");
      setDetails({
        name: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        address: "",
        postalCode: "",
        businessType: "",
      });
      setBusinessType("");
      setUploadedImageUrl("");
      onClose();
    }
  };

  const handleChange = (field: keyof BusinessDetailsType, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddBusinessType = () => {
    if (
      newBusinessType.trim() &&
      !businessTypes.includes(newBusinessType.trim())
    ) {
      const updatedTypes = [...businessTypes, newBusinessType.trim()];
      setBusinessTypes(updatedTypes);
      setBusinessType(newBusinessType.trim());
      setNewBusinessType("");
      setIsAddingNew(false);
      setIsBusinessTypeOpen(false);
    }
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await uploadService.uploadImage(
        file,
        COOKIE_NAMES.BOUNTIP_LOGIN_USER_TOKENS
      );
      console.log(response);

      if (response.status) {
        setUploadedImageUrl(response.data.url);
        console.log("Image uploaded successfully:", response.data.url);
      } else {
        throw new Error("No URL returned from upload service");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Failed to upload image. Please try again.");
      setUploadedImageUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setUploadError("");
    setUploadedImageUrl("");

    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPG, PNG, SVG)");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    if (!isUploading) {
      setUploadError("");
      fileInputRef.current?.click();
    }
  };

  const dismissError = () => {
    setUploadError("");
  };

  // Function to handle image deletion - to be implemented later
  const handleDeleteImage = () => {
    // TODO: Implement actual image deletion logic here
    console.log("Deleting image:", uploadedImageUrl);

    setUploadedImageUrl("");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal
      size={"md"}
      subtitle="Update and Manage Business Information"
      image={SettingFiles.BusinessIcon}
      isOpen={isOpen}
      onClose={onClose}
      title="Business Details"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Name"
              value={details.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter business name"
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={details.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="business@example.com"
            className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
          />

          <Input
            label="Phone Number"
            value={details.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              value={details.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
            >
              <option value="Nigeria">🇳🇬 Nigeria</option>
              <option value="Ghana">🇬🇭 Ghana</option>
              <option value="Kenya">🇰🇪 Kenya</option>
            </select>
          </div>

          <Input
            label="State"
            value={details.state}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="Enter state"
            className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
          />

          <Input
            label="City"
            value={details.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Enter city"
            className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
          />

          <Input
            label="Street Address"
            value={details.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter street address"
            className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsBusinessTypeOpen(!isBusinessTypeOpen);
                }}
                className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
              >
                <span
                  className={businessType ? "text-gray-900" : "text-gray-500"}
                >
                  {businessType || "Select your Business type"}
                </span>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </button>

              {isBusinessTypeOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="py-1">
                    {businessTypes.map((type, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleBusinessTypeSelect(type);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group"
                      >
                        <span className="text-gray-900">{type}</span>
                        {businessType === type && (
                          <Check className="h-4 w-4 text-[#15BA5C]" />
                        )}
                      </button>
                    ))}

                    {!isAddingNew ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsAddingNew(true);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-[#15BA5C] font-medium"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Business
                      </button>
                    ) : (
                      <div className="px-4 py-2 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newBusinessType}
                            onChange={(e) => setNewBusinessType(e.target.value)}
                            placeholder="Enter business type"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15BA5C]"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddBusinessType();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddBusinessType();
                            }}
                            className="p-2 bg-[#15BA5C] text-white rounded-md hover:bg-[#13A652] transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsAddingNew(false);
                              setNewBusinessType("");
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Input
            label="Postal Code"
            value={details.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            placeholder="Enter postal code"
            className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15BA5C] transition-colors"
          />
        </div>

        {/* Logo Upload Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>

          {uploadedImageUrl && (
            <div className="w-full">
              <section className="relative h-[250px] w-full ">
                <Image
                  src={uploadedImageUrl}
                  alt="Business logo"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />

                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute px-2.5 py-2.5 flex items-center justify-center rounded-full top-2.5 right-0 z-50 bg-[#15BA5C] text-white font-bold transition-colors"
                  title="Delete logo"
                >
                  <CiEdit className="h-5 w-5" />
                </button>
              </section>
            </div>
          )}

          {/* Only show upload area if no image is uploaded */}
          {!uploadedImageUrl && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragOver
                  ? "border-[#15BA5C] bg-green-50"
                  : uploadError
                  ? "border-red-300 hover:border-red-400 hover:bg-red-50"
                  : "border-gray-300 hover:border-[#15BA5C] hover:bg-gray-50"
              } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.svg"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading}
              />

              <div className="flex flex-col items-center">
                {isUploading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-[#15BA5C] mb-4 animate-spin" />
                    <p className="text-[#15BA5C] font-medium mb-1">
                      Uploading...
                    </p>
                    <p className="text-sm text-gray-600">
                      Please wait while we upload your logo
                    </p>
                  </>
                ) : uploadError ? (
                  <>
                    <Upload className="w-12 h-12 text-red-400 mb-4" />
                    <div className="text-center">
                      <p className="text-red-600 font-medium mb-1">
                        Upload failed
                      </p>
                      <p className="text-sm text-gray-600">
                        Click to try again
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      🏪
                    </div>
                    <div className="text-center">
                      <p className="text-[#15BA5C] font-medium mb-1">
                        Click to upload or Drag your logo here
                      </p>
                      <p className="text-sm text-gray-500">
                        Max file: 5mb, PNG, JPG, SVG
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

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

        <div className="flex flex-col mt-6">
          <button
            className="w-full bg-[#15BA5C] py-2.5 text-[#FFFFFF] font-medium rounded-[10px] hover:bg-[#13A652] transition-colors"
            type="submit"
          >
            Save Details
          </button>
        </div>
      </form>
    </Modal>
  );
};
