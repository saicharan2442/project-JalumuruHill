import { Donor, Temple, Event, Contact } from "@/types/models";
import { toast } from "sonner";

const API_BASE = "http://localhost:5000/api";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Request failed");
  }
  return res.json();
};

// Temple service
export const templeService = {
  getAll: async (): Promise<Temple[]> => {
    const res = await fetch(`${API_BASE}/temples`);
    return handleResponse(res);
  },

  create: async (temple: Omit<Temple, "id">): Promise<Temple> => {
    const res = await fetch(`${API_BASE}/temples`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(temple),
    });
    const data = await handleResponse(res);
    toast.success("Temple added successfully");
    return data;
  },

  update: async (id: number, temple: Partial<Temple>): Promise<Temple> => {
    const res = await fetch(`${API_BASE}/temples/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(temple),
    });
    const data = await handleResponse(res);
    toast.success("Temple updated successfully");
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/temples/${id}`, { method: "DELETE" });
    await handleResponse(res);
    toast.success("Temple deleted successfully");
  },
};

// Donor service
export const donorService = {
  getAll: async (): Promise<Donor[]> => {
    const res = await fetch(`${API_BASE}/donors`);
    return handleResponse(res);
  },

  create: async (donor: Omit<Donor, "id">): Promise<Donor> => {
    const res = await fetch(`${API_BASE}/donors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donor),
    });
    const data = await handleResponse(res);
    toast.success("Donor added successfully");
    return data;
  },

  update: async (id: number, donor: Partial<Donor>): Promise<Donor> => {
    const res = await fetch(`${API_BASE}/donors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donor),
    });
    const data = await handleResponse(res);
    toast.success("Donor updated successfully");
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/donors/${id}`, { method: "DELETE" });
    await handleResponse(res);
    toast.success("Donor deleted successfully");
  },

  importFromCsv: async (csv: string): Promise<Donor[]> => {
    const formData = new FormData();
    formData.append("file", new Blob([csv], { type: "text/csv" }), "donors.csv");

    const res = await fetch(`${API_BASE}/donors/import`, {
      method: "POST",
      body: formData,
    });

    const data = await handleResponse(res);
    toast.success(`Successfully imported ${data.length} donors`);
    return data;
  },
};

// Event service
export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const res = await fetch(`${API_BASE}/events`);
    return handleResponse(res);
  },

  create: async (event: Omit<Event, "id">): Promise<Event> => {
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    const data = await handleResponse(res);
    toast.success("Event added successfully");
    return data;
  },

  update: async (id: number, event: Partial<Event>): Promise<Event> => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    const data = await handleResponse(res);
    toast.success("Event updated successfully");
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/events/${id}`, { method: "DELETE" });
    await handleResponse(res);
    toast.success("Event deleted successfully");
  },
};

// Contact service
export const contactService = {
  getAll: async (): Promise<Contact[]> => {
    const res = await fetch(`${API_BASE}/contacts`);
    return handleResponse(res);
  },

  create: async (contact: Omit<Contact, "id">): Promise<Contact> => {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    const data = await handleResponse(res);
    toast.success("Contact added successfully");
    return data;
  },

  update: async (id: number, contact: Partial<Contact>): Promise<Contact> => {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    const data = await handleResponse(res);
    toast.success("Contact updated successfully");
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/contacts/${id}`, { method: "DELETE" });
    await handleResponse(res);
    toast.success("Contact deleted successfully");
  },
};
