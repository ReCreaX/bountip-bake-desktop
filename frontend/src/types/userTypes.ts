
export type UserType= {
    id: string;
    fullName: string;
    email: string;
    status: string;
    lastLoginAt: string;
    createdAt: string;
    userType: 'admin' | 'merchant' | 'customer' | string; 
  }
  