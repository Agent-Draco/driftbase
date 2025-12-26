import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Calendar,
  Users,
  Moon,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { mockMembers, mockEvents, mockMessages } from "@/data/mockData";
import { differenceInDays, isFuture } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
  const nextSleepover = mockEvents
    .filter((e) => e.type === "sleepover" && isFuture(e.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  const daysUntil = nextSleepover
    ? differenceInDays(nextSleepover.date, new Date())
    : null;

  const onlineMembers = mockMembers.filter((m) => m.status === "online");

  return (
    <AppLayout>
      <div className="flex h-screen flex-col overflow-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-8 py-12">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-20 top-20 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-5xl">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow-primary">
                <span className="text-3xl font-bold text-primary-foreground">D</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Welcome to Driftaculars
                </h1>
                <p className="mt-1 text-lg text-muted-foreground">
                  Your crew's home base for planning epic sleepovers ✨
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Sleepover Countdown */}
              {nextSleepover && daysUntil !== null && (
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
                        <Moon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Next Sleepover</p>
                        <p className="text-2xl font-bold text-primary">
                          {daysUntil} days
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Online Members */}
              <Card className="border-[hsl(var(--tertiary))]/20 bg-[hsl(var(--tertiary))]/5 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--tertiary))] shadow-sm">
                      <Users className="h-6 w-6 text-[hsl(var(--tertiary-foreground))]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Online Now</p>
                      <p className="text-2xl font-bold text-[hsl(var(--tertiary))]">
                        {onlineMembers.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages Today */}
              <Card className="border-secondary/20 bg-secondary/5 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary shadow-sm">
                      <MessageCircle className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recent Messages</p>
                      <p className="text-2xl font-bold text-secondary">
                        {mockMessages.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="border-[hsl(var(--warning))]/20 bg-[hsl(var(--warning))]/5 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--warning))] shadow-sm">
                      <Calendar className="h-6 w-6 text-[hsl(var(--warning-foreground))]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming Events</p>
                      <p className="text-2xl font-bold text-[hsl(var(--warning))]">
                        {mockEvents.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="flex-1 p-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Chat */}
              <Link to="/chat" className="group">
                <Card className="h-full border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">Total Chat</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Join the conversation with everyone
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>

              {/* Calendar */}
              <Link to="/calendar" className="group">
                <Card className="h-full border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">Calendar</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Plan your next sleepover
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>

              {/* Members */}
              <Link to="/members" className="group">
                <Card className="h-full border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--tertiary))]/10 text-[hsl(var(--tertiary))] transition-transform group-hover:scale-110">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">Members</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        See who's in the crew
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>

              {/* Hall of Fame */}
              <Link to="/hall-of-fame" className="group">
                <Card className="h-full border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] transition-transform group-hover:scale-110">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">Hall of Fame</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Celebrate legendary moments
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>

              {/* Traditions */}
              <Link to="/traditions" className="group">
                <Card className="h-full border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">Traditions</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        What makes us unique
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>

              {/* Sleepover Logs */}
              <Link to="/logs" className="group">
                <Card className="h-full border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Moon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">Sleepover Logs</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Relive past memories
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Online Members */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Who's Online</h2>
              <div className="flex flex-wrap gap-3">
                {onlineMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-sm"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={`text-xs font-semibold ${member.color}`}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-card-foreground">
                      {member.name}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
