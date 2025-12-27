import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Plus, ChevronRight, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProcesses } from "@/hooks/useProcesses";
import { useToast } from "@/hooks/use-toast";

export default function ProcessesPage() {
  const { processes, loading, createProcess } = useProcesses();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [stepsText, setStepsText] = useState('');

  const handleAddProcess = async () => {
    if (!name.trim()) {
      toast({ title: 'Please enter a name', variant: 'destructive' });
      return;
    }

    const steps = stepsText.split('\n').filter(s => s.trim());
    if (steps.length === 0) {
      toast({ title: 'Please add at least one step', variant: 'destructive' });
      return;
    }

    const { error } = await createProcess(name, steps);

    if (error) {
      toast({ title: 'Failed to create process', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Process created!' });
      setIsAddOpen(false);
      setName('');
      setStepsText('');
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
        title="Processes"
        subtitle="How we do things around here"
        icon={<ListChecks className="h-6 w-6" />}
        action={
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-glow-primary">
                <Plus className="mr-2 h-4 w-4" />
                New Process
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Process</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sleepover Planning Process"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Steps (one per line)</Label>
                  <Textarea
                    value={stepsText}
                    onChange={(e) => setStepsText(e.target.value)}
                    placeholder="Propose a date in Total Chat&#10;Vote on the date&#10;Host confirms location"
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddProcess}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {processes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ListChecks className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No processes yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a process to document how things work!
              </p>
            </div>
          ) : (
            processes.map((process) => (
              <Card key={process.id} className="overflow-hidden border-border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-card-foreground">
                      {process.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {process.steps.length} steps
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created by {process.creator?.display_name || process.creator?.username || 'Unknown'}
                  </p>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {process.steps.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 rounded-lg bg-accent/30 p-3 transition-colors hover:bg-accent/50"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-card-foreground">{step}</span>
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
