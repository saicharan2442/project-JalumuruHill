import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

type Event = {
  id: number;
  eventname: string;
  event_date: string;
  event_temple: string;
  discription: string;
};

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        const latestThree = data.slice(0, 3); // Only latest 3 events
        setEvents(latestThree);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-12 bg-temple-cream">
      <div className="temple-container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="section-title">Upcoming Events</h2>
          <Link to="/events">
            <Button
              variant="outline"
              className="border-gold hover:bg-gold-light/20 text-gold-dark"
            >
              View All Events >>
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-temple-brown">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-temple-brown">No events available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="card-hover border-gold-light/30 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gold-light/20 p-3 rounded-md">
                      <Calendar className="h-6 w-6 text-gold-dark" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl font-semibold text-gold-dark mb-2">
                        {event.eventname}
                      </h3>
                      <p className="text-sm font-medium text-temple-brown mb-1">
                        {event.event_date}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {event.event_temple}
                      </p>
                      <p className="text-sm">{event.discription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default EventsSection;
