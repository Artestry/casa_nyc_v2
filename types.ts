export enum Borough {
  Manhattan = 'Manhattan',
  Brooklyn = 'Brooklyn',
  Queens = 'Queens',
  Bronx = 'Bronx',
  StatenIsland = 'Staten Island'
}

export interface Listing {
  id: string;
  development_name: string;
  address: string;
  borough: Borough;
  neighborhood: string;
  total_units: number;
  affordable_units: number;
  min_income: number;
  max_income: number;
  rent_range: [number, number];
  application_deadline: string;
  image_url?: string;
  application_url?: string;
  ami_percentage: number;
  amenities: string[];
  accessibility_features: string[];
  pet_policy: string;
}

export interface UserPreferences {
  fullName: string;
  email: string;
  phone: string;
  contactMethod: 'email' | 'sms' | 'both';
  boroughs: Borough[];
  householdSize: number;
  annualIncome: number;
  employmentStatus: string;
  bedroomPreference: string;
  minRent: number;
  maxRent: number;
  hasVoucher: boolean;
  voucherDetails?: string;
  moveTimeline: string;
  accessibilityRequired: boolean;
  accessibilityFeatures: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface AmiDataPoint {
  name: string;
  incomeLimit: number;
  userIncome: number;
}