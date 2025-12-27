import { PageHeader } from "@/components/layout/PageHeader";
import { EventCard } from "@/components/calendar/EventCard";
import { Calendar as CalendarIcon, Plus, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { differenceInDays, isFuture } from "date-fns";
import { useSleepovers } from "@/hooks/useSleepovers";

export default function CalendarPage() {
  const { sleepovers, loading } = useSleepovers();

  const upcomingSleepovers = sleepovers.filter(
    (s) => isFuture(new Date(s.event_date))
  );
  
  const nextSleepover = upcomingSleepovers.sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  )[0];

  const daysUntil = nextSleepover
    ? differenceInDays(new Date(nextSleepover.event_date), new Date())
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
          {nextSleepover && daysUntil !== null && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow-primary">
                    <Moon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Sleepover</p>
                    <h2 className="text-xl font-bold text-foreground">{nextSleepover.title}</h2>
                    <p className="text-sm text-muted-foreground">{nextSleepover.location}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary animate-float">{daysUntil}</div>
                  <p className="text-sm font-medium text-muted-foreground">days to go!</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
            <div className="space-y-3">
              {sleepovers.length === 0 ? (
                <p className="text-muted-foreground">No events scheduled yet.</p>
              ) : (
                sleepovers.map((sleepover) => (
                  <EventCard key={sleepover.id} event={{
                    id: sleepover.id,
                    title: sleepover.title,
                    date: new Date(sleepover.event_date),
                    type: 'sleepover',
                    attendees: [],
                    location: sleepover.location || undefined,
                  }} />
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}