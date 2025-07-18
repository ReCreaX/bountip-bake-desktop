import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Switch } from "../ui/Switch";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { PaymentMethod } from "@/types/settingTypes";
import SettingFiles from "@/assets/icons/settings";

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  onSave: (methods: PaymentMethod[]) => void;
}

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({
  isOpen,
  onClose,
  paymentMethods,
  onSave,
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>(paymentMethods);

  const handleToggle = (id: string, enabled: boolean) => {
    setMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, enabled } : method))
    );
  };

  const handleSave = () => {
    onSave(methods);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <Banknote className="w-5 h-5 text-green-600" />;
      case "virtual":
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <Modal
      size={"lg"}
      image={SettingFiles.PaymentMethods}
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Methods"
      subtitle="Manage your payment methods"
    >
      <div className="space-y-4">
        <PaymentBanner heading="Activate Payment Methods for your Business" />

        <div className="flex flex-col gap-6">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-[#D1D1D1] rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getIcon(method.type)}
                <span className="font-medium">{method.name}</span>
              </div>
              <Switch
                checked={method.enabled}
                onChange={(enabled) => handleToggle(method.id, enabled)}
              />
            </div>
          ))}
        </div>

        

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface PaymentBannerProps {
  className?: string;
  heading: string;
}

const PaymentBanner: React.FC<PaymentBannerProps> = ({
  className = "",
  heading,
}) => {
  return (
    <div
      className={`relative bg-[#15BA5C] rounded-lg px-6 py-6 overflow-hidden ${className}`}
    >
      {/* Main text */}
      <h2 className="text-white text-lg font-medium relative z-10">
        {heading}
      </h2>

      {/* Decorative circles */}
      <div className="absolute right-0 bottom-1/2 transform -translate-y-1/2 pointer-events-none">
        {/* Large outer circle - transparent with border */}
        <div className="absolute w-40 h-40 border-2 border-white/30 rounded-full -top-24 -right-20"></div>

        {/* Medium circle - transparent with border */}
        <div className="absolute w-24 h-24 border-2 border-white/40 rounded-full -top-12 -right-10"></div>

        {/* Small filled circle - white */}
        <div className="absolute w-5 h-5 bg-white rounded-full -top-3 right-10"></div>

        {/* Small black circle - dark green/black (unchanged) */}
        <div className="absolute w-8 h-8 bg-green-900 rounded-full top-2 right-2"></div>
      </div>
    </div>
  );
};
