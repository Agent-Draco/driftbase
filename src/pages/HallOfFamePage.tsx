import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Plus, ChevronDown, ChevronRight, Loader2, Folder, FolderOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHallEntries } from "@/hooks/useHallEntries";
import { useSleepovers } from "@/hooks/useSleepovers";
import { useProfiles } from "@/hooks/useProfiles";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function HallOfFamePage() {
  const { entries, entriesByYear, achievements, loading, createAchievement, createEntry } = useHallEntries('fame');
  const { sleepovers } = useSleepovers();
  const { profiles } = useProfiles();
  const { toast } = useToast();
  
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());
  const [expandedSleepovers, setExpandedSleepovers] = useState<Set<string>>(new Set());
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isAddAchievementOpen, setIsAddAchievementOpen] = useState(false);
  
  // Form states
  const [selectedSleepover, setSelectedSleepover] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState('');
  const [selectedWinner, setSelectedWinner] = useState('');
  const [entryDescription, setEntryDescription] = useState('');
  const [newAchievementName, setNewAchievementName] = useState('');
  const [newAchievementDesc, setNewAchievementDesc] = useState('');
  const [newAchievementIcon, setNewAchievementIcon] = useState('🏆');

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const toggleSleepover = (id: string) => {
    const newExpanded = new Set(expandedSleepovers);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSleepovers(newExpanded);
  };

  const handleAddEntry = async () => {
    if (!selectedSleepover || !selectedAchievement || !selectedWinner) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const { error } = await createEntry({
      sleepover_id: selectedSleepover,
      achievement_id: selectedAchievement,
      winner_id: selectedWinner,
      description: entryDescription || undefined,
    });

    if (error) {
      toast({ title: 'Failed to add entry', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Entry added!' });
      setIsAddEntryOpen(false);
      setSelectedSleepover('');
      setSelectedAchievement('');
      setSelectedWinner('');
      setEntryDescription('');
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievementName.trim()) {
      toast({ title: 'Please enter an achievement name', variant: 'destructive' });
      return;
    }

    const { error } = await createAchievement({
      name: newAchievementName,
      description: newAchievementDesc || null,
      icon: newAchievementIcon,
      type: 'fame',
    });

    if (error) {
      toast({ title: 'Failed to create achievement', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Achievement created!' });
      setIsAddAchievementOpen(false);
      setNewAchievementName('');
      setNewAchievementDesc('');
      setNewAchievementIcon('🏆');
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const years = Object.keys(entriesByYear).map(Number).sort((a, b) => b - a);

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
        title="Hall of Fame"
        subtitle="Celebrating legendary moments"
        icon={<Trophy className="h-6 w-6" />}
        action={
          <div className="flex gap-2">
            <Dialog open={isAddAchievementOpen} onOpenChange={setIsAddAchievementOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <Plus className="mr-2 h-4 w-4" />
                  New Achievement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Achievement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Input
                      value={newAchievementIcon}
                      onChange={(e) => setNewAchievementIcon(e.target.value)}
                      placeholder="🏆"
                      className="w-20 text-center text-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newAchievementName}
                      onChange={(e) => setNewAchievementName(e.target.value)}
                      placeholder="Best Pillow Fort Builder"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newAchievementDesc}
                      onChange={(e) => setNewAchievementDesc(e.target.value)}
                      placeholder="For the most creative pillow fort construction"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddAchievement}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90 shadow-glow-secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Hall of Fame Entry</DialogTitle>
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
                    <Label>Achievement</Label>
                    <Select value={selectedAchievement} onValueChange={setSelectedAchievement}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select achievement" />
                      </SelectTrigger>
                      <SelectContent>
                        {achievements.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.icon} {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Winner</Label>
                    <Select value={selectedWinner} onValueChange={setSelectedWinner}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select winner" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.display_name || p.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={entryDescription}
                      onChange={(e) => setEntryDescription(e.target.value)}
                      placeholder="What made this legendary?"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEntry}>Add Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {entries.length === 0 && sleepovers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No fame entries yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a sleepover first, then start celebrating legendary moments!
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No fame entries yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start celebrating legendary moments! Create achievements first, then add entries.
              </p>
            </div>
          ) : (
            years.map((year) => (
              <Collapsible key={year} open={expandedYears.has(year)} onOpenChange={() => toggleYear(year)}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {expandedYears.has(year) ? (
                            <FolderOpen className="h-5 w-5 text-[hsl(var(--warning))]" />
                          ) : (
                            <Folder className="h-5 w-5 text-[hsl(var(--warning))]" />
                          )}
                          <CardTitle className="text-lg">{year}</CardTitle>
                          <Badge variant="secondary">
                            {Object.keys(entriesByYear[year]).length} sleepovers
                          </Badge>
                        </div>
                        {expandedYears.has(year) ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 space-y-3 mt-3">
                  {Object.entries(entriesByYear[year]).map(([sleepoverId, { sleepover, entries: sleepoverEntries }]) => (
                    <Collapsible 
                      key={sleepoverId} 
                      open={expandedSleepovers.has(sleepoverId)} 
                      onOpenChange={() => toggleSleepover(sleepoverId)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="py-3 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {expandedSleepovers.has(sleepoverId) ? (
                                  <FolderOpen className="h-4 w-4 text-primary" />
                                ) : (
                                  <Folder className="h-4 w-4 text-primary" />
                                )}
                                <span className="font-medium">{sleepover?.title || 'Unknown Sleepover'}</span>
                                <Badge variant="outline" className="text-xs">
                                  {sleepoverEntries.length} entries
                                </Badge>
                              </div>
                              {expandedSleepovers.has(sleepoverId) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 space-y-2 mt-2">
                        {sleepoverEntries.map((entry) => (
                          <Card key={entry.id} className="border-[hsl(var(--warning))]/20 bg-[hsl(var(--warning))]/5">
                            <CardContent className="py-3 px-4">
                              <div className="flex items-center gap-4">
                                <span className="text-2xl">{entry.achievements?.icon || '🏆'}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{entry.achievements?.name || 'Achievement'}</span>
                                  </div>
                                  {entry.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    {entry.winner?.avatar_url ? (
                                      <AvatarImage src={entry.winner.avatar_url} />
                                    ) : null}
                                    <AvatarFallback className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] text-xs">
                                      {getInitials(entry.winner?.display_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{entry.winner?.display_name || 'Unknown'}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
