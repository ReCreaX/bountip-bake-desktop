"use client";
import React, { useEffect, useState } from "react";

import { PriceSettingsModal } from "@/components/Modals/Settings/components/PriceSettingsModal";
import { PaymentMethodsModal } from "@/components/Modals/Settings/components/PaymentMethodsModal";
import { BusinessDetailsModal } from "@/components/Modals/Settings/components/BusinessDetailsModal";
import { PaymentMethod, PriceTier } from "@/types/settingTypes";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { LabellingSettingsModal } from "@/components/Modals/Settings/components/LabellingSettingsModal";
import { InventoryHubModal } from "@/components/Modals/Settings/components/InventoryHubModal";
import { InvoiceCustomizationModal } from "@/components/Modals/Settings/components/InvoiceCustomizationModal";
import { AccountSettingsModal } from "@/components/Modals/Settings/components/AccountSettingsModal";
import { PasswordSettingsModal } from "@/components/Modals/Settings/components/PasswordSettingsModal";
import { OperatingHoursModal } from "@/components/Modals/Settings/components/OperatingHoursModal";
import settingsItems from "@/data/settingItems";
import { LocationSettingsModal } from "@/components/Modals/Settings/components/LocationSettingsModal";
import { businessService } from "@/services/businessService";
import { BusinessAndOutlet, BusinessResponse } from "@/types/businessTypes";
import { COOKIE_NAMES } from "@/utils/cookiesUtils";
import { ReceiptCustomizationModal } from "@/components/Modals/Settings/components/ReceiptCustomizationModal";

const SettingsPage: React.FC = () => {
  const [{ businessId, outletId }, setBusinessOutlet] =
    useState<BusinessAndOutlet>({
      businessId: "",
      outletId: "",
    });
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [businessData, setBusinessData] = useState(null);
  const [outletsData, setOutletsData] = useState([]);

  useEffect(() => {
    if (typeof businessId === "number" && typeof outletId === "number") return;

    const fetchBusiness = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = (await businessService.getUserBusiness(
          COOKIE_NAMES.BOUNTIP_LOGIN_USER_TOKENS
        )) as BusinessResponse;
        console.log("This is the business response:", res);
        if ("error" in res || !res.status) {
          console.warn("Failed to fetch business:", res);
          return;
        }

        const businessId = res.data?.business?.id ?? null;
        const outletId = res.data?.outlets?.[0]?.outlet?.id ?? null;
        console.log("This is business----", businessId, outletId);

        setBusinessData(res.data?.business);
        setOutletsData(res.data?.outlets);
        if (outletId && businessId) {
          setBusinessOutlet({ businessId, outletId });
        }
      } catch (err) {
        console.error("Unexpected error while fetching business:", err);
      }
    };

    fetchBusiness();
  }, [businessId, outletId]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", name: "Cash", type: "cash", enabled: false },
    { id: "2", name: "Virtual Hub", type: "virtual", enabled: false },
    { id: "3", name: "Others", type: "others", enabled: true },
  ]);

  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([
    {
      id: "1",
      name: "Mark up 10%",
      description: "",
      markupPercent: 10,
      discountPercent: 0,
    },
    {
      id: "2",
      name: "Mark up 10%",
      description: "",
      markupPercent: 10,
      discountPercent: 0,
    },
  ]);

  const handleSettingClick = (id: string) => {
    setActiveModal(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-5 py-3">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            General Settings
          </h1>
          <p className="text-[#737373]">
            Manage your business and personal preferences here
          </p>
        </div>
        <hr className="border border-[#E7E7E7] my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white px-2 py-3.5">
          {settingsItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSettingClick(item.id)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-full ${item.color}`}>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <ChevronRight className="h-[14px]" />{" "}
              </div>
              <p className="text-sm text-[#737373]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <BusinessDetailsModal
        isOpen={activeModal === "business-info"}
        onClose={() => setActiveModal(null)}
        outletId={outletId}
      />

      <PaymentMethodsModal
        isOpen={activeModal === "payment-methods"}
        onClose={() => setActiveModal(null)}
        paymentMethods={paymentMethods}
        onSave={setPaymentMethods}
      />

      <LocationSettingsModal
        isOpen={activeModal === "location"} // or whatever ID you use for location in your settingsItems
        onClose={() => setActiveModal(null)}
        businessId={businessId as string}
        locationData={outletsData}
      />

      <PriceSettingsModal
        isOpen={activeModal === "pricing"}
        onClose={() => setActiveModal(null)}
        priceTiers={priceTiers}
        onSave={setPriceTiers}
        outletsData={outletsData}
      />

      <PasswordSettingsModal
        isOpen={activeModal === "password-settings"}
        onClose={() => setActiveModal(null)}
      />

      <LabellingSettingsModal
        isOpen={activeModal === "labelling-settings"}
        onClose={() => setActiveModal(null)}
      />

      <InventoryHubModal
        isOpen={activeModal === "inventory-hub"}
        onClose={() => setActiveModal(null)}
        businessId={businessId as string}
      />

      <InvoiceCustomizationModal
        isOpen={activeModal === "invoice-customization"}
        onClose={() => setActiveModal(null)}
      />

      {/* Add modals for other settings as needed */}
      <OperatingHoursModal
        isOpen={activeModal === "operating-hours"}
        onClose={() => setActiveModal(null)}
        businessId={businessId}
        outletsData={outletsData}
        outletId={outletId}
      />
      <ReceiptCustomizationModal
        isOpen={activeModal === "receipt-customization"}
        onClose={() => setActiveModal(null)}
      />
      <AccountSettingsModal
        isOpen={activeModal === "account-settings"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default SettingsPage;
