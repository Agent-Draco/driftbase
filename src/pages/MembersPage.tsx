import { PageHeader } from "@/components/layout/PageHeader";
import { MemberCard } from "@/components/members/MemberCard";
import { Users, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfiles } from "@/hooks/useProfiles";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const { profiles, onlineProfiles, loading } = useProfiles();

  const filteredMembers = profiles.filter((profile) =>
    (profile.display_name || profile.username || '').toLowerCase().includes(search.toLowerCase())
  );

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
        title="Members"
        subtitle={`${profiles.length} Driftaculars • ${onlineProfiles.length} online`}
        icon={<Users className="h-6 w-6" />}
        action={
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="pl-9 rounded-full"
            />
          </div>
        }
      />

      <ScrollArea className="flex-1 p-6">
        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {profiles.length === 0 ? 'No members yet' : 'No members found'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {profiles.length === 0 ? 'Be the first to join!' : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((profile) => (
              <MemberCard 
                key={profile.id} 
                member={{
                  id: profile.id,
                  name: profile.display_name || profile.username || 'Unknown',
                  initials: (profile.display_name || profile.username || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                  color: 'bg-primary text-primary-foreground',
                  status: profile.status,
                  bio: profile.bio || '',
                  joinedDate: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                  avatar_url: profile.avatar_url || undefined,
                }}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
