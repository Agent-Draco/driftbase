import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Calendar, Users, Sparkles, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLogs } from "@/hooks/useLogs";
import { useSleepovers } from "@/hooks/useSleepovers";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";

export default function LogsPage() {
  const { logs, loading, createLog } = useLogs();
  const { sleepovers } = useSleepovers();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSleepover, setSelectedSleepover] = useState('');
  const [notes, setNotes] = useState('');
  const [highlightsText, setHighlightsText] = useState('');

  const handleAddLog = async () => {
    if (!selectedSleepover) {
      toast({ title: 'Please select a sleepover', variant: 'destructive' });
      return;
    }

    const highlights = highlightsText.split('\n').filter(h => h.trim());
    const { error } = await createLog(selectedSleepover, notes, highlights);

    if (error) {
      toast({ title: 'Failed to create log', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Log created!' });
      setIsAddOpen(false);
      setSelectedSleepover('');
      setNotes('');
      setHighlightsText('');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Sleepover Logs"
        subtitle="Memories from past sleepovers"
        icon={<Moon className="h-6 w-6" />}
        action={
          isAdmin ? (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-glow-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Log
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Sleepover Log</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Sleepover</Label>
                    <Select value={selectedSleepover} onValueChange={setSelectedSleepover}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sleepover" />
                      </SelectTrigger>
                      <SelectContent>
                        {sleepovers.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.title} ({new Date(s.event_date).toLocaleDateString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Highlights (one per line)</Label>
                    <Textarea
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                      placeholder="Watched 4 movies&#10;Epic pillow fight&#10;Stayed up until 5 AM"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional notes..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddLog}>Add Log</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Moon className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No logs yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isAdmin ? 'Create your first sleepover log!' : 'No sleepover logs have been created yet.'}
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="overflow-hidden border-border shadow-sm">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-card-foreground">
                        {log.sleepover?.title || 'Sleepover Log'}
                      </CardTitle>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {log.sleepover?.event_date ? format(new Date(log.sleepover.event_date), "MMMM d, yyyy") : 'Unknown date'}
                        </span>
                        {log.sleepover?.location && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {log.sleepover.location}
                          </span>
                        )}
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
                    {/* Highlights */}
                    {log.highlights && log.highlights.length > 0 && (
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
                    )}

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
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
