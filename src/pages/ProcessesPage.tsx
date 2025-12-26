import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Plus, ChevronRight } from "lucide-react";
import { mockProcesses } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProcessesPage() {
  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Processes"
        subtitle="How we do things around here"
        icon={<ListChecks className="h-6 w-6" />}
        action={
          <Button className="rounded-full shadow-glow-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Process
          </Button>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {mockProcesses.map((process) => (
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
                  Created by {process.createdBy}
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
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
