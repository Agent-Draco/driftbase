import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MessageCircle, Calendar, Users, Moon, Trophy, Skull, ListChecks, Sparkles, ChevronLeft, ChevronRight, Mic, Settings, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}
const navItems = [{
  icon: MessageCircle,
  label: "Total Chat",
  path: "/chat",
  color: "text-primary"
}, {
  icon: Mail,
  label: "Private Messages",
  path: "/messages",
  color: "text-secondary"
}, {
  icon: Users,
  label: "Members",
  path: "/members",
  color: "text-[hsl(var(--tertiary))]"
}, {
  icon: Calendar,
  label: "Calendar",
  path: "/calendar",
  color: "text-secondary"
}, {
  icon: Moon,
  label: "Sleepover Logs",
  path: "/logs",
  color: "text-primary"
}, {
  icon: Trophy,
  label: "Hall of Fame",
  path: "/hall-of-fame",
  color: "text-[hsl(var(--warning))]"
}, {
  icon: Skull,
  label: "Hall of Shame",
  path: "/hall-of-shame",
  color: "text-destructive"
}, {
  icon: ListChecks,
  label: "Processes",
  path: "/processes",
  color: "text-[hsl(var(--tertiary))]"
}, {
  icon: Sparkles,
  label: "Traditions",
  path: "/traditions",
  color: "text-secondary"
}, {
  icon: Mic,
  label: "Voice Rooms",
  path: "/voice",
  color: "text-primary"
}];
export function Sidebar({
  collapsed,
  onToggle
}: SidebarProps) {
  const location = useLocation();
  const {
    user,
    profile,
    signOut,
    updateProfile
  } = useAuth();
  const {
    toast
  } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  const handleSaveSettings = async () => {
    const {
      error
    } = await updateProfile({
      display_name: displayName,
      bio
    });
    if (error) {
      toast({
        title: 'Failed to update profile',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Profile updated!'
      });
      setSettingsOpen(false);
    }
  };
  const handleSignOut = async () => {
    await signOut();
  };
  return <>
      <aside className={cn("fixed left-0 top-0 z-40 h-full border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-out", collapsed ? "w-20" : "w-72")}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-glow-primary bg-sky-700 text-red-200">
              <span className="text-xl font-bold text-primary-foreground">D</span>
            </div>
            {!collapsed && <span className="text-xl font-bold text-sidebar-foreground animate-slide-up">
                Driftaculars
              </span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return <Link key={item.path} to={item.path} className={cn("group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200", isActive ? "bg-sidebar-accent shadow-sm" : "hover:bg-sidebar-accent/50")}>
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? item.color : "text-sidebar-foreground")} />
                {!collapsed && <span className={cn("font-medium transition-colors", isActive ? "text-sidebar-foreground" : "text-muted-foreground")}>
                    {item.label}
                  </span>}
              </Link>;
        })}
        </nav>

        {/* Bottom section - User */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl bg-sidebar-accent/50 px-3 py-3 hover:bg-sidebar-accent transition-colors">
                <Avatar className="h-9 w-9 shrink-0">
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.display_name || ''} />}
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
                    {getInitials(profile?.display_name || profile?.username)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && <div className="overflow-hidden text-left">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">
                      {profile?.display_name || profile?.username || 'User'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email || 'Signed in'}
                    </p>
                  </div>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => {
              setDisplayName(profile?.display_name || '');
              setBio(profile?.bio || '');
              setSettingsOpen(true);
            }}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your display name" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>;
}