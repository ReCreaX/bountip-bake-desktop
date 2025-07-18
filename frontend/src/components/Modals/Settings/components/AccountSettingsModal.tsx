import SettingFiles from "@/assets/icons/settings";
import { Modal } from "../ui/Modal";
import { useState } from "react";
import { Dropdown } from "../ui/Dropdown";
import { Check, Plus } from "lucide-react";

export const AccountSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"taxes" | "service">("taxes");
  const [taxes, setTaxes] = useState<TaxItem[]>([
    {
      id: "1",
      name: "VAT",
      rate: 7.5,
      includeInMenuPrices: true,
      applyAtOrderCheckout: false,
      applyAtOrderCheckoutOptional: false,
      productSetup: "all",
      selectedCategories: {},
    },
  ]);

  const [categories, setCategories] = useState<DropdownOption[]>([
    { value: "bread", label: "Bread" },
    { value: "dough", label: "Dough" },
  ]);
  const addNewTax = () => {
    const newTax: TaxItem = {
      id: Date.now().toString(),
      name: "",
      rate: 0,
      includeInMenuPrices: true,
      applyAtOrderCheckout: false,
      applyAtOrderCheckoutOptional: false,
      productSetup: "all",
      selectedCategories: {},
    };
    setTaxes([...taxes, newTax]);
  };

  const updateTax = (id: string, updates: Partial<TaxItem>) => {
    setTaxes(
      taxes.map((tax) => (tax.id === id ? { ...tax, ...updates } : tax))
    );
  };

  const addNewCategory = (categoryName: string) => {
    const newCategory = {
      value: categoryName.toLowerCase().replace(/\s+/g, "-"),
      label: categoryName,
    };
    setCategories([...categories, newCategory]);
  };

  const saveTax = () => {
    console.log("Saving taxes:", taxes);
    // Here you would typically save to your backend
    alert("Tax configuration saved successfully!");
  };

  return (
    <Modal
      image={SettingFiles.AccountSettings}
      isOpen={isOpen}
      onClose={onClose}
      title="Account Settings"
      subtitle="Manage your Business tax and service Charge"
    >
      <div className="space-y-6">
        <div className="flex border-b border-[#E6E6E6]">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "taxes"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("taxes")}
          >
            Taxes
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "service"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("service")}
          >
            Service Charge
          </button>
        </div>
        {activeTab === "taxes" && (
          <div className="space-y-6">
            {taxes.map((tax, index) => (
              <TaxItemComponent
                key={tax.id}
                tax={tax}
                index={index}
                categories={categories}
                onUpdate={updateTax}
                onAddCategory={addNewCategory}
              />
            ))}

            <button
              onClick={addNewTax}
              className="w-full mb-4 px-4 py-3 border border-[#15BA5C] text-[#15BA5C] rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center bg-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add a new Tax
            </button>

            <button
              onClick={saveTax}
              className="w-full px-6 py-3 bg-[#15BA5C] text-white font-medium rounded-lg hover:bg-[#13A652] transition-colors flex items-center justify-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Tax
            </button>
          </div>
        )}
        {activeTab === "service" && <ServiceCharge />}{" "}
      </div>
    </Modal>
  );
};

interface DropdownOption {
  value: string;
  label: string;
}

interface TaxItem {
  id: string;
  name: string;
  rate: number;
  includeInMenuPrices: boolean;
  applyAtOrderCheckout: boolean;
  applyAtOrderCheckoutOptional: boolean;
  productSetup: "all" | "categories" | "certain";
  selectedCategories: Record<string, boolean>;
}

interface TaxItemComponentProps {
  tax: TaxItem;
  index: number;
  categories: DropdownOption[];
  onUpdate: (id: string, updates: Partial<TaxItem>) => void;
  onAddCategory: (categoryName: string) => void;
}

const TaxItemComponent: React.FC<TaxItemComponentProps> = ({
  tax,
  index,
  categories,
  onUpdate,
  onAddCategory,
}) => {
  const getTaxTitle = () => {
    if (index === 0) return "VAT";
    if (index === 1) return "Tax one";
    return `Tax ${index + 1}`;
  };

  const getNamePlaceholder = () => {
    if (index === 0) return "VAT";
    return "Enter Task Name";
  };

  return (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {getTaxTitle()}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Name
          </label>
          <input
            type="text"
            value={tax.name}
            onChange={(e) => onUpdate(tax.id, { name: e.target.value })}
            placeholder={getNamePlaceholder()}
            className="outline-none text-[12px]  border-2 border-[#D1D1D1] w-full px-3.5 py-2.5 bg-[#FAFAFC] rounded-[10px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Rate (%)
          </label>
          <input
            type="text"
            value={tax.rate}
            onChange={(e) =>
              onUpdate(tax.id, { rate: parseFloat(e.target.value) || 0 })
            }
            placeholder="0.00"
            step="0.01"
            className="outline-none text-[12px]  border-2 border-[#D1D1D1] w-full px-3.5 py-2.5 bg-[#FAFAFC] rounded-[10px]"
          />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          <div className="relative">
            <input
              type="checkbox"
              id={`includeInMenuPrices-${tax.id}`}
              checked={tax.includeInMenuPrices}
              onChange={(e) =>
                onUpdate(tax.id, { includeInMenuPrices: e.target.checked })
              }
              className="sr-only"
            />
            <label
              htmlFor={`includeInMenuPrices-${tax.id}`}
              className="flex items-center cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                  tax.includeInMenuPrices
                    ? "border-[#15BA5C] bg-[#15BA5C]"
                    : "border-gray-300"
                }`}
              >
                {tax.includeInMenuPrices && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700">
                Include Tax in Menu Prices
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <input
              type="checkbox"
              id={`applyAtOrderCheckout-${tax.id}`}
              checked={tax.applyAtOrderCheckout}
              onChange={(e) =>
                onUpdate(tax.id, { applyAtOrderCheckout: e.target.checked })
              }
              className="sr-only"
            />
            <label
              htmlFor={`applyAtOrderCheckout-${tax.id}`}
              className="flex items-center cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                  tax.applyAtOrderCheckout
                    ? "border-[#15BA5C] bg-[#15BA5C]"
                    : "border-gray-300"
                }`}
              >
                {tax.applyAtOrderCheckout && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700">
                Apply Tax at order checkout
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <input
              type="checkbox"
              id={`applyAtOrderCheckoutOptional-${tax.id}`}
              checked={tax.applyAtOrderCheckoutOptional}
              onChange={(e) =>
                onUpdate(tax.id, {
                  applyAtOrderCheckoutOptional: e.target.checked,
                })
              }
              className="sr-only"
            />
            <label
              htmlFor={`applyAtOrderCheckoutOptional-${tax.id}`}
              className="flex items-center cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                  tax.applyAtOrderCheckoutOptional
                    ? "border-[#15BA5C] bg-[#15BA5C]"
                    : "border-gray-300"
                }`}
              >
                {tax.applyAtOrderCheckoutOptional && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700">
                Apply Tax at order checkout (optional)
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Product Setup</h4>

        <div className="space-y-3">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="radio"
                id={`productSetup-all-${tax.id}`}
                name={`productSetup-${tax.id}`}
                checked={tax.productSetup === "all"}
                onChange={() => onUpdate(tax.id, { productSetup: "all" })}
                className="sr-only"
              />
              <label
                htmlFor={`productSetup-all-${tax.id}`}
                className="flex items-center cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    tax.productSetup === "all"
                      ? "border-[#15BA5C] bg-[#15BA5C]"
                      : "border-gray-300"
                  }`}
                >
                  {tax.productSetup === "all" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-sm text-gray-700">
                  Apply to all products
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <input
                type="radio"
                id={`productSetup-categories-${tax.id}`}
                name={`productSetup-${tax.id}`}
                checked={tax.productSetup === "categories"}
                onChange={() =>
                  onUpdate(tax.id, { productSetup: "categories" })
                }
                className="sr-only"
              />
              <label
                htmlFor={`productSetup-categories-${tax.id}`}
                className="flex items-center cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    tax.productSetup === "categories"
                      ? "border-[#15BA5C] bg-[#15BA5C]"
                      : "border-gray-300"
                  }`}
                >
                  {tax.productSetup === "categories" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-sm text-gray-700">
                  Apply to all Categories
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <input
                type="radio"
                id={`productSetup-certain-${tax.id}`}
                name={`productSetup-${tax.id}`}
                checked={tax.productSetup === "certain"}
                onChange={() => onUpdate(tax.id, { productSetup: "certain" })}
                className="sr-only"
              />
              <label
                htmlFor={`productSetup-certain-${tax.id}`}
                className="flex items-center cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    tax.productSetup === "certain"
                      ? "border-[#15BA5C] bg-[#15BA5C]"
                      : "border-gray-300"
                  }`}
                >
                  {tax.productSetup === "certain" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-sm text-gray-700">
                  Apply to certain products
                </span>
              </label>
            </div>
          </div>
        </div>

        {tax.productSetup === "categories" && (
          <div className="mt-4">
            <Dropdown
              mode="checkbox"
              options={categories}
              selectedValues={tax.selectedCategories}
              onMultiChange={(values) =>
                onUpdate(tax.id, { selectedCategories: values })
              }
              placeholder="Select All that apply"
              label="Categories"
              allowAddNew={true}
              onAddNew={onAddCategory}
              addNewLabel="Add Category"
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ServiceCharge: React.FC = ({}) => {
  const [serviceName, setServiceName] = useState("");
  const [serviceRate, setServiceRate] = useState("");
  const [selectedOption, setSelectedOption] = useState<
    "menu" | "checkout" | "tax"
  >("menu");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (onCreateServiceCharge) {
    //   onCreateServiceCharge({
    //     name: serviceName,
    //     rate: parseFloat(serviceRate) || 0,
    //     type: selectedOption,
    //   });
    // }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="border border-[#E6E6E6] rounded-[10px] mb-7 relative px-5 py-9">
        <h2 className="text-lg font-semibold bg-white text-gray-900 mb-6 absolute z-50 -top-3.5">
          Service Charge
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Charge Name */}
            <div>
              <label
                htmlFor="serviceName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Charge Name
              </label>
              <input
                type="text"
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter name of Service Charge"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Service Charge Rate */}
            <div>
              <label
                htmlFor="serviceRate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Charge Rate (%)
              </label>
              <input
                type="text"
                id="serviceRate"
                value={serviceRate}
                onChange={(e) => setServiceRate(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Radio Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="radio"
                  id="includeMenu"
                  name="serviceChargeOption"
                  value="menu"
                  checked={selectedOption === "menu"}
                  onChange={(e) => setSelectedOption(e.target.value as "menu")}
                  className="sr-only"
                />
                <label
                  htmlFor="includeMenu"
                  className="flex items-center cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === "menu"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === "menu" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-900">
                    Include Service Charge in Menu Prices
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <input
                  type="radio"
                  id="applyCheckout"
                  name="serviceChargeOption"
                  value="checkout"
                  checked={selectedOption === "checkout"}
                  onChange={(e) =>
                    setSelectedOption(e.target.value as "checkout")
                  }
                  className="sr-only"
                />
                <label
                  htmlFor="applyCheckout"
                  className="flex items-center cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === "checkout"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === "checkout" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-900">
                    Apply Service Charge at Order checkout
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <input
                  type="radio"
                  id="applyTax"
                  name="serviceChargeOption"
                  value="tax"
                  checked={selectedOption === "tax"}
                  onChange={(e) => setSelectedOption(e.target.value as "tax")}
                  className="sr-only"
                />
                <label
                  htmlFor="applyTax"
                  className="flex items-center cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === "tax"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === "tax" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-900">
                    Apply Tax at order checkout (optional)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
        </form>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Create Service Charge
      </button>
    </div>
  );
};
