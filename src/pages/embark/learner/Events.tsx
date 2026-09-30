import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { GlobalHeader } from "@/components/embark/GlobalHeader";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function Events() {
  const [registered, setRegistered] = useState(true);
  const [registering, setRegistering] = useState(false);

  const handleRegister = () => {
    setRegistering(true);
    setTimeout(() => {
      setRegistering(false);
      setRegistered(true);
    }, 600);
  };

  return (
    <>
      <GlobalHeader title="Live Events" />
      <div className="px-4 sm:px-6 py-6">
        <PageContainer as="div">
          <LeftBorderCard borderVariant="brand">
            <div className="space-y-5">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Investment Management intake workshop
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Monday, 20 July 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    9:00 AM – 10:30 AM
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    In-person · Rathbones Institute, London
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
                <p className="text-sm text-foreground">
                  Phoebe Kapoor hosts this intake workshop for new Investment Managers. The session
                  walks through IM Intake Pathway, how the later paths unlock, and what to prepare
                  before client meetings. Attendance is optional but strongly recommended for learners
                  on the Investment Manager Full Onboarding Journey.
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
                  Facilitator
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground text-xs font-medium inline-flex items-center justify-center">
                    PK
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">Phoebe Kapoor</span>
                    <span className="text-xs text-muted-foreground">
                      Manager, IM Intake Cohort A
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
                  What to bring
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                  <li>Access to your Embark learner dashboard</li>
                  <li>Any questions from your current module sessions</li>
                  <li>A notebook for the intake discussion</li>
                </ul>
              </div>

              <div className="border-t border-border" />

              <div className="flex flex-wrap items-center justify-between gap-3">
                {registered ? (
                  <span className="text-sm text-success-dark">
                    ✓ You're registered for this event.
                  </span>
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
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setRegistered(false)}
                    >
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
        </PageContainer>
      </div>
    </>
  );
}
