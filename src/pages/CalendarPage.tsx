import { PageHeader } from "@/components/layout/PageHeader";
import { EventCard } from "@/components/calendar/EventCard";
import { Calendar as CalendarIcon, Plus, Moon } from "lucide-react";
import { mockEvents } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { differenceInDays, isFuture } from "date-fns";

export default function CalendarPage() {
  const upcomingSleepovers = mockEvents.filter(
    (e) => e.type === "sleepover" && isFuture(e.date)
  );
  
  const nextSleepover = upcomingSleepovers.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )[0];

  const daysUntil = nextSleepover
    ? differenceInDays(nextSleepover.date, new Date())
    : null;

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Calendar"
        subtitle="Plan sleepovers and hangouts"
        icon={<CalendarIcon className="h-6 w-6" />}
        action={
          <Button className="rounded-full shadow-glow-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Countdown Section */}
          {nextSleepover && daysUntil !== null && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow-primary">
                    <Moon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Next Sleepover
                    </p>
                    <h2 className="text-xl font-bold text-foreground">
                      {nextSleepover.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {nextSleepover.location}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary animate-float">
                    {daysUntil}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    days to go!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
            <div className="space-y-3">
              {mockEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
