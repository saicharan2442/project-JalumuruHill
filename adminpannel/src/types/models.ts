
export interface Temple {
  id: string;
  tname: string;
  donar: string;
  village: string;
  district: string;
  ph_no: string;
  image_url: string;
  created_at: string;
}

export interface Donor {
  id: string;
  Name: string;
  village: string;
  district: string;
  email: string;
  phone_number: string;
  donated: string;
  donated_at: string;
  created_at: string;
}

export interface Event {
  id: string;
  eventname: string;
  event_date: string;
  event_temple: string;
  discription: string;
  created_at: string;
export interface Contact {
  id: string;
  role: string;
  name: string;
  email: string;
  mobile: string;
  imageUrl: string;
  createdAt: string;
}
