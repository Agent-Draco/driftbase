import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Calendar,
  Users,
  Moon,
  Trophy,
  Skull,
  ListChecks,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: MessageCircle, label: "Total Chat", path: "/chat", color: "text-primary" },
  { icon: Users, label: "Members", path: "/members", color: "text-[hsl(var(--tertiary))]" },
  { icon: Calendar, label: "Calendar", path: "/calendar", color: "text-secondary" },
  { icon: Moon, label: "Sleepover Logs", path: "/logs", color: "text-primary" },
  { icon: Trophy, label: "Hall of Fame", path: "/hall-of-fame", color: "text-[hsl(var(--warning))]" },
  { icon: Skull, label: "Hall of Shame", path: "/hall-of-shame", color: "text-destructive" },
  { icon: ListChecks, label: "Processes", path: "/processes", color: "text-[hsl(var(--tertiary))]" },
  { icon: Sparkles, label: "Traditions", path: "/traditions", color: "text-secondary" },
  { icon: Mic, label: "Voice Rooms", path: "/voice", color: "text-primary" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-full border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-out",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-glow-primary">
            <span className="text-xl font-bold text-primary-foreground">D</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-sidebar-foreground animate-slide-up">
              Driftaculars
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent shadow-sm"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? item.color : "text-sidebar-foreground"
                )}
              />
              {!collapsed && (
                <span
                  className={cn(
                    "font-medium transition-colors",
                    isActive ? "text-sidebar-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section - User */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <span className="text-sm font-semibold">?</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                Guest User
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Sign in to join
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
