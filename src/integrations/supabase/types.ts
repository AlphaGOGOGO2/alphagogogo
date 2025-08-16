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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          token_hash: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: string | null
          token_hash: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          token_hash?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login_at: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_services: {
        Row: {
          benefits: Json
          created_at: string
          description: string
          display_name: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          url_pattern: string
        }
        Insert: {
          benefits?: Json
          created_at?: string
          description: string
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          url_pattern: string
        }
        Update: {
          benefits?: Json
          created_at?: string
          description?: string
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          url_pattern?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          blog_post_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          blog_post_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          blog_post_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_avatar: string
          author_name: string
          category: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string
          read_time: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_avatar?: string
          author_name?: string
          category: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string
          read_time?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_avatar?: string
          author_name?: string
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string
          read_time?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_messages: {
        Row: {
          color: string
          content: string
          created_at: string
          id: string
          nickname: string
        }
        Insert: {
          color: string
          content: string
          created_at?: string
          id: string
          nickname: string
        }
        Update: {
          color?: string
          content?: string
          created_at?: string
          id?: string
          nickname?: string
        }
        Relationships: []
      }
      invite_clicks: {
        Row: {
          clicked_at: string
          id: string
          invite_link_id: string
          ip_address: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          invite_link_id: string
          ip_address?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          invite_link_id?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_clicks_invite_link_id_fkey"
            columns: ["invite_link_id"]
            isOneToOne: false
            referencedRelation: "invite_links"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_links: {
        Row: {
          click_count: number
          created_at: string
          description: string | null
          id: string
          invite_url: string
          service_id: string | null
          service_name: string
          updated_at: string
          user_nickname: string
        }
        Insert: {
          click_count?: number
          created_at?: string
          description?: string | null
          id?: string
          invite_url: string
          service_id?: string | null
          service_name: string
          updated_at?: string
          user_nickname: string
        }
        Update: {
          click_count?: number
          created_at?: string
          description?: string | null
          id?: string
          invite_url?: string
          service_id?: string | null
          service_name?: string
          updated_at?: string
          user_nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_invite_links_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "ai_services"
            referencedColumns: ["id"]
          },
        ]
      }
      message_rate_limits: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          message_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: unknown
          message_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          message_count?: number
          window_start?: string
        }
        Relationships: []
      }
      resource_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      resource_downloads: {
        Row: {
          downloaded_at: string
          id: string
          ip_address: string | null
          resource_id: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          resource_id: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          resource_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_downloads_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          author_name: string
          category: string
          created_at: string
          description: string | null
          download_count: number
          file_size: number | null
          file_type: string
          file_url: string | null
          id: string
          is_featured: boolean
          tags: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          category: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_size?: number | null
          file_type?: string
          file_url?: string | null
          id?: string
          is_featured?: boolean
          tags?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_size?: number | null
          file_type?: string
          file_url?: string | null
          id?: string
          is_featured?: boolean
          tags?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          created_at: string
          event_description: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_description: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_description?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      visit_logs: {
        Row: {
          client_id: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          visit_date: string | null
          visited_at: string
        }
        Insert: {
          client_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          visit_date?: string | null
          visited_at?: string
        }
        Update: {
          client_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          visit_date?: string | null
          visited_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_download_count: {
        Args: { resource_id: string }
        Returns: undefined
      }
      increment_invite_click_count: {
        Args: { client_id?: string; link_id: string }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          event_description: string
          event_type: string
          ip_address?: string
          metadata?: Json
          user_agent?: string
        }
        Returns: undefined
      }
      validate_message_content: {
        Args: { content: string }
        Returns: boolean
      }
      validate_message_content_enhanced: {
        Args: { content: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "editor"
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
    Enums: {
      admin_role: ["super_admin", "admin", "editor"],
    },
  },
} as const
