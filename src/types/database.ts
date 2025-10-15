// Minimal Supabase Database types to support current queries.
// Expand as the schema evolves.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bands: {
        Row: {
          id: string
          name: string
          slug: string | null
          featured: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          featured?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          featured?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      band_links: {
        Row: {
          id: string
          band_id: string | null
          label: string | null
          url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          band_id?: string | null
          label?: string | null
          url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          band_id?: string | null
          label?: string | null
          url?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'band_links_band_id_fkey'
            columns: ['band_id']
            referencedRelation: 'bands'
            referencedColumns: ['id']
          }
        ]
      }
      genres: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      band_genres: {
        Row: {
          id: string
          band_id: string | null
          genre_id: string | null
        }
        Insert: {
          id?: string
          band_id?: string | null
          genre_id?: string | null
        }
        Update: {
          id?: string
          band_id?: string | null
          genre_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'band_genres_band_id_fkey'
            columns: ['band_id']
            referencedRelation: 'bands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'band_genres_genre_id_fkey'
            columns: ['genre_id']
            referencedRelation: 'genres'
            referencedColumns: ['id']
          }
        ]
      }
      episodes: {
        Row: {
          id: string
          title: string | null
          date: string | null
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          date?: string | null
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          date?: string | null
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      episode_links: {
        Row: {
          id: string
          episode_id: string | null
          label: string | null
          url: string | null
        }
        Insert: {
          id?: string
          episode_id?: string | null
          label?: string | null
          url?: string | null
        }
        Update: {
          id?: string
          episode_id?: string | null
          label?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'episode_links_episode_id_fkey'
            columns: ['episode_id']
            referencedRelation: 'episodes'
            referencedColumns: ['id']
          }
        ]
      }
      venues: {
        Row: {
          id: string
          name: string
          city: string | null
          state: string | null
        }
        Insert: {
          id?: string
          name: string
          city?: string | null
          state?: string | null
        }
        Update: {
          id?: string
          name?: string
          city?: string | null
          state?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string | null
          venue_id: string | null
          start_time: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          venue_id?: string | null
          start_time?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          venue_id?: string | null
          start_time?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'events_venue_id_fkey'
            columns: ['venue_id']
            referencedRelation: 'venues'
            referencedColumns: ['id']
          }
        ]
      }
      event_bands: {
        Row: {
          id: string
          event_id: string | null
          band_id: string | null
          slot_order: number | null
          is_headliner: boolean | null
        }
        Insert: {
          id?: string
          event_id?: string | null
          band_id?: string | null
          slot_order?: number | null
          is_headliner?: boolean | null
        }
        Update: {
          id?: string
          event_id?: string | null
          band_id?: string | null
          slot_order?: number | null
          is_headliner?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'event_bands_event_id_fkey'
            columns: ['event_id']
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_bands_band_id_fkey'
            columns: ['band_id']
            referencedRelation: 'bands'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database['public']

export type TablesMap = PublicSchema['Tables']

export type Tables<
  TName extends keyof TablesMap
> = TablesMap[TName] extends { Row: infer R } ? R : never


