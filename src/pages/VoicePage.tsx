import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Plus, Users, Volume2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockMembers } from "@/data/mockData";

const mockVoiceRooms = [
  {
    id: "1",
    name: "Chill Vibes",
    participants: [mockMembers[0], mockMembers[2]],
    isLive: true,
  },
  {
    id: "2",
    name: "Game Planning",
    participants: [],
    isLive: false,
  },
  {
    id: "3",
    name: "Study Room",
    participants: [mockMembers[1]],
    isLive: true,
  },
];

export default function VoicePage() {
  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Voice Rooms"
        subtitle="Drop in and chat with friends"
        icon={<Mic className="h-6 w-6" />}
        action={
          <Button className="rounded-full shadow-glow-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create Room
          </Button>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {mockVoiceRooms.map((room) => (
            <Card
              key={room.id}
              className="group cursor-pointer overflow-hidden border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${
                        room.isLive
                          ? "bg-primary text-primary-foreground animate-pulse-soft"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {room.isLive ? (
                        <Volume2 className="h-6 w-6" />
                      ) : (
                        <Mic className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-card-foreground">
                          {room.name}
                        </h3>
                        {room.isLive && (
                          <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
                            Live
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {room.participants.length} in room
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {room.participants.length > 0 && (
                      <div className="flex -space-x-2">
                        {room.participants.slice(0, 3).map((p) => (
                          <Avatar key={p.id} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className={`text-xs font-semibold ${p.color}`}>
                              {p.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}
                    <Button
                      variant={room.isLive ? "default" : "secondary"}
                      size="sm"
                      className="rounded-full"
                    >
                      {room.isLive ? "Join" : "Start"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
