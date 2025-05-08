
import { Temple, Donor, Event, Contact } from "@/types/models";
import { v4 as uuidv4 } from "uuid";

// Mock Temples
export const temples: Temple[] = [
  {
    id: uuidv4(),
    name: "Sri Venkateswara Temple",
    donor: "Ravi Kumar",
    village: "Jalumuru",
    district: "Srikakulam",
    contactNumber: "9876543210",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    createdAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Anjaneyaswamy Temple",
    donor: "Ramesh Babu",
    village: "Jalumuru",
    district: "Srikakulam",
    contactNumber: "8765432109",
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be",
    createdAt: new Date(2023, 1, 5).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Shiva Temple",
    donor: "Krishna Rao",
    village: "Narasannapeta",
    district: "Srikakulam",
    contactNumber: "7654321098",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
    createdAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Durga Temple",
    donor: "Lakshmi Devi",
    village: "Tekkali",
    district: "Srikakulam",
    contactNumber: "6543210987",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098",
    createdAt: new Date(2023, 3, 20).toISOString(),
  },
];

// Mock Donors
export const donors: Donor[] = [
  {
    id: uuidv4(),
    name: "Ravi Kumar",
    village: "Jalumuru",
    district: "Srikakulam",
    email: "ravi@example.com",
    phone: "9876543210",
    donationAmount: 50000,
    donationType: "Money",
    date: new Date(2023, 0, 10).toISOString(),
    createdAt: new Date(2023, 0, 10).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Lakshmi Devi",
    village: "Tekkali",
    district: "Srikakulam",
    email: "lakshmi@example.com",
    phone: "6543210987",
    donationAmount: 25000,
    donationType: "Money",
    date: new Date(2023, 1, 15).toISOString(),
    createdAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Krishna Rao",
    village: "Narasannapeta",
    district: "Srikakulam",
    email: "krishna@example.com",
    phone: "7654321098",
    donationAmount: 75000,
    donationType: "Land",
    date: new Date(2023, 2, 5).toISOString(),
    createdAt: new Date(2023, 2, 5).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Ramesh Babu",
    village: "Jalumuru",
    district: "Srikakulam",
    email: "ramesh@example.com",
    phone: "8765432109",
    donationAmount: 35000,
    donationType: "Money",
    date: new Date(2023, 3, 10).toISOString(),
    createdAt: new Date(2023, 3, 10).toISOString(),
  },
];

// Mock Events
export const events: Event[] = [
  {
    id: uuidv4(),
    name: "Annual Brahmotsavam",
    date: new Date(2025, 3, 15).toISOString(),
    templeId: temples[0].id,
    templeName: temples[0].name,
    description: "Annual celebration of the temple deity with special pujas and processions",
    createdAt: new Date(2023, 0, 5).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Hanuman Jayanti",
    date: new Date(2025, 3, 25).toISOString(),
    templeId: temples[1].id,
    templeName: temples[1].name,
    description: "Celebration of Lord Hanuman's birth with special abhishekam and archana",
    createdAt: new Date(2023, 1, 10).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Maha Shivaratri",
    date: new Date(2025, 2, 1).toISOString(),
    templeId: temples[2].id,
    templeName: temples[2].name,
    description: "Night-long festival dedicated to Lord Shiva with special rudrabhishekam",
    createdAt: new Date(2023, 2, 15).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Navaratri Celebrations",
    date: new Date(2025, 9, 10).toISOString(),
    templeId: temples[3].id,
    templeName: temples[3].name,
    description: "Nine-day festival celebrating Goddess Durga with special pujas each day",
    createdAt: new Date(2023, 3, 5).toISOString(),
  },
];

// Mock Contacts
export const contacts: Contact[] = [
  {
    id: uuidv4(),
    role: "Head Priest",
    name: "Sharma Sastry",
    email: "sharma@example.com",
    mobile: "9876543210",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    createdAt: new Date(2023, 0, 5).toISOString(),
  },
  {
    id: uuidv4(),
    role: "Temple Manager",
    name: "Gopal Krishna",
    email: "gopal@example.com",
    mobile: "8765432109",
    imageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
    createdAt: new Date(2023, 1, 10).toISOString(),
  },
  {
    id: uuidv4(),
    role: "Administrative Officer",
    name: "Lakshmi Prasad",
    email: "lakshmi.p@example.com",
    mobile: "7654321098",
    imageUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    createdAt: new Date(2023, 2, 15).toISOString(),
  },
  {
    id: uuidv4(),
    role: "Security Head",
    name: "Ravi Shankar",
    email: "ravi.s@example.com",
    mobile: "6543210987",
    imageUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    createdAt: new Date(2023, 3, 5).toISOString(),
  },
];
