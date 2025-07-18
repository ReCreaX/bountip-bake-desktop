import React, { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { BusinessLocation } from "@/types/settingTypes";
import SettingFiles from "@/assets/icons/settings";
import Image from "next/image";
import { Check, Trash2 } from "lucide-react";
import settingsService from "@/services/settingsService";
import { toast } from "sonner";

interface LocationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  locationData: any[] | null;
  businessId: string | null;
  
}

export const LocationSettingsModal: React.FC<LocationSettingsModalProps> = ({
  isOpen,
  onClose,
  businessId,
  locationData,
}) => {
  const [locations, setLocations] = useState<BusinessLocation[] | []>([]);
  const [newLocations, setNewLocations] = useState<Partial<BusinessLocation>[]>(
    [{ name: "", address: "", phoneNumber: "" }]
  );
  useEffect(() => {
    if (isOpen && Array.isArray(locationData)) {
      const parsedLocations: BusinessLocation[] = locationData.map((item) => ({
        id: String(item.outlet.id),
        name: item.outlet.name,
        address: item.outlet.address,
        phoneNumber: item.outlet.phoneNumber || "",
        isDefault: item.outlet.isMainLocation, // Map isMainLocation -> isDefault
      }));
      setLocations(parsedLocations);
    }
  }, [isOpen, locationData]);

  const defaultLocation = locations.find((loc) => loc.isDefault);
  const otherLocations = locations.filter((loc) => !loc.isDefault);

  const addNewLocationField = () => {
    setNewLocations((prev) => [
      ...prev,
      { name: "", address: "", phoneNumber: "" },
    ]);
  };

  const updateNewLocation = (
    index: number,
    field: keyof BusinessLocation,
    value: string
  ) => {
    setNewLocations((prev) =>
      prev.map((loc, i) => (i === index ? { ...loc, [field]: value } : loc))
    );
  };

  const removeNewLocation = (index: number) => {
    setNewLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const updateExistingLocation = (
    id: string,
    field: keyof BusinessLocation,
    value: string
  ) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, [field]: value } : loc))
    );
  };

  const editDefaultLocation = () => {
    if (!defaultLocation) return;

    setNewLocations((prev) => [
      ...prev,
      {
        name: defaultLocation.name,
        address: defaultLocation.address,
        phoneNumber: defaultLocation.phoneNumber,
      },
    ]);

    setLocations((prev) => prev.filter((loc) => loc.id !== defaultLocation.id));
  };

  const handleSave = async () => {
    if (!businessId) return;

    // Only include locations that have a name and address filled in
    const validNewLocations = newLocations
      .filter((loc) => loc.name && loc.address && loc.phoneNumber)
      .map((loc) => ({
        name: loc.name!,
        address: loc.address!,
        phoneNumber: loc.phoneNumber!,
      }));

    try {
      // Submit each location to the backend
      await Promise.all(
        validNewLocations.map((loc) =>
          settingsService.addNewBusinessLocation({
            businessId,
            name: loc.name,
            address: loc.address,
            phoneNumber: loc.phoneNumber,
          })
        )
      );
      setNewLocations([{ name: "", address: "", phoneNumber: "" }]);
      toast.success("Locations added succesfully")
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving locations", error);
    }
  };

  return (
    <Modal
      size="md"
      subtitle="Add and edit multiple Business location"
      image={SettingFiles.LocationIcon}
      isOpen={isOpen}
      onClose={onClose}
      title="Location"
    >
      <div className="space-y-6">
        {/* Default Business Location */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">
            Default Business Location
          </h3>
          {defaultLocation && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{defaultLocation.name}</span>
                <button
                  type="button"
                  onClick={editDefaultLocation}
                  className="bg-[#15BA5C] flex items-center rounded-[20px] px-2.5 py-1.5"
                >
                  <Image
                    src={SettingFiles.EditIcon}
                    alt="Edit"
                    className="h-[14px] w-[14px] mr-1"
                  />
                  <span className="text-white text-sm">Edit</span>
                </button>
              </div>
              <p className="text-sm text-gray-600">{defaultLocation.address}</p>
            </div>
          )}
        </div>

        {/* Other Business Locations */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">
            Other Business Location
          </h3>
          <div className="space-y-4">
            {/* Existing other locations */}
            {otherLocations.map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between"
              >
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    value={location.name}
                    onChange={(e) =>
                      updateExistingLocation(
                        location.id,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Enter Name e.g Abuja Branch"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    value={location.address}
                    onChange={(e) =>
                      updateExistingLocation(
                        location.id,
                        "address",
                        e.target.value
                      )
                    }
                    placeholder="Enter Address"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    value={location.phoneNumber}
                    onChange={(e) =>
                      updateExistingLocation(
                        location.id,
                        "phoneNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeExistingLocation(location.id)}
                    className="p-2 text-red-500 hover:text-red-700 border border-red-200 rounded-lg hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* New location fields */}
            {newLocations.map((location, index) => (
              <div
                key={`new-${index}`}
                className="flex items-center justify-between"
              >
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    value={location.name || ""}
                    onChange={(e) =>
                      updateNewLocation(index, "name", e.target.value)
                    }
                    placeholder="Enter Name e.g Abuja Branch"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    value={location.address || ""}
                    onChange={(e) =>
                      updateNewLocation(index, "address", e.target.value)
                    }
                    placeholder="Enter Address"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    value={location.phoneNumber || ""}
                    onChange={(e) =>
                      updateNewLocation(index, "phoneNumber", e.target.value)
                    }
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeNewLocation(index)}
                    className="p-2 text-red-500 hover:text-red-700 border border-red-200 rounded-lg hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Location Button */}
        <button
          onClick={addNewLocationField}
          className=" border border-[#15BA5C] w-full text-[#15BA5C] py-3 rounded-[10px] font-medium text-base mt-5"
          type="button"
        >
          + Add a new Location
        </button>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-[#15BA5C] w-full text-[#ffffff] py-3 rounded-[10px] font-medium text-base mt-5"
            type="button"
          >
            <Check className="text-[14px]" />
            <span className="">Save Locationn</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
