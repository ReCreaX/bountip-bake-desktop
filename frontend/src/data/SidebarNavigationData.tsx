import AssetsFiles from "@/assets";

import { StaticImageData } from "next/image";

type SidebarNavigationItem = {
  id: string;
  label: string;
  icon: StaticImageData;
  isActive: boolean;
};

export const DashboardSidebarNavigationData: SidebarNavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: AssetsFiles.DashboardIcon,
    isActive: true,
  },
  {
    id: "pre-order",
    label: "Pre-Order",
    icon: AssetsFiles.PreIcon,
    isActive: false,
  },
  {
    id: "pos",
    label: "Point of Sale (POS)",
    icon: AssetsFiles.PosIcon,
    isActive: false,
  },
  {
    id: "recipe-management",
    label: "Recipe Management",
    icon: AssetsFiles.RecipeIcon,
    isActive: false,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: AssetsFiles.InventoryIcon,
    isActive: false,
  },
  {
    id: "production",
    label: "Production",
    icon: AssetsFiles.ProductionIcon,
    isActive: false,
  },
  {
    id: "product-management",
    label: "Product Management",
    icon: AssetsFiles.ProductManagementIcon,
    isActive: false,
  },
  {
    id: "report-analytics",
    label: "Report & Analytics",
    icon: AssetsFiles.ReportAnalyticsIcon,
    isActive: false,
  },
  {
    id: "roles-permissions",
    label: "Roles & Permissions",
    icon: AssetsFiles.RolesIcon,
    isActive: false,
  },
  {
    id: "distribution",
    label: "Distribution",
    icon: AssetsFiles.DistributionIcon,
    isActive: false,
  },
];
