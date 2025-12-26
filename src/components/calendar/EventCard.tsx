import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Moon } from "lucide-react";
import { format, differenceInDays, isFuture } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: Date;
    endDate?: Date;
    type: "sleepover" | "hangout" | "other";
    attendees: string[];
    location?: string;
  };
  onClick?: () => void;
}

const typeConfig = {
  sleepover: { icon: Moon, color: "bg-primary text-primary-foreground", label: "Sleepover" },
  hangout: { icon: Users, color: "bg-secondary text-secondary-foreground", label: "Hangout" },
  other: { icon: Calendar, color: "bg-accent text-accent-foreground", label: "Event" },
};

export function EventCard({ event, onClick }: EventCardProps) {
  const config = typeConfig[event.type];
  const Icon = config.icon;
  const daysUntil = differenceInDays(event.date, new Date());
  const isUpcoming = isFuture(event.date);

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.color} shadow-sm`}>
            <Icon className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-card-foreground truncate">{event.title}</h3>
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(event.date, "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.attendees.length} attending
              </span>
            </div>

            {event.location && (
              <p className="mt-1 text-sm text-muted-foreground">📍 {event.location}</p>
            )}
          </div>

          {isUpcoming && event.type === "sleepover" && (
            <div className="flex flex-col items-center rounded-xl bg-primary/10 px-4 py-2">
              <span className="text-2xl font-bold text-primary">{daysUntil}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
