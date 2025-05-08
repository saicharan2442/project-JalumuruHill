
export interface Temple {
  id: string;
  name: string;
  donor: string;
  village: string;
  district: string;
  contactNumber: string;
  imageUrl: string;
  createdAt: string;
}

export interface Donor {
  id: string;
  name: string;
  village: string;
  district: string;
  email: string;
  phone: string;
  donationAmount: number;
  donationType: string;
  date: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  templeId: string;
  templeName: string;
  description: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  role: string;
  name: string;
  email: string;
  mobile: string;
  imageUrl: string;
  createdAt: string;
}
