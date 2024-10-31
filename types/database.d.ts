export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      error_feedback: {
        Row: {
          category: string | null;
          created_at: string | null;
          errormessage: string | null;
          errorstack: string | null;
          feedback: string;
          id: number;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          errormessage?: string | null;
          errorstack?: string | null;
          feedback: string;
          id?: number;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          errormessage?: string | null;
          errorstack?: string | null;
          feedback?: string;
          id?: number;
        };
        Relationships: [];
      };
      users: {
        Row: {
          email: string | null;
          full_name: string | null;
          id: string;
          username: string | null;
          subscription_tier: string | null; // Add this line
        };
        Insert: {
          email?: string | null;
          full_name?: string | null;
          id: string;
          username?: string | null;
          subscription_tier?: string | null; // Add this line
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          id?: string;
          username?: string | null;
          subscription_tier?: string | null; // Add this line
        };
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      projects: {
        Row: {
          id: number;
          created_at: string;
          project_name: string;
          user_id: string;
          project_stage: string;
          project_description: string | null; // Add this line
        };
        Insert: {
          id?: number;
          created_at?: string;
          project_name: string;
          user_id: string;
          project_stage?: string;
          project_description?: string | null; // Add this line
        };
        Update: {
          id?: number;
          created_at?: string;
          project_name?: string;
          user_id?: string;
          project_stage?: string;
          project_description?: string | null; // Add this line
        };
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      reports: {
        Row: {
          id: number;
          created_at: string;
          report_name: string;
          user_id: string;
          report_stage: string;
          report_description: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          report_name: string;
          user_id: string;
          report_stage?: string;
          report_description?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          report_name?: string;
          user_id?: string;
          report_stage?: string;
          report_description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      matches: {
        Row: {
          id: number;
          match_name: string;
          url: string | null;
          date: string | null;
          user_id: string;
        };
        Insert: {
          id?: number;
          match_name: string;
          url?: string | null;
          date?: string | null;
          user_id: string;
        };
        Update: {
          id?: number;
          match_name?: string;
          url?: string | null;
          date?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'matches_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      meals: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          calories: number | null;
          ingredients: Json | null; // Changed from string | null to Json | null
          prep_time: string | null;
          user_id: string;
          meal_type: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          calories?: number | null;
          ingredients?: Json | null; // Changed from string | null to Json | null
          prep_time?: string | null;
          user_id: string;
          meal_type: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          calories?: number | null;
          ingredients?: Json | null; // Changed from string | null to Json | null
          prep_time?: string | null;
          user_id?: string;
          meal_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'meals_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      chefs: {
        Row: {
          id: number;
          user_id: string;
          payment_links: string[] | null;
          // ... other existing fields ...
        };
        Insert: {
          id?: number;
          user_id: string;
          payment_links?: string[] | null;
          // ... other existing fields ...
        };
        Update: {
          id?: number;
          user_id?: string;
          payment_links?: string[] | null;
          // ... other existing fields ...
        };
        Relationships: [
          {
            foreignKeyName: 'chefs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
