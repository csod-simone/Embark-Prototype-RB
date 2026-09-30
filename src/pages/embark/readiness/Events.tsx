import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

type ReadinessEvent = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  facilitator: string;
  facilitatorRole: string;
  about: string;
  defaultRegistered: boolean;
};

const EVENTS: ReadinessEvent[] = [
  {
    id: "e1",
    title: "Meridian Bank project kickoff",
    type: "Project meeting",
    date: "Monday, 21 September 2026",
    time: "09:30 – 10:30",
    duration: "60 min",
    location: "Virtual · Delivery bridge",
    facilitator: "Dana Whitfield",
    facilitatorRole: "Engineering Manager, Delivery",
    about:
      "Kickoff covering scope, workstreams and the first milestones. Attend as an observer and capture a short reflection afterwards.",
    defaultRegistered: true,
  },
  {
    id: "e2",
    title: "Migration cutover rehearsal walkthrough",
    type: "Workshop",
    date: "Wednesday, 23 September 2026",
    time: "14:00 – 15:00",
    duration: "60 min",
    location: "Virtual · Engineering room 2",
    facilitator: "Marcus Reid",
    facilitatorRole: "Implementation Lead",
    about:
      "Walkthrough of the rehearsal plan, reconciliation checkpoints and rollback triggers for the Meridian cutover.",
    defaultRegistered: false,
  },
  {
    id: "e3",
    title: "Client working session — platform team",
    type: "Client meeting",
    date: "Friday, 25 September 2026",
    time: "11:00 – 11:45",
    duration: "45 min",
    location: "Virtual · Client bridge",
    facilitator: "Elena Novak",
    facilitatorRole: "Account Executive",
    about:
      "Weekly working session with the Meridian platform team. Shadowing slot — observation only for your first attendance.",
    defaultRegistered: false,
  },
];

export default function ReadinessEvents() {
  const [registered, setRegistered] = useState<Record<string, boolean>>(
    Object.fromEntries(EVENTS.map((e) => [e.id, e.defaultRegistered])),
  );

  return (
    <div className="px-4 sm:px-6 py-6">
      <PageContainer as="div" className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Live Events</h1>
          <p className="text-sm text-muted-foreground">
            Sessions and meetings that count towards your project readiness.
          </p>
        </header>

        {EVENTS.map((e) => (
          <LeftBorderCard key={e.id} borderVariant={registered[e.id] ? "success" : "muted"}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{e.type}</Badge>
                  {registered[e.id] && <Badge variant="outline">Registered</Badge>}
                </div>
                <h2 className="text-sm font-semibold text-foreground">{e.title}</h2>
                <p className="text-sm text-muted-foreground">{e.about}</p>
                <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} aria-hidden="true" /> {e.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} aria-hidden="true" /> {e.time} · {e.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} aria-hidden="true" /> {e.location}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {e.facilitator} · {e.facilitatorRole}
                </p>
              </div>
              <Button
                size="sm"
                variant={registered[e.id] ? "outline" : "default"}
                onClick={() => setRegistered((p) => ({ ...p, [e.id]: !p[e.id] }))}
              >
                {registered[e.id] ? "Cancel registration" : "Register"}
              </Button>
            </div>
          </LeftBorderCard>
        ))}
      </PageContainer>
    </div>
  );
}
