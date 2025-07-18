import SettingFiles from "@/assets/icons/settings";
import { StaticImageData } from "next/image";

export interface ISettingItem {
    id: string;
    title: string;
    description: string;
    icon: StaticImageData;
    color: string;
}

const settingsItems:ISettingItem[] = [
    {
      id: "business-info",
      title: "Business Information",
      description: "Update and Manage Business Information",
      icon: SettingFiles.BusinessIcon,
      color: "border border-[#15BA5C] text-green-600",
    },
    {
      id: "pricing",
      title: "Pricing",
      description: "Manage your preferred pricing tiers",
      icon: SettingFiles.PriceTier,
      color: "border border-[#15BA5C] text-blue-600",
    },
    {
      id: "location",
      title: "Location",
      description: "Add and remove your business location",
      icon: SettingFiles.LocationIcon,
      color: "border border-[#15BA5C] text-green-600",
    },
    {
      id: "operating-hours",
      title: "Operating Hours",
      description: "Manage operating hours",
      icon: SettingFiles.OperatingHours,
      color: "border border-[#15BA5C] text-green-600",
    },
    {
      id: "inventory-hub",
      title: "Inventory Hub",
      description: "Centralize your inventory",
      icon: SettingFiles.InventoryIcon,
      color: "border border-[#15BA5C] text-green-600",
    },
    {
      id: "account-settings",
      title: "Account Settings",
      description: "Customize preferences",
      icon: SettingFiles.AccountSettings,
      color: "border border-[#15BA5C] text-green-600",
    },
    {
      id: "payment-methods",
      title: "Payment Methods",
      description: "Manage your payment methods",
      icon: SettingFiles.PaymentMethods,
      color: "border border-[#15BA5C] text-green-600",
    },
    {
      id: "receipt-customization",
      title: "Receipt Customization",
      description: "Customize receipt layout",
      icon: SettingFiles.ReceiptIcon,
      color: "border border-[#15BA5C] text-green-600",
    },
    {
      id: "invoice-customization",
      title: "Invoice Customization",
      description: "Customize invoice layout",
      icon: SettingFiles.InvoiceCustomization,
      color: "bborder border-[#15BA5C] text-green-600",
    },
    {
      id: "password-settings",
      title: "Password Settings",
      description: "Manage your password",
      icon: SettingFiles.PasswordSettingsIcon,
      color: "border border-[#15BA5C] text-green-600",
    },
    {
      id: "labelling-settings",
      title: "Labelling Settings",
      description: "Customize your product labels",
      icon: SettingFiles.LabelingSettings,
      color: "border border-[#15BA5C] text-green-600",
    },
  ];
  export default settingsItems