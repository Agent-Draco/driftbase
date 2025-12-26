import { PageHeader } from "@/components/layout/PageHeader";
import { MemberCard } from "@/components/members/MemberCard";
import { Users, Search } from "lucide-react";
import { mockMembers } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MembersPage() {
  const [search, setSearch] = useState("");

  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const onlineCount = mockMembers.filter((m) => m.status === "online").length;

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Members"
        subtitle={`${mockMembers.length} Driftaculars • ${onlineCount} online`}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
