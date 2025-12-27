import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Plus, Heart, Calendar, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTraditions } from "@/hooks/useTraditions";
import { useToast } from "@/hooks/use-toast";

export default function TraditionsPage() {
  const { traditions, loading, createTradition } = useTraditions();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTradition = async () => {
    if (!name.trim()) {
      toast({ title: 'Please enter a name', variant: 'destructive' });
      return;
    }

    const { error } = await createTradition(name, description);

    if (error) {
      toast({ title: 'Failed to create tradition', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Tradition created!' });
      setIsAddOpen(false);
      setName('');
      setDescription('');
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
        title="Traditions"
        subtitle="The things that make us us"
        icon={<Sparkles className="h-6 w-6" />}
        action={
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow-secondary">
                <Plus className="mr-2 h-4 w-4" />
                New Tradition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tradition</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Midnight Snack Run"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What makes this tradition special?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTradition}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          {traditions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Sparkles className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No traditions yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start a new tradition for your group!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {traditions.map((tradition, idx) => (
                <Card
                  key={tradition.id}
                  className="group overflow-hidden border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-secondary shadow-sm transition-transform group-hover:scale-110">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-card-foreground">
                          {tradition.name}
                        </h3>
                        {tradition.description && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {tradition.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {tradition.creator?.display_name || tradition.creator?.username || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(tradition.created_at), "MMM yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
