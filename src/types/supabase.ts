
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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      artist_follows: {
        Row: {
          artist_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_follows_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bandcamp: string | null
          bio: string | null
          created_at: string
          facebook: string | null
          genre_tags: string[] | null
          hometown: string | null
          id: string
          instagram: string | null
          is_published: boolean
          last_active_at: string | null
          name: string
          org_id: string
          profile_views: number
          search_tsv: unknown | null
          slug: string
          soundcloud: string | null
          spotify: string | null
          twitter: string | null
          updated_at: string
          website: string | null
          youtube: string | null
        }
        Insert: {
          bandcamp?: string | null
          bio?: string | null
          created_at?: string
          facebook?: string | null
          genre_tags?: string[] | null
          hometown?: string | null
          id?: string
          instagram?: string | null
          is_published?: boolean
          last_active_at?: string | null
          name: string
          org_id: string
          profile_views?: number
          search_tsv?: unknown | null
          slug: string
          soundcloud?: string | null
          spotify?: string | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
          youtube?: string | null
        }
        Update: {
          bandcamp?: string | null
          bio?: string | null
          created_at?: string
          facebook?: string | null
          genre_tags?: string[] | null
          hometown?: string | null
          id?: string
          instagram?: string | null
          is_published?: boolean
          last_active_at?: string | null
          name?: string
          org_id?: string
          profile_views?: number
          search_tsv?: unknown | null
          slug?: string
          soundcloud?: string | null
          spotify?: string | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          bytes: number | null
          created_at: string
          created_by: string | null
          duration_sec: number | null
          height: number | null
          id: string
          kind: Database["public"]["Enums"]["asset_kind"]
          mime_type: string | null
          org_id: string
          storage_path: string
          title: string | null
          width: number | null
        }
        Insert: {
          bytes?: number | null
          created_at?: string
          created_by?: string | null
          duration_sec?: number | null
          height?: number | null
          id?: string
          kind: Database["public"]["Enums"]["asset_kind"]
          mime_type?: string | null
          org_id: string
          storage_path: string
          title?: string | null
          width?: number | null
        }
        Update: {
          bytes?: number | null
          created_at?: string
          created_by?: string | null
          duration_sec?: number | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["asset_kind"]
          mime_type?: string | null
          org_id?: string
          storage_path?: string
          title?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      band_genres: {
        Row: {
          band_id: string | null
          genre_id: string | null
          id: string
        }
        Insert: {
          band_id?: string | null
          genre_id?: string | null
          id?: string
        }
        Update: {
          band_id?: string | null
          genre_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "band_genres_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      band_links: {
        Row: {
          band_id: string | null
          created_at: string | null
          id: string
          label: string | null
          url: string | null
        }
        Insert: {
          band_id?: string | null
          created_at?: string | null
          id?: string
          label?: string | null
          url?: string | null
        }
        Update: {
          band_id?: string | null
          created_at?: string | null
          id?: string
          label?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "band_links_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      band_photos: {
        Row: {
          band_id: string
          caption: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          photo_order: number | null
          source: string | null
          source_attribution: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          band_id: string
          caption?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          photo_order?: number | null
          source?: string | null
          source_attribution?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          band_id?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          photo_order?: number | null
          source?: string | null
          source_attribution?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "band_photos_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      band_tracks: {
        Row: {
          band_id: string
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          file_size: number | null
          file_url: string
          id: string
          is_featured: boolean | null
          play_count: number | null
          title: string
          track_order: number | null
          track_type: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          band_id: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          file_url: string
          id?: string
          is_featured?: boolean | null
          play_count?: number | null
          title: string
          track_order?: number | null
          track_type?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          band_id?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_featured?: boolean | null
          play_count?: number | null
          title?: string
          track_order?: number | null
          track_type?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "band_tracks_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      bands: {
        Row: {
          bio: string | null
          claimed_at: string | null
          claimed_by: string | null
          created_at: string | null
          custom_html: string | null
          description: string | null
          featured: boolean | null
          hometown: string | null
          id: string
          image_url: string | null
          last_active_at: string | null
          name: string
          profile_views: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          custom_html?: string | null
          description?: string | null
          featured?: boolean | null
          hometown?: string | null
          id?: string
          image_url?: string | null
          last_active_at?: string | null
          name: string
          profile_views?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          custom_html?: string | null
          description?: string | null
          featured?: boolean | null
          hometown?: string | null
          id?: string
          image_url?: string | null
          last_active_at?: string | null
          name?: string
          profile_views?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      episode_links: {
        Row: {
          episode_id: string | null
          id: string
          label: string | null
          url: string | null
        }
        Insert: {
          episode_id?: string | null
          id?: string
          label?: string | null
          url?: string | null
        }
        Update: {
          episode_id?: string | null
          id?: string
          label?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episode_links_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      episode_tracks: {
        Row: {
          artist_name: string
          episode_id: string
          id: string
          position: number
          submission_id: string | null
          timestamp_sec: number | null
          track_title: string
        }
        Insert: {
          artist_name: string
          episode_id: string
          id?: string
          position?: number
          submission_id?: string | null
          timestamp_sec?: number | null
          track_title: string
        }
        Update: {
          artist_name?: string
          episode_id?: string
          id?: string
          position?: number
          submission_id?: string | null
          timestamp_sec?: number | null
          track_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "episode_tracks_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episode_tracks_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "music_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          aired_at: string | null
          created_at: string
          description: string | null
          duration_sec: number | null
          episode_number: number | null
          featured: boolean | null
          id: string
          is_published: boolean
          org_id: string
          radio_show_id: string | null
          slug: string
          title: string
          updated_at: string
          view_count: number
          youtube_url: string | null
          youtube_video_id: string | null
        }
        Insert: {
          aired_at?: string | null
          created_at?: string
          description?: string | null
          duration_sec?: number | null
          episode_number?: number | null
          featured?: boolean | null
          id?: string
          is_published?: boolean
          org_id: string
          radio_show_id?: string | null
          slug: string
          title: string
          updated_at?: string
          view_count?: number
          youtube_url?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          aired_at?: string | null
          created_at?: string
          description?: string | null
          duration_sec?: number | null
          episode_number?: number | null
          featured?: boolean | null
          id?: string
          is_published?: boolean
          org_id?: string
          radio_show_id?: string | null
          slug?: string
          title?: string
          updated_at?: string
          view_count?: number
          youtube_url?: string | null
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episodes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episodes_radio_show_id_fkey"
            columns: ["radio_show_id"]
            isOneToOne: false
            referencedRelation: "radio_shows"
            referencedColumns: ["id"]
          },
        ]
      }
      event_bands: {
        Row: {
          band_id: string | null
          event_id: string | null
          id: string
          is_headliner: boolean | null
          slot_order: number | null
        }
        Insert: {
          band_id?: string | null
          event_id?: string | null
          id?: string
          is_headliner?: boolean | null
          slot_order?: number | null
        }
        Update: {
          band_id?: string | null
          event_id?: string | null
          id?: string
          is_headliner?: boolean | null
          slot_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_bands_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bands_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string | null
          featured: boolean | null
          id: string
          name: string
          start_time: string | null
          ticket_url: string | null
          venue_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          featured?: boolean | null
          id?: string
          name: string
          start_time?: string | null
          ticket_url?: string | null
          venue_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          featured?: boolean | null
          id?: string
          name?: string
          start_time?: string | null
          ticket_url?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
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
      music_submissions: {
        Row: {
          album: string | null
          artist_id: string | null
          artist_name: string
          audio_asset_id: string | null
          created_at: string
          genre_tags: string[] | null
          id: string
          notes: string | null
          org_id: string
          played_on: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["submission_status"]
          submitted_by: string | null
          submitter_email: string | null
          track_title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          album?: string | null
          artist_id?: string | null
          artist_name: string
          audio_asset_id?: string | null
          created_at?: string
          genre_tags?: string[] | null
          id?: string
          notes?: string | null
          org_id: string
          played_on?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_by?: string | null
          submitter_email?: string | null
          track_title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          album?: string | null
          artist_id?: string | null
          artist_name?: string
          audio_asset_id?: string | null
          created_at?: string
          genre_tags?: string[] | null
          id?: string
          notes?: string | null
          org_id?: string
          played_on?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_by?: string | null
          submitter_email?: string | null
          track_title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "music_submissions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_submissions_audio_asset_id_fkey"
            columns: ["audio_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_submissions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: Database["public"]["Enums"]["role_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role?: Database["public"]["Enums"]["role_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["role_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      orgs: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          org_id: string
          tier: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          org_id: string
          tier?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          org_id?: string
          tier?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      radio_shows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          org_id: string
          schedule_text: string | null
          slug: string
          title: string
          youtube_channel_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          org_id: string
          schedule_text?: string | null
          slug: string
          title: string
          youtube_channel_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          org_id?: string
          schedule_text?: string | null
          slug?: string
          title?: string
          youtube_channel_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "radio_shows_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      show_interested: {
        Row: {
          created_at: string
          id: string
          show_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          show_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          show_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "show_interested_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      show_lineups: {
        Row: {
          artist_id: string | null
          artist_name: string
          billing_order: number
          id: string
          is_headliner: boolean | null
          show_id: string
        }
        Insert: {
          artist_id?: string | null
          artist_name: string
          billing_order?: number
          id?: string
          is_headliner?: boolean | null
          show_id: string
        }
        Update: {
          artist_id?: string | null
          artist_name?: string
          billing_order?: number
          id?: string
          is_headliner?: boolean | null
          show_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "show_lineups_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "show_lineups_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      shows: {
        Row: {
          age_restriction: string | null
          created_at: string
          description: string | null
          end_time: string | null
          facebook_event_url: string | null
          id: string
          is_published: boolean
          org_id: string
          slug: string
          start_time: string
          stream_url: string | null
          ticket_url: string | null
          title: string
          type: Database["public"]["Enums"]["show_type"]
          updated_at: string
          venue_id: string | null
          venue_name: string | null
        }
        Insert: {
          age_restriction?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          facebook_event_url?: string | null
          id?: string
          is_published?: boolean
          org_id: string
          slug: string
          start_time: string
          stream_url?: string | null
          ticket_url?: string | null
          title: string
          type?: Database["public"]["Enums"]["show_type"]
          updated_at?: string
          venue_id?: string | null
          venue_name?: string | null
        }
        Update: {
          age_restriction?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          facebook_event_url?: string | null
          id?: string
          is_published?: boolean
          org_id?: string
          slug?: string
          start_time?: string
          stream_url?: string | null
          ticket_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["show_type"]
          updated_at?: string
          venue_id?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shows_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shows_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          capacity: number | null
          city: string | null
          created_at: string
          id: string
          name: string
          org_id: string
          slug: string
          state: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
          org_id: string
          slug: string
          state?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          org_id?: string
          slug?: string
          state?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_submission: {
        Args: { p_link_artist_id?: string; p_submission_id: string }
        Returns: undefined
      }
      generate_slug: {
        Args: { name: string }
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_track_play_count: {
        Args: { track_id: string }
        Returns: undefined
      }
      is_org_member: {
        Args: { p_org: string }
        Returns: boolean
      }
      search_artists: {
        Args: { p_limit?: number; p_query: string }
        Returns: {
          bio: string
          genre_tags: string[]
          id: string
          name: string
          rank: number
          slug: string
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      submit_track: {
        Args: {
          p_artist_name: string
          p_audio_asset_id: string
          p_email: string
          p_genre_tags?: string[]
          p_notes?: string
          p_org_id: string
          p_track_title: string
        }
        Returns: string
      }
    }
    Enums: {
      asset_kind: "image" | "audio" | "video" | "document"
      role_type: "owner" | "admin" | "editor" | "member"
      show_type:
        | "concert"
        | "festival"
        | "open_mic"
        | "livestream"
        | "recording_session"
        | "community"
      submission_status:
        | "pending"
        | "approved"
        | "rejected"
        | "queued"
        | "played"
        | "archived"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      asset_kind: ["image", "audio", "video", "document"],
      role_type: ["owner", "admin", "editor", "member"],
      show_type: [
        "concert",
        "festival",
        "open_mic",
        "livestream",
        "recording_session",
        "community",
      ],
      submission_status: [
        "pending",
        "approved",
        "rejected",
        "queued",
        "played",
        "archived",
      ],
    },
  },
} as const
