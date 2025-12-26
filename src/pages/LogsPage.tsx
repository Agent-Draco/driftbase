import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Calendar, Users, Sparkles } from "lucide-react";
import { mockLogs } from "@/data/mockData";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function LogsPage() {
  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Sleepover Logs"
        subtitle="Memories from past sleepovers"
        icon={<Moon className="h-6 w-6" />}
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {mockLogs.map((log) => (
            <Card key={log.id} className="overflow-hidden border-border shadow-sm">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-card-foreground">
                      {log.title}
                    </CardTitle>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(log.date, "MMMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {log.attendees.length} attendees
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Moon className="mr-1 h-3 w-3" />
                    Sleepover
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {/* Attendees */}
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      Who was there
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {log.attendees.map((attendee) => (
                        <Badge key={attendee} variant="outline">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      Highlights
                    </h4>
                    <ul className="space-y-1">
                      {log.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-card-foreground">
                          <span className="text-primary">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes */}
                  {log.notes && (
                    <div className="rounded-xl bg-accent/50 p-3">
                      <p className="text-sm italic text-muted-foreground">
                        "{log.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
