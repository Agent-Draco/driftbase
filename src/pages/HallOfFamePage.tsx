import { PageHeader } from "@/components/layout/PageHeader";
import { HallEntry } from "@/components/halls/HallEntry";
import { Trophy, Plus } from "lucide-react";
import { mockHallEntries } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function HallOfFamePage() {
  const fameEntries = mockHallEntries.filter((e) => e.type === "fame");

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Hall of Fame"
        subtitle="Celebrating legendary moments"
        icon={<Trophy className="h-6 w-6" />}
        action={
          <Button className="rounded-full bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90 shadow-glow-secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {fameEntries.map((entry) => (
            <HallEntry key={entry.id} entry={entry} />
          ))}
          {fameEntries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No fame entries yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start celebrating legendary moments!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
