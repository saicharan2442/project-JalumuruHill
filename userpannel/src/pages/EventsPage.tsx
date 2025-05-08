import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";

type Event = {
  id: number;
  eventname: string;
  event_date: string;
  event_temple: string;
  discription: string;
  image_url?: string; // if you want to show an image later
};

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-10 px-4 sm:px-8 bg-yellow-50">
        <h1 className="text-3xl font-bold text-yellow-800 text-center mb-2">Temple Events</h1>
        <p className="text-lg text-yellow-700 text-center mb-8">
          <b>Stay updated with upcoming religious events, festivals, and celebrations at Jalumuru Hill temples.</b>
        </p>

        {events.length === 0 ? (
          <p className="text-center text-gray-500">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg p-4 border border-yellow-200 transition-transform hover:scale-105 hover:shadow-yellow-400/60 hover:shadow-xl flex flex-col"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-yellow-100 p-3 rounded-md">
                    <Calendar className="h-6 w-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-1">{event.eventname}</h3>
                    <p className="text-sm font-medium text-yellow-600">{event.event_date}</p>
                    <p className="text-sm text-yellow-700 mb-2">{event.event_temple}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{event.discription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
