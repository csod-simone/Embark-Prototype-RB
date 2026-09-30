import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

type UpskillerEvent = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  facilitator: string;
  facilitatorRole: string;
  initials: string;
  about: string;
  defaultRegistered: boolean;
};

const EVENTS: UpskillerEvent[] = [
  {
    id: "e1",
    title: "Objection Handling Live Workshop",
    type: "Workshop",
    date: "Thursday, 13 August 2026",
    time: "10:00 AM – 11:30 AM",
    duration: "90 min",
    location: "Virtual · Webinar link sent by email",
    facilitator: "Sarah Mitchell",
    facilitatorRole: "Senior Learning Facilitator",
    initials: "SM",
    about:
      "A live practice session building on Objection Handling Fundamentals. We work through real objection scenarios in small groups, then review recordings together with structured feedback.",
    defaultRegistered: true,
  },
  {
    id: "e2",
    title: "Medicare Advantage Product Clinic",
    type: "Live session",
    date: "Tuesday, 18 August 2026",
    time: "2:00 PM – 3:00 PM",
    duration: "60 min",
    location: "Virtual · Webinar link sent by email",
    facilitator: "Daniel Okoye",
    facilitatorRole: "Product Enablement Lead",
    initials: "DO",
    about:
      "An open clinic covering Medicare Advantage plan structures, costs and the plan-option questions customers ask most often. Bring questions from your product deep dive module.",
    defaultRegistered: false,
  },
  {
    id: "e3",
    title: "Compliance Boundaries Q&A Webinar",
    type: "Webinar",
    date: "Friday, 21 August 2026",
    time: "9:30 AM – 10:15 AM",
    duration: "45 min",
    location: "Virtual · Webinar link sent by email",
    facilitator: "Priya Nair",
    facilitatorRole: "Compliance Trainer",
    initials: "PN",
    about:
      "Where the regulated advice boundary sits in practice, with worked examples from recent customer interactions and time for questions.",
    defaultRegistered: false,
  },
];

function EventCard({ event }: { event: UpskillerEvent }) {
  const [registered, setRegistered] = useState(event.defaultRegistered);
  const [registering, setRegistering] = useState(false);

  const handleRegister = () => {
    setRegistering(true);
    setTimeout(() => {
      setRegistering(false);
      setRegistered(true);
    }, 600);
  };

  return (
    <LeftBorderCard borderVariant="brand">
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{event.title}</h2>
            <Badge variant="secondary" className="text-[11px]">
              {event.type}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {event.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {event.time} · {event.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-success-dark/15 text-success-dark px-2 py-0.5 text-xs font-semibold">
              {registered ? "Registered ✓" : "Not registered"}
            </span>
          </div>
        </div>

        <div className="border-t border-border" />

        <div>
          <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
            About this session
          </div>
          <p className="text-sm text-foreground">{event.about}</p>
        </div>

        <div>
          <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
            Facilitator
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground text-xs font-medium inline-flex items-center justify-center">
              {event.initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{event.facilitator}</span>
              <span className="text-xs text-muted-foreground">{event.facilitatorRole}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          {registered ? (
            <span className="text-sm text-success-dark">✓ You're registered for this event.</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              You haven't registered for this event.
            </span>
          )}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary">
              Add to calendar
            </Button>
            {registered ? (
              <Button size="sm" variant="secondary" onClick={() => setRegistered(false)}>
                Cancel registration
              </Button>
            ) : (
              <Button size="sm" onClick={handleRegister} disabled={registering}>
                {registering ? "Registering…" : "Register now →"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </LeftBorderCard>
  );
}

export default function UpskillerEvents() {
  return (
    <div className="px-4 sm:px-6 py-6">
      <PageContainer as="div" className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Live sessions and workshops relevant to your upskilling journey
        </p>
        {EVENTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">No upcoming events</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You have no live events scheduled at the moment. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {EVENTS.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}