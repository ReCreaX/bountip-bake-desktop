export type OnboardBusinessData = {
  businessId: string | number;
  outletId: string | number;
  country: string;
  logoUrl: File | string;
  address: string;
  businessType: string;
  currency: string;
  revenueRange: string;
};

export interface BusinessAndOutlet {
  businessId: number | string;
  outletId: number | string;
}
export interface BusinessResponse {
  error?: string;
  status: boolean;
  data?: {
    business?: { id: number };
    outlets?: Array<{ outlet: { id: number } }>;
  };
}

export type BusinessDetailsType = {
  name: string;
  email?:string;
  address: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  businessType: string;
  logoUrl?: string; 
};
