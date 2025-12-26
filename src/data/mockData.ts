// Mock data for demonstration - will be replaced with real database

export const mockMembers = [
  {
    id: "1",
    name: "Alex Chen",
    initials: "AC",
    color: "bg-primary text-primary-foreground",
    status: "online" as const,
    bio: "Always ready for late-night movie marathons! 🎬",
    joinedDate: "Jan 2024",
  },
  {
    id: "2",
    name: "Sam Rivera",
    initials: "SR",
    color: "bg-secondary text-secondary-foreground",
    status: "online" as const,
    bio: "The snack master of every sleepover 🍿",
    joinedDate: "Jan 2024",
  },
  {
    id: "3",
    name: "Jordan Lee",
    initials: "JL",
    color: "bg-[hsl(var(--tertiary))] text-[hsl(var(--tertiary-foreground))]",
    status: "away" as const,
    bio: "Will beat you at any board game, guaranteed 🎲",
    joinedDate: "Feb 2024",
  },
  {
    id: "4",
    name: "Taylor Kim",
    initials: "TK",
    color: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]",
    status: "offline" as const,
    bio: "The official group photographer 📸",
    joinedDate: "Feb 2024",
  },
  {
    id: "5",
    name: "Casey Morgan",
    initials: "CM",
    color: "bg-destructive text-destructive-foreground",
    status: "online" as const,
    bio: "Chief pillow fight instigator 🛋️",
    joinedDate: "Mar 2024",
  },
];

export const mockMessages = [
  {
    id: "1",
    content: "Hey everyone! Who's excited for the sleepover this weekend? 🎉",
    sender: mockMembers[0],
    timestamp: new Date(Date.now() - 3600000 * 2),
    isOwn: false,
  },
  {
    id: "2",
    content: "Can't wait! I'm bringing the snacks this time 🍕",
    sender: mockMembers[1],
    timestamp: new Date(Date.now() - 3600000 * 1.5),
    isOwn: false,
  },
  {
    id: "3",
    content: "I've got a new board game we need to try!",
    sender: mockMembers[2],
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
  },
  {
    id: "4",
    content: "Perfect! I'll set up the photo booth corner again 📸",
    sender: mockMembers[3],
    timestamp: new Date(Date.now() - 1800000),
    isOwn: true,
  },
  {
    id: "5",
    content: "This is going to be EPIC! Everyone remember your permission forms!",
    sender: mockMembers[4],
    timestamp: new Date(Date.now() - 600000),
    isOwn: false,
  },
];

export const mockEvents = [
  {
    id: "1",
    title: "New Year's Eve Sleepover",
    date: new Date(2025, 0, 15),
    type: "sleepover" as const,
    attendees: ["Alex", "Sam", "Jordan", "Taylor", "Casey"],
    location: "Alex's House",
  },
  {
    id: "2",
    title: "Movie Night Marathon",
    date: new Date(2025, 0, 25),
    type: "hangout" as const,
    attendees: ["Alex", "Sam", "Casey"],
    location: "Sam's Place",
  },
  {
    id: "3",
    title: "Spring Break Sleepover",
    date: new Date(2025, 2, 15),
    type: "sleepover" as const,
    attendees: ["Alex", "Sam", "Jordan", "Taylor", "Casey"],
    location: "TBD",
  },
];

export const mockHallEntries = [
  {
    id: "1",
    title: "Epic Pillow Fort Builder",
    description: "Built a three-story pillow fort that lasted the entire night without collapsing!",
    type: "fame" as const,
    award: "Master Architect",
    winner: mockMembers[4],
    date: new Date(2024, 11, 15),
  },
  {
    id: "2",
    title: "Most Snacks Consumed",
    description: "Ate an entire family-size bag of chips in one sitting during movie night.",
    type: "shame" as const,
    award: "Snack Monster",
    winner: mockMembers[1],
    date: new Date(2024, 11, 20),
  },
  {
    id: "3",
    title: "Best Dance Moves",
    description: "Surprised everyone with incredible dance moves during the karaoke session!",
    type: "fame" as const,
    award: "Dance Champion",
    winner: mockMembers[2],
    date: new Date(2024, 11, 22),
  },
];

export const mockTraditions = [
  {
    id: "1",
    name: "Midnight Snack Run",
    description: "At exactly midnight, everyone raids the kitchen for snacks together.",
    createdBy: mockMembers[1].name,
    createdDate: new Date(2024, 5, 1),
  },
  {
    id: "2",
    name: "Movie Wheel",
    description: "Spin a wheel to pick the first movie of the night - no complaints allowed!",
    createdBy: mockMembers[0].name,
    createdDate: new Date(2024, 6, 15),
  },
  {
    id: "3",
    name: "Pillow Fight Championship",
    description: "Annual tournament to crown the ultimate pillow fight champion.",
    createdBy: mockMembers[4].name,
    createdDate: new Date(2024, 8, 1),
  },
];

export const mockProcesses = [
  {
    id: "1",
    name: "Sleepover Planning Process",
    steps: [
      "Propose a date in Total Chat",
      "Vote on the date (minimum 3 votes to proceed)",
      "Host confirms location",
      "Permission forms sent out",
      "Confirm attendance once forms are submitted",
    ],
    createdBy: mockMembers[0].name,
  },
  {
    id: "2",
    name: "Movie Selection Process",
    steps: [
      "Everyone suggests one movie",
      "Write all suggestions on the wheel",
      "Spin the wheel",
      "No complaints or vetoes allowed",
    ],
    createdBy: mockMembers[3].name,
  },
];

export const mockLogs = [
  {
    id: "1",
    title: "December Movie Marathon",
    date: new Date(2024, 11, 15),
    attendees: ["Alex", "Sam", "Jordan", "Taylor", "Casey"],
    highlights: [
      "Watched 4 movies back-to-back",
      "Jordan won the trivia game",
      "New record: Stayed up until 5 AM",
    ],
    notes: "Best sleepover yet! We need to do this more often.",
  },
  {
    id: "2",
    title: "Halloween Spooktacular",
    date: new Date(2024, 9, 31),
    attendees: ["Alex", "Sam", "Casey"],
    highlights: [
      "Epic costume contest",
      "Built a haunted pillow fort",
      "Watched scary movies all night",
    ],
    notes: "Sam's costume won but Casey's was the scariest!",
  },
];
