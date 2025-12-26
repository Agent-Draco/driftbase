import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Plus, Heart, Calendar } from "lucide-react";
import { mockTraditions } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function TraditionsPage() {
  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Traditions"
        subtitle="The things that make us us"
        icon={<Sparkles className="h-6 w-6" />}
        action={
          <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow-secondary">
            <Plus className="mr-2 h-4 w-4" />
            New Tradition
          </Button>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {mockTraditions.map((tradition, idx) => (
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
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {tradition.description}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {tradition.createdBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(tradition.createdDate, "MMM yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
