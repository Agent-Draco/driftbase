export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_emails: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      hall_entries: {
        Row: {
          achievement_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          sleepover_id: string
          type: string
          winner_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          sleepover_id: string
          type: string
          winner_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          sleepover_id?: string
          type?: string
          winner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hall_entries_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_entries_sleepover_id_fkey"
            columns: ["sleepover_id"]
            isOneToOne: false
            referencedRelation: "sleepovers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_entries_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          steps: string[]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          steps?: string[]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          steps?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "processes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          status: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          created_at: string | null
          id: string
          sleepover_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          sleepover_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          sleepover_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_sleepover_id_fkey"
            columns: ["sleepover_id"]
            isOneToOne: false
            referencedRelation: "sleepovers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sleepover_logs: {
        Row: {
          created_at: string | null
          created_by: string | null
          highlights: string[] | null
          id: string
          notes: string | null
          sleepover_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          highlights?: string[] | null
          id?: string
          notes?: string | null
          sleepover_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          highlights?: string[] | null
          id?: string
          notes?: string | null
          sleepover_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sleepover_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sleepover_logs_sleepover_id_fkey"
            columns: ["sleepover_id"]
            isOneToOne: false
            referencedRelation: "sleepovers"
            referencedColumns: ["id"]
          },
        ]
      }
      sleepovers: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          location: string | null
          title: string
          year: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          title: string
          year?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          title?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sleepovers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      traditions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "traditions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_room_participants: {
        Row: {
          id: string
          is_muted: boolean | null
          joined_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "voice_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_room_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_rooms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_user: { Args: { user_email: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
