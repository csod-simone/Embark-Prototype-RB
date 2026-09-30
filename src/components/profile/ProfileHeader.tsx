import { Briefcase, MapPin, Clock, MoreHorizontal, Pencil } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            JD
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center">
            <Pencil size={12} className="text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
        <div>
          <h1
            className="text-2xl font-semibold text-foreground"
           
          >
            John Draper
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Executive Leadership, North America</p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5 flex-wrap">
            <Briefcase size={14} className="text-muted-foreground" aria-hidden="true" />
            <span>Product Manager</span>
            <span className="mx-1">•</span>
            <MapPin size={14} className="text-muted-foreground" aria-hidden="true" />
            <span>San Francisco, California</span>
            <span className="mx-1">•</span>
            <Clock size={14} className="text-muted-foreground" aria-hidden="true" />
            <span>Updated Nov 24, 2025</span>
          </div>
        </div>
      </div>
      <button
        aria-label="More options"
        className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground transition-colors"
      >
        <MoreHorizontal size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
