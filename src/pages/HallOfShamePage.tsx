import { PageHeader } from "@/components/layout/PageHeader";
import { HallEntry } from "@/components/halls/HallEntry";
import { Skull, Plus } from "lucide-react";
import { mockHallEntries } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function HallOfShamePage() {
  const shameEntries = mockHallEntries.filter((e) => e.type === "shame");

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Hall of Shame"
        subtitle="Gloriously embarrassing moments"
        icon={<Skull className="h-6 w-6" />}
        action={
          <Button variant="destructive" className="rounded-full shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {shameEntries.map((entry) => (
            <HallEntry key={entry.id} entry={entry} />
          ))}
          {shameEntries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Skull className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No shame entries yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Everyone's been too well-behaved... for now!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
