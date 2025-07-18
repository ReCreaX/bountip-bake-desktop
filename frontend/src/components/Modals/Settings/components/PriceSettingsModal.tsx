// import React, { useState } from "react";
// import { Modal } from "../ui/Modal";
// import SettingFiles from "@/assets/icons/settings";
// import Image from "next/image";
// import { Input } from "../ui/Input";
// import { Switch } from "../ui/Switch";

// interface PriceTier {
//   id: string;
//   name: string;
//   description?: string;
//   markupPercent: number;
//   discountPercent: number;
// }

// interface PriceSettingsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   priceTiers: PriceTier[];
//   outletsData:any[];
//   onSave: (tiers: PriceTier[]) => void;
// }

// export const PriceSettingsModal: React.FC<PriceSettingsModalProps> = ({
//   isOpen,
//   onClose,
//   priceTiers,
//   onSave,
//   outletsData
// }) => {
//   const [tiers, setTiers] = useState<PriceTier[]>(priceTiers);

//   const addTier = (tier: PriceTier) => {
//     setTiers((prev) => [...prev, tier]);
//   };

//   const deleteTier = (id: string) => {
//     setTiers((prev) => prev.filter((t) => t.id !== id));
//   };

//   const handleSave = () => {
//     onSave(tiers);
//     onClose();
//   };

//   return (
//     <Modal
//       size="md"
//       subtitle="Update and Manage Price Tiers"
//       image={SettingFiles.PriceTier}
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Price Settings"
//     >
//       <div className="space-y-6">
//         {console.log(outletsData, "THis is stuff")}
//         {tiers.map((tier) => (
//           <div key={tier.id} className="rounded-lg p-4 border border-gray-200">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-medium">{tier.name}</span>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   className="bg-[#15BA5C] flex items-center rounded-[20px] px-2.5 py-1.5"
//                 >
//                   <Image
//                     src={SettingFiles.EditIcon}
//                     alt="Edit"
//                     className="h-[14px] w-[14px] mr-1"
//                   />
//                   <span className="text-white">Edit</span>
//                 </button>

//                 <button
//                   onClick={() => deleteTier(tier.id)}
//                   type="button"
//                   className="border border-[#E33629] flex items-center rounded-[20px] px-2.5 py-1.5"
//                 >
//                   <Image
//                     src={SettingFiles.TrashIcon}
//                     alt="Delete"
//                     className="h-[14px] w-[14px] mr-1"
//                   />
//                   <span className="text-[#E33629]">Delete</span>
//                 </button>
//               </div>
//             </div>
//             <div className="text-sm text-gray-600 space-y-2">
//               <div className="border border-[#E6E6E6] px-3.5 py-2.5 rounded-[12px]">
//                 Markup: {tier.markupPercent}%
//               </div>
//               <div className="border border-[#E6E6E6] px-3.5 py-2.5 rounded-[12px]">
//                 Discount: {tier.discountPercent}%
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="">
//           <h4 className="font-medium mb-4">Add New Price Tier</h4>
//           <PriceTierForm onAdd={addTier} />
//         </div>

//         <div className="flex justify-end">
//         <button onClick={handleSave} className="bg-[#15BA5C] w-full text-white py-3 rounded-[10px] font-medium text-base " type="button">
//         Save all Price Tiers
// </button>

//         </div>
//       </div>
//     </Modal>
//   );
// };

// interface PriceTierFormProps {
//   onAdd: (tier: PriceTier) => void;
// }

// export const PriceTierForm: React.FC<PriceTierFormProps> = ({ onAdd }) => {
//   const [tier, setTier] = useState<Partial<PriceTier>>({
//     name: "",
//     description: "",
//     markupPercent: 0,
//     discountPercent: 0,
//   });

//   const [markupEnabled, setMarkupEnabled] = useState(false);
//   const [discountEnabled, setDiscountEnabled] = useState(false);

//   const handleMarkupToggle = (enabled: boolean) => {
//     setMarkupEnabled(enabled);
//     if (enabled) {
//       setDiscountEnabled(false);
//       setTier((prev) => ({ ...prev, discountPercent: 0 }));
//     }
//   };

//   const handleDiscountToggle = (enabled: boolean) => {
//     setDiscountEnabled(enabled);
//     if (enabled) {
//       setMarkupEnabled(false);
//       setTier((prev) => ({ ...prev, markupPercent: 0 }));
//     }
//   };

//   const handleAdd = () => {
//     if (!tier.name || tier.name.trim() === "") {
//       alert("Please enter a price tier name.");
//       return;
//     }

//     const newTier: PriceTier = {
//       id: Date.now().toString(),
//       name: tier.name,
//       description: tier.description || "",
//       markupPercent: markupEnabled ? tier.markupPercent || 0 : 0,
//       discountPercent: discountEnabled ? tier.discountPercent || 0 : 0,
//     };

//     onAdd(newTier);

//     setTier({
//       name: "",
//       description: "",
//       markupPercent: 0,
//       discountPercent: 0,
//     });
//     setMarkupEnabled(false);
//     setDiscountEnabled(false);
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium">Price Tier Name</label>
//         <Input
//           className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
//           value={tier.name || ""}
//           onChange={(e) => setTier({ ...tier, name: e.target.value })}
//           placeholder="Enter the name of the Price Tier"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Description (optional)</label>
//         <textarea
//           className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none text-sm"
//           value={tier.description || ""}
//           onChange={(e) => setTier({ ...tier, description: e.target.value })}
//           placeholder="Enter description"
//           rows={4}
//         />
//       </div>

//       <div className="flex flex-col gap-3.5">
//         <div className="flex items-center gap-[36px]">
//           <label className="block text-sm font-medium mb-1">Markup % </label>
//           <Switch checked={markupEnabled} onChange={handleMarkupToggle} />
//         </div>

//         {markupEnabled && (
//           <Input
//             className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
//             type="number"
//             min={0}
//             value={tier.markupPercent || ""}
//             onChange={(e) =>
//               setTier({
//                 ...tier,
//                 markupPercent: parseFloat(e.target.value) || 0,
//               })
//             }
//             placeholder="Enter markup percentage"
//           />
//         )}
//       </div>

//       <div>
//         <div className="flex items-center gap-[36px]">
//           <label className="block text-sm font-medium mb-1">Discount %</label>
//           <Switch checked={discountEnabled} onChange={handleDiscountToggle} />
//         </div>

//         {discountEnabled && (
//           <Input
//             type="number"
//             min={0}
//             className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
//             value={tier.discountPercent || ""}
//             onChange={(e) =>
//               setTier({
//                 ...tier,
//                 discountPercent: parseFloat(e.target.value) || 0,
//               })
//             }
//             placeholder="Enter discount percentage"
//           />
//         )}
//       </div>

//       <button
//         onClick={handleAdd}
//         className="border border-[#15BA5C] w-full text-[#15BA5C] py-2 rounded-[10px] font-medium text-base mt-5"
//         type="button"
//       >
//         + Add a new Price Tier
//       </button>
//     </div>
//   );
// };

//Starts Here

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import SettingFiles from "@/assets/icons/settings";
import Image from "next/image";
import { Input } from "../ui/Input";
import { Switch } from "../ui/Switch";
import settingsService from "@/services/settingsService";

interface PriceTier {
  id: string;
  name: string;
  description?: string;
  markupPercent: number;
  discountPercent: number;
  isEditing?: boolean;
}

interface OutletData {
  outlet: {
    id: number;
    businessId: number;
    name: string;
    description?: string;
    address: string;
    state?: string;
    postalCode?: string;
    phoneNumber: string;
    country: string;
    isMainLocation: boolean;
    isActive: boolean;
    // ... other outlet properties
  };
  accessType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissions?: any;
}

interface PriceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceTiers: PriceTier[];
  outletsData: OutletData[];
  onSave: (tiers: PriceTier[]) => void;
}

// API function to save price tier to backend
const savePriceTierToOutlet = async (outletId: number, tierData: PriceTier) => {
  try {
    // Update this URL to match your actual API endpoint
   const result = await settingsService.addPriceTier({
      outletId: outletId,
      name:tierData.name,
      description:tierData.description,
      isActive: true,
      pricingRules: {
        discountPercentage: tierData.discountPercent,
        markupPercentage: tierData.markupPercent,
      },
    });
    return result

  } catch (error) {
    console.error(`Error saving price tier for outlet ${outletId}:`, error);
    throw error;
  }
};

export const PriceSettingsModal: React.FC<PriceSettingsModalProps> = ({
  isOpen,
  onClose,
  priceTiers,
  onSave,
  outletsData,
}) => {
  const [tiers, setTiers] = useState<PriceTier[]>(priceTiers);
  const [isSaving, setIsSaving] = useState(false);

  // Reset tiers when modal opens with new data
  React.useEffect(() => {
    if (isOpen) {
      setTiers(priceTiers);
    }
  }, [isOpen, priceTiers]);

  const addTier = (tier: PriceTier) => {
    setTiers((prev) => [...prev, tier]);
  };

  const deleteTier = (id: string) => {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleEdit = (id: string) => {
    setTiers((prev) =>
      prev.map((tier) =>
        tier.id === id ? { ...tier, isEditing: !tier.isEditing } : tier
      )
    );
  };

  const updateTier = (id: string, updatedTier: Partial<PriceTier>) => {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, ...updatedTier } : tier))
    );
  };

  const handleSaveAll = async () => {
    if (tiers.length === 0) {
      alert("No price tiers to save.");
      return;
    }

    if (!outletsData || outletsData.length === 0) {
      alert("No outlets found to save price tiers to.");
      return;
    }

    setIsSaving(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const savePromises: Promise<any>[] = [];
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Save each tier to all outlets
      for (const tier of tiers) {
        for (const outletData of outletsData) {
          try {
            
            const promise = savePriceTierToOutlet(outletData.outlet.id, tier);

            savePromises.push(promise);
          } catch (error) {
            console.log(error)
            errorCount++;
            errors.push(
              `Failed to save "${tier.name}" to ${outletData.outlet.name}`
            );
          }
        }
      }

      // Wait for all saves to complete
      const results = await Promise.allSettled(savePromises);

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successCount++;
        } else {
          errorCount++;
          const tierIndex = Math.floor(index / outletsData.length);
          const outletIndex = index % outletsData.length;
          const tierName = tiers[tierIndex]?.name || "Unknown";
          const outletName =
            outletsData[outletIndex]?.outlet?.name || "Unknown";
          errors.push(
            `Failed to save "${tierName}" to ${outletName}: ${
              result.reason?.message || "Unknown error"
            }`
          );
        }
      });

      // Update parent state with current tiers
      onSave(tiers);

      if (errorCount === 0) {
        alert(
          `Successfully saved ${tiers.length} price tier(s) to ${outletsData.length} outlet(s)!`
        );
        onClose();
      } else {
        const message = `Saved ${successCount} items successfully, but ${errorCount} failed.\n\nErrors:\n${errors.join(
          "\n"
        )}`;
        alert(message);
        console.error("Save errors:", errors);

        // Don't close modal if there were errors so user can retry
      }
    } catch (error) {
      console.error("Unexpected error saving price tiers:", error);
      alert(
        "An unexpected error occurred while saving price tiers. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      size="md"
      subtitle="Update and Manage Price Tiers"
      image={SettingFiles.PriceTier}
      isOpen={isOpen}
      onClose={onClose}
      title="Price Settings"
    >
      <div className="space-y-6">
        {tiers.length > 0 ? (
          tiers.map((tier) => (
            <div
              key={tier.id}
              className="rounded-lg p-4 border border-gray-200"
            >
              {tier.isEditing ? (
                <EditableTierForm
                  tier={tier}
                  onSave={(updatedTier) => {
                    updateTier(tier.id, { ...updatedTier, isEditing: false });
                  }}
                  onCancel={() => toggleEdit(tier.id)}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{tier.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEdit(tier.id)}
                        type="button"
                        className="bg-[#15BA5C] flex items-center rounded-[20px] px-2.5 py-1.5 hover:bg-[#13a552] transition-colors"
                      >
                        <Image
                          src={SettingFiles.EditIcon}
                          alt="Edit"
                          className="h-[14px] w-[14px] mr-1"
                        />
                        <span className="text-white">Edit</span>
                      </button>

                      <button
                        onClick={() => deleteTier(tier.id)}
                        type="button"
                        className="border border-[#E33629] flex items-center rounded-[20px] px-2.5 py-1.5 hover:bg-red-50 transition-colors"
                      >
                        <Image
                          src={SettingFiles.TrashIcon}
                          alt="Delete"
                          className="h-[14px] w-[14px] mr-1"
                        />
                        <span className="text-[#E33629]">Delete</span>
                      </button>
                    </div>
                  </div>

                  {tier.description && (
                    <div className="text-sm text-gray-600 mb-2">
                      {tier.description}
                    </div>
                  )}

                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="border border-[#E6E6E6] px-3.5 py-2.5 rounded-[12px]">
                      Markup: {tier.markupPercent}%
                    </div>
                    <div className="border border-[#E6E6E6] px-3.5 py-2.5 rounded-[12px]">
                      Discount: {tier.discountPercent}%
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No price tiers added yet.</p>
            <p className="text-sm">Add your first price tier below.</p>
          </div>
        )}

        <div className="">
          <h4 className="font-medium mb-4">Add New Price Tier</h4>
          <PriceTierForm onAdd={addTier} />
        </div>

        <div className="flex flex-col gap-3">
          

          <button
            onClick={handleSaveAll}
            disabled={
              isSaving ||
              tiers.length === 0 ||
              !outletsData ||
              outletsData.length === 0
            }
            className={`w-full text-white py-3 rounded-[10px] font-medium text-base transition-colors ${
              isSaving ||
              tiers.length === 0 ||
              !outletsData ||
              outletsData.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#15BA5C] hover:bg-[#13a552]"
            }`}
            type="button"
          >
            {isSaving
              ? "Saving..."
              : `Save all Price Tiers to ${outletsData?.length || 0} Outlet${
                  (outletsData?.length || 0) !== 1 ? "s" : ""
                }`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Editable form component for existing tiers
interface EditableTierFormProps {
  tier: PriceTier;
  onSave: (tier: Partial<PriceTier>) => void;
  onCancel: () => void;
}

const EditableTierForm: React.FC<EditableTierFormProps> = ({
  tier,
  onSave,
  onCancel,
}) => {
  const [editedTier, setEditedTier] = useState({
    name: tier.name,
    description: tier.description || "",
    markupPercent: tier.markupPercent,
    discountPercent: tier.discountPercent,
  });

  const [markupEnabled, setMarkupEnabled] = useState(tier.markupPercent > 0);
  const [discountEnabled, setDiscountEnabled] = useState(
    tier.discountPercent > 0
  );

  const handleMarkupToggle = (enabled: boolean) => {
    setMarkupEnabled(enabled);
    if (enabled) {
      setDiscountEnabled(false);
      setEditedTier((prev) => ({ ...prev, discountPercent: 0 }));
    } else {
      setEditedTier((prev) => ({ ...prev, markupPercent: 0 }));
    }
  };

  const handleDiscountToggle = (enabled: boolean) => {
    setDiscountEnabled(enabled);
    if (enabled) {
      setMarkupEnabled(false);
      setEditedTier((prev) => ({ ...prev, markupPercent: 0 }));
    } else {
      setEditedTier((prev) => ({ ...prev, discountPercent: 0 }));
    }
  };

  const handleSave = () => {
    if (!editedTier.name || editedTier.name.trim() === "") {
      alert("Please enter a price tier name.");
      return;
    }

    onSave({
      name: editedTier.name.trim(),
      description: editedTier.description.trim(),
      markupPercent: markupEnabled ? editedTier.markupPercent : 0,
      discountPercent: discountEnabled ? editedTier.discountPercent : 0,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Price Tier Name
        </label>
        <Input
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
          value={editedTier.name}
          onChange={(e) =>
            setEditedTier({ ...editedTier, name: e.target.value })
          }
          placeholder="Enter the name of the Price Tier"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none text-sm"
          value={editedTier.description}
          onChange={(e) =>
            setEditedTier({ ...editedTier, description: e.target.value })
          }
          placeholder="Enter description"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-[36px]">
          <label className="block text-sm font-medium">Markup %</label>
          <Switch checked={markupEnabled} onChange={handleMarkupToggle} />
        </div>

        {markupEnabled && (
          <Input
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
            type="number"
            min={0}
            max={100}
            value={editedTier.markupPercent || ""}
            onChange={(e) =>
              setEditedTier({
                ...editedTier,
                markupPercent: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="Enter markup percentage"
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-[36px]">
          <label className="block text-sm font-medium">Discount %</label>
          <Switch checked={discountEnabled} onChange={handleDiscountToggle} />
        </div>

        {discountEnabled && (
          <Input
            type="number"
            min={0}
            max={100}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
            value={editedTier.discountPercent || ""}
            onChange={(e) =>
              setEditedTier({
                ...editedTier,
                discountPercent: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="Enter discount percentage"
          />
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-[#15BA5C] text-white py-2.5 rounded-[10px] font-medium text-base hover:bg-[#13a552] transition-colors"
          type="button"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-[10px] font-medium text-base hover:bg-gray-50 transition-colors"
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Keep the original PriceTierForm component
interface PriceTierFormProps {
  onAdd: (tier: PriceTier) => void;
}

export const PriceTierForm: React.FC<PriceTierFormProps> = ({ onAdd }) => {
  const [tier, setTier] = useState<Partial<PriceTier>>({
    name: "",
    description: "",
    markupPercent: 0,
    discountPercent: 0,
  });

  const [markupEnabled, setMarkupEnabled] = useState(false);
  const [discountEnabled, setDiscountEnabled] = useState(false);

  const handleMarkupToggle = (enabled: boolean) => {
    setMarkupEnabled(enabled);
    if (enabled) {
      setDiscountEnabled(false);
      setTier((prev) => ({ ...prev, discountPercent: 0 }));
    }
  };

  const handleDiscountToggle = (enabled: boolean) => {
    setDiscountEnabled(enabled);
    if (enabled) {
      setMarkupEnabled(false);
      setTier((prev) => ({ ...prev, markupPercent: 0 }));
    }
  };

  const handleAdd = () => {
    if (!tier.name || tier.name.trim() === "") {
      alert("Please enter a price tier name.");
      return;
    }

    const newTier: PriceTier = {
      id: Date.now().toString(),
      name: tier.name.trim(),
      description: tier.description?.trim() || "",
      markupPercent: markupEnabled ? tier.markupPercent || 0 : 0,
      discountPercent: discountEnabled ? tier.discountPercent || 0 : 0,
    };

    onAdd(newTier);

    // Reset form
    setTier({
      name: "",
      description: "",
      markupPercent: 0,
      discountPercent: 0,
    });
    setMarkupEnabled(false);
    setDiscountEnabled(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Price Tier Name
        </label>
        <Input
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
          value={tier.name || ""}
          onChange={(e) => setTier({ ...tier, name: e.target.value })}
          placeholder="Enter the name of the Price Tier"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none text-sm"
          value={tier.description || ""}
          onChange={(e) => setTier({ ...tier, description: e.target.value })}
          placeholder="Enter description"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-[36px]">
          <label className="block text-sm font-medium">Markup %</label>
          <Switch checked={markupEnabled} onChange={handleMarkupToggle} />
        </div>

        {markupEnabled && (
          <Input
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
            type="number"
            min={0}
            max={100}
            value={tier.markupPercent || ""}
            onChange={(e) =>
              setTier({
                ...tier,
                markupPercent: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="Enter markup percentage"
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-[36px]">
          <label className="block text-sm font-medium">Discount %</label>
          <Switch checked={discountEnabled} onChange={handleDiscountToggle} />
        </div>

        {discountEnabled && (
          <Input
            type="number"
            min={0}
            max={100}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
            value={tier.discountPercent || ""}
            onChange={(e) =>
              setTier({
                ...tier,
                discountPercent: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="Enter discount percentage"
          />
        )}
      </div>

      <button
        onClick={handleAdd}
        className="border border-[#15BA5C] w-full text-[#15BA5C] py-2.5 rounded-[10px] font-medium text-base mt-4 hover:bg-green-50 transition-colors"
        type="button"
      >
        + Add a new Price Tier
      </button>
    </div>
  );
};
