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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      comm_audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          entity: string
          entity_key: string | null
          id: string
          ip: string | null
          new_value: Json | null
          previous_value: Json | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_key?: string | null
          id?: string
          ip?: string | null
          new_value?: Json | null
          previous_value?: Json | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_key?: string | null
          id?: string
          ip?: string | null
          new_value?: Json | null
          previous_value?: Json | null
        }
        Relationships: []
      }
      comm_departments: {
        Row: {
          backup_email: string | null
          created_at: string
          display_name: string
          email: string
          fallback_department: string | null
          id: string
          key: string
          name: string
          purpose: string | null
          reply_to: string | null
          sort_order: number
          status: string
          updated_at: string
          updated_by: string | null
          visibility: string
        }
        Insert: {
          backup_email?: string | null
          created_at?: string
          display_name?: string
          email: string
          fallback_department?: string | null
          id?: string
          key: string
          name: string
          purpose?: string | null
          reply_to?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: string
        }
        Update: {
          backup_email?: string | null
          created_at?: string
          display_name?: string
          email?: string
          fallback_department?: string | null
          id?: string
          key?: string
          name?: string
          purpose?: string | null
          reply_to?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: string
        }
        Relationships: []
      }
      comm_form_routes: {
        Row: {
          active: boolean
          auto_response_template: string | null
          confidential_routing: boolean
          created_at: string
          crm_category: string | null
          executive_cc: string | null
          form_key: string
          id: string
          label: string
          primary_department: string
          reference_prefix: string
          secondary_department: string | null
          send_auto_response: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active?: boolean
          auto_response_template?: string | null
          confidential_routing?: boolean
          created_at?: string
          crm_category?: string | null
          executive_cc?: string | null
          form_key: string
          id?: string
          label: string
          primary_department: string
          reference_prefix?: string
          secondary_department?: string | null
          send_auto_response?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active?: boolean
          auto_response_template?: string | null
          confidential_routing?: boolean
          created_at?: string
          crm_category?: string | null
          executive_cc?: string | null
          form_key?: string
          id?: string
          label?: string
          primary_department?: string
          reference_prefix?: string
          secondary_department?: string | null
          send_auto_response?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      comm_reference_counters: {
        Row: {
          counter: number
          prefix: string
          year: number
        }
        Insert: {
          counter?: number
          prefix: string
          year: number
        }
        Update: {
          counter?: number
          prefix?: string
          year?: number
        }
        Relationships: []
      }
      comm_routing_rules: {
        Row: {
          action: string
          active: boolean
          created_at: string
          field: string
          form_key: string | null
          id: string
          label: string
          operator: string
          priority: number
          target_department: string
          updated_at: string
          value: string
        }
        Insert: {
          action?: string
          active?: boolean
          created_at?: string
          field: string
          form_key?: string | null
          id?: string
          label: string
          operator?: string
          priority?: number
          target_department: string
          updated_at?: string
          value?: string
        }
        Update: {
          action?: string
          active?: boolean
          created_at?: string
          field?: string
          form_key?: string | null
          id?: string
          label?: string
          operator?: string
          priority?: number
          target_department?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      comm_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      comm_signatures: {
        Row: {
          active: boolean
          body: string
          created_at: string
          department_key: string
          id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body: string
          created_at?: string
          department_key: string
          id?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          department_key?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      comm_submissions: {
        Row: {
          assigned_to: string | null
          category: string | null
          confidential: boolean
          country: string | null
          created_at: string
          department: string | null
          email: string
          extra: Json
          form_key: string
          full_name: string
          id: string
          internal_notes: string | null
          locale: string
          message: string | null
          organization: string | null
          reference: string
          routed_to: string[]
          status: string
          telephone: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          confidential?: boolean
          country?: string | null
          created_at?: string
          department?: string | null
          email: string
          extra?: Json
          form_key: string
          full_name: string
          id?: string
          internal_notes?: string | null
          locale?: string
          message?: string | null
          organization?: string | null
          reference: string
          routed_to?: string[]
          status?: string
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          confidential?: boolean
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string
          extra?: Json
          form_key?: string
          full_name?: string
          id?: string
          internal_notes?: string | null
          locale?: string
          message?: string | null
          organization?: string | null
          reference?: string
          routed_to?: string[]
          status?: string
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      comm_templates: {
        Row: {
          active: boolean
          body: string
          created_at: string
          id: string
          key: string
          name: string
          signature_department: string | null
          subject: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active?: boolean
          body: string
          created_at?: string
          id?: string
          key: string
          name: string
          signature_department?: string | null
          subject: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          id?: string
          key?: string
          name?: string
          signature_department?: string | null
          subject?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      corporate_inquiries: {
        Row: {
          assigned_executive: string | null
          authorized: boolean
          automotive_details: Json | null
          company_type: string
          confidential: boolean
          contact_person: string
          contribution_range: string | null
          contribution_types: string[]
          country: string
          created_at: string
          documents: Json
          email: string
          follow_up_date: string | null
          id: string
          job_title: string | null
          lead_source: string
          locale: string
          manage_token: string
          meeting_request: Json | null
          nda_requested: boolean
          notes: string | null
          objectives: string[]
          objectives_note: string | null
          organization: string
          partnership_types: string[]
          preferred_contact: string | null
          priority: string
          property_details: Json | null
          reference: string
          status: Database["public"]["Enums"]["corp_status"]
          status_updated_at: string
          technology_details: Json | null
          telephone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          assigned_executive?: string | null
          authorized?: boolean
          automotive_details?: Json | null
          company_type: string
          confidential?: boolean
          contact_person: string
          contribution_range?: string | null
          contribution_types?: string[]
          country: string
          created_at?: string
          documents?: Json
          email: string
          follow_up_date?: string | null
          id?: string
          job_title?: string | null
          lead_source?: string
          locale?: string
          manage_token?: string
          meeting_request?: Json | null
          nda_requested?: boolean
          notes?: string | null
          objectives?: string[]
          objectives_note?: string | null
          organization: string
          partnership_types?: string[]
          preferred_contact?: string | null
          priority?: string
          property_details?: Json | null
          reference: string
          status?: Database["public"]["Enums"]["corp_status"]
          status_updated_at?: string
          technology_details?: Json | null
          telephone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          assigned_executive?: string | null
          authorized?: boolean
          automotive_details?: Json | null
          company_type?: string
          confidential?: boolean
          contact_person?: string
          contribution_range?: string | null
          contribution_types?: string[]
          country?: string
          created_at?: string
          documents?: Json
          email?: string
          follow_up_date?: string | null
          id?: string
          job_title?: string | null
          lead_source?: string
          locale?: string
          manage_token?: string
          meeting_request?: Json | null
          nda_requested?: boolean
          notes?: string | null
          objectives?: string[]
          objectives_note?: string | null
          organization?: string
          partnership_types?: string[]
          preferred_contact?: string | null
          priority?: string
          property_details?: Json | null
          reference?: string
          status?: Database["public"]["Enums"]["corp_status"]
          status_updated_at?: string
          technology_details?: Json | null
          telephone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      corporate_inquiry_events: {
        Row: {
          created_at: string
          id: string
          inquiry_id: string
          note: string | null
          status: Database["public"]["Enums"]["corp_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          inquiry_id: string
          note?: string | null
          status: Database["public"]["Enums"]["corp_status"]
        }
        Update: {
          created_at?: string
          id?: string
          inquiry_id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["corp_status"]
        }
        Relationships: [
          {
            foreignKeyName: "corporate_inquiry_events_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "corporate_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      email_outbox: {
        Row: {
          attempts: number
          body: string
          created_at: string
          department: string | null
          error: string | null
          form_key: string | null
          id: string
          kind: string
          reference: string | null
          related_id: string | null
          sent_at: string | null
          status: string
          subject: string
          to_email: string
        }
        Insert: {
          attempts?: number
          body: string
          created_at?: string
          department?: string | null
          error?: string | null
          form_key?: string | null
          id?: string
          kind: string
          reference?: string | null
          related_id?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          to_email: string
        }
        Update: {
          attempts?: number
          body?: string
          created_at?: string
          department?: string | null
          error?: string | null
          form_key?: string | null
          id?: string
          kind?: string
          reference?: string | null
          related_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
        }
        Relationships: []
      }
      films: {
        Row: {
          category: string
          countries: string
          created_at: string
          credits: string
          genre: string
          id: string
          logline: string
          poster_url: string | null
          published: boolean
          published_at: string | null
          release_note: string
          slug: string
          sort_order: number
          status: string
          stills: Json
          synopsis: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          countries?: string
          created_at?: string
          credits?: string
          genre?: string
          id?: string
          logline?: string
          poster_url?: string | null
          published?: boolean
          published_at?: string | null
          release_note?: string
          slug: string
          sort_order?: number
          status?: string
          stills?: Json
          synopsis?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          countries?: string
          created_at?: string
          credits?: string
          genre?: string
          id?: string
          logline?: string
          poster_url?: string | null
          published?: boolean
          published_at?: string | null
          release_note?: string
          slug?: string
          sort_order?: number
          status?: string
          stills?: Json
          synopsis?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_stage_events: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          note: string | null
          stage: Database["public"]["Enums"]["crm_stage"]
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          note?: string | null
          stage: Database["public"]["Enums"]["crm_stage"]
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          note?: string | null
          stage?: Database["public"]["Enums"]["crm_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "lead_stage_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "partner_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          confirmation_token: string
          confirmed_at: string | null
          consent_marketing: boolean
          consent_privacy: boolean
          created_at: string
          email: string
          full_name: string | null
          id: string
          interests: string[]
          locale: string
          manage_token: string
          status: Database["public"]["Enums"]["subscriber_status"]
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          confirmation_token?: string
          confirmed_at?: string | null
          consent_marketing?: boolean
          consent_privacy?: boolean
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          interests?: string[]
          locale?: string
          manage_token?: string
          status?: Database["public"]["Enums"]["subscriber_status"]
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          confirmation_token?: string
          confirmed_at?: string | null
          consent_marketing?: boolean
          consent_privacy?: boolean
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          interests?: string[]
          locale?: string
          manage_token?: string
          status?: Database["public"]["Enums"]["subscriber_status"]
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partner_leads: {
        Row: {
          attachment_name: string | null
          attachment_path: string | null
          budget_range: string | null
          consent_privacy: boolean
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          locale: string
          manage_token: string
          message: string | null
          notes: string | null
          organization: string | null
          project_type: string
          reference: string | null
          role: string
          source: string
          stage: Database["public"]["Enums"]["crm_stage"]
          stage_updated_at: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_path?: string | null
          budget_range?: string | null
          consent_privacy?: boolean
          country: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          locale?: string
          manage_token?: string
          message?: string | null
          notes?: string | null
          organization?: string | null
          project_type: string
          reference?: string | null
          role: string
          source?: string
          stage?: Database["public"]["Enums"]["crm_stage"]
          stage_updated_at?: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          attachment_name?: string | null
          attachment_path?: string | null
          budget_range?: string | null
          consent_privacy?: boolean
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          locale?: string
          manage_token?: string
          message?: string | null
          notes?: string | null
          organization?: string | null
          project_type?: string
          reference?: string | null
          role?: string
          source?: string
          stage?: Database["public"]["Enums"]["crm_stage"]
          stage_updated_at?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          group_key: string
          help: string | null
          is_public: boolean
          key: string
          kind: string
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          group_key?: string
          help?: string | null
          is_public?: boolean
          key: string
          kind?: string
          label: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          group_key?: string
          help?: string | null
          is_public?: boolean
          key?: string
          kind?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_comms_admin: { Args: { _user_id: string }; Returns: boolean }
      next_reference: { Args: { _prefix: string }; Returns: string }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "executive"
        | "partnerships"
        | "international"
        | "legal"
        | "finance"
        | "hr"
        | "casting"
        | "marketing"
      corp_status:
        | "new"
        | "reviewing"
        | "qualified"
        | "intro_meeting"
        | "nda"
        | "due_diligence"
        | "proposal"
        | "negotiation"
        | "agreement"
        | "active_partner"
        | "declined"
        | "closed"
      crm_stage:
        | "new"
        | "qualifying"
        | "discovery"
        | "proposal"
        | "negotiation"
        | "closed_won"
        | "closed_lost"
      subscriber_status: "pending" | "confirmed" | "unsubscribed"
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
      app_role: [
        "super_admin",
        "executive",
        "partnerships",
        "international",
        "legal",
        "finance",
        "hr",
        "casting",
        "marketing",
      ],
      corp_status: [
        "new",
        "reviewing",
        "qualified",
        "intro_meeting",
        "nda",
        "due_diligence",
        "proposal",
        "negotiation",
        "agreement",
        "active_partner",
        "declined",
        "closed",
      ],
      crm_stage: [
        "new",
        "qualifying",
        "discovery",
        "proposal",
        "negotiation",
        "closed_won",
        "closed_lost",
      ],
      subscriber_status: ["pending", "confirmed", "unsubscribed"],
    },
  },
} as const
