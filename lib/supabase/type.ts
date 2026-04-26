export type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, any>;
};

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
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          changes: string | null
          created_at: string
          id: string
          target_id: string
          target_name: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_id: string
          changes?: string | null
          created_at?: string
          id?: string
          target_id: string
          target_name?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string
          changes?: string | null
          created_at?: string
          id?: string
          target_id?: string
          target_name?: string | null
          target_type?: string
        }
        Relationships: []
      }
      album: {
        Row: {
          album_type: Database["public"]["Enums"]["AlbumType"] | null
          artist_id: string
          copyright: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          genre_id: string | null
          id: string
          is_explicit: boolean | null
          is_published: boolean
          language: string | null
          rating: number | null
          record_label: string | null
          release_date: string
          slug: string | null
          title: string
          title_search: string | null
          total_streams: number
          total_tracks: number
          upc: string | null
          updated_at: string
        }
        Insert: {
          album_type?: Database["public"]["Enums"]["AlbumType"] | null
          artist_id: string
          copyright?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          genre_id?: string | null
          id?: string
          is_explicit?: boolean | null
          is_published?: boolean
          language?: string | null
          rating?: number | null
          record_label?: string | null
          release_date?: string
          slug?: string | null
          title: string
          title_search?: string | null
          total_streams?: number
          total_tracks?: number
          upc?: string | null
          updated_at?: string
        }
        Update: {
          album_type?: Database["public"]["Enums"]["AlbumType"] | null
          artist_id?: string
          copyright?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          genre_id?: string | null
          id?: string
          is_explicit?: boolean | null
          is_published?: boolean
          language?: string | null
          rating?: number | null
          record_label?: string | null
          release_date?: string
          slug?: string | null
          title?: string
          title_search?: string | null
          total_streams?: number
          total_tracks?: number
          upc?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Album_artistId_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Album_genreId_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genre"
            referencedColumns: ["id"]
          },
        ]
      }
      album_like: {
        Row: {
          album_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          album_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          album_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "AlbumLike_albumId_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AlbumLike_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      artist: {
        Row: {
          banner_image: string | null
          bio: string | null
          created_at: string
          id: string
          is_verified: boolean
          profile_image: string | null
          social_links: Json | null
          stage_name: string | null
          total_albums: number
          total_followers: number
          total_streams: number
          total_tracks: number
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          banner_image?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          profile_image?: string | null
          social_links?: Json | null
          stage_name?: string | null
          total_albums?: number
          total_followers?: number
          total_streams?: number
          total_tracks?: number
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          banner_image?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          profile_image?: string | null
          social_links?: Json | null
          stage_name?: string | null
          total_albums?: number
          total_followers?: number
          total_streams?: number
          total_tracks?: number
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ArtistProfile_userId_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_request: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          reason: string | null
          review_comment: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          social_links: Json | null
          stage_name: string | null
          status: Database["public"]["Enums"]["ArtistRequestStatus"]
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          review_comment?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_links?: Json | null
          stage_name?: string | null
          status?: Database["public"]["Enums"]["ArtistRequestStatus"]
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          review_comment?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_links?: Json | null
          stage_name?: string | null
          status?: Database["public"]["Enums"]["ArtistRequestStatus"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ArtistRequest_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      comment: {
        Row: {
          content: string
          created_at: string
          id: string
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comment_trackId_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      content_report: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reason: string
          report_type: string
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          target_id: string
          target_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          report_type: string
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id: string
          target_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          report_type?: string
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id?: string
          target_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorite: {
        Row: {
          created_at: string
          id: string
          track_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          track_id: string
        }
        Update: {
          created_at?: string
          id?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Favorite_trackId_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
        ]
      }
      follow: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Follow_followerId_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Follow_followingId_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      genre: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string
          email_notifications: boolean
          follower_notifications: boolean
          id: string
          new_release_notifications: boolean
          push_notifications: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          follower_notifications?: boolean
          id?: string
          new_release_notifications?: boolean
          push_notifications?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          follower_notifications?: boolean
          id?: string
          new_release_notifications?: boolean
          push_notifications?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "NotificationSettings_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          total_streams: number
          total_tracks: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          total_streams?: number
          total_tracks?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          total_streams?: number
          total_tracks?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Playlist_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_collaborator: {
        Row: {
          added_at: string
          id: string
          playlist_id: string
          role: string
        }
        Insert: {
          added_at?: string
          id?: string
          playlist_id: string
          role?: string
        }
        Update: {
          added_at?: string
          id?: string
          playlist_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "PlaylistCollaborator_playlistId_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlist"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_item: {
        Row: {
          added_at: string
          id: string
          playlist_id: string
          position: number
          track_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          playlist_id: string
          position: number
          track_id: string
        }
        Update: {
          added_at?: string
          id?: string
          playlist_id?: string
          position?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "PlaylistItem_playlistId_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PlaylistItem_trackId_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
        ]
      }
      review: {
        Row: {
          album_id: string | null
          content: string
          created_at: string
          id: string
          rating: number
          track_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          album_id?: string | null
          content: string
          created_at?: string
          id?: string
          rating: number
          track_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          album_id?: string | null
          content?: string
          created_at?: string
          id?: string
          rating?: number
          track_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Review_albumId_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_trackId_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_history: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          progress: number | null
          streamed_at: string
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          progress?: number | null
          streamed_at?: string
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          progress?: number | null
          streamed_at?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "StreamHistory_trackId_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "StreamHistory_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      track: {
        Row: {
          album_id: string | null
          artist_id: string
          audio_url: string
          bitrate: number | null
          composer: string | null
          created_at: string
          disc_number: number | null
          duration: number
          file_size: number | null
          genre_id: string | null
          id: string
          image_url: string | null
          is_explicit: boolean
          is_published: boolean
          isrc: string | null
          language: string | null
          lyricist: string | null
          lyrics: string | null
          producer: string | null
          slug: string | null
          title: string
          title_search: string | null
          total_downloads: number
          total_streams: number
          track_number: number | null
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          artist_id: string
          audio_url: string
          bitrate?: number | null
          composer?: string | null
          created_at?: string
          disc_number?: number | null
          duration: number
          file_size?: number | null
          genre_id?: string | null
          id?: string
          image_url?: string | null
          is_explicit?: boolean
          is_published?: boolean
          isrc?: string | null
          language?: string | null
          lyricist?: string | null
          lyrics?: string | null
          producer?: string | null
          slug?: string | null
          title: string
          title_search?: string | null
          total_downloads?: number
          total_streams?: number
          track_number?: number | null
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          artist_id?: string
          audio_url?: string
          bitrate?: number | null
          composer?: string | null
          created_at?: string
          disc_number?: number | null
          duration?: number
          file_size?: number | null
          genre_id?: string | null
          id?: string
          image_url?: string | null
          is_explicit?: boolean
          is_published?: boolean
          isrc?: string | null
          language?: string | null
          lyricist?: string | null
          lyrics?: string | null
          producer?: string | null
          slug?: string | null
          title?: string
          title_search?: string | null
          total_downloads?: number
          total_streams?: number
          track_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Track_albumId_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Track_artistId_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Track_genreId_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genre"
            referencedColumns: ["id"]
          },
        ]
      }
      track_artists: {
        Row: {
          artist_id: string | null
          created_at: string | null
          id: string
          is_main: boolean | null
          track_id: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          is_main?: boolean | null
          track_id?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          is_main?: boolean | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_artists_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
        ]
      }
      track_like: {
        Row: {
          created_at: string
          id: string
          track_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          track_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          track_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TrackLike_trackId_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TrackLike_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      track_recommendation: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          related_track_id: string
          score: number
          track_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          related_track_id: string
          score?: number
          track_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          related_track_id?: string
          score?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "TrackRecommendation_relatedTrackId_fkey"
            columns: ["related_track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TrackRecommendation_trackId_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          email: string
          followers: number | null
          following: number | null
          full_name: string | null
          id: string
          is_premium: boolean
          last_login_at: string | null
          premium_expires_at: string | null
          role: Database["public"]["Enums"]["UserRole"]
          totalPlaylists: number | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email: string
          followers?: number | null
          following?: number | null
          full_name?: string | null
          id?: string
          is_premium?: boolean
          last_login_at?: string | null
          premium_expires_at?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          totalPlaylists?: number | null
          updated_at: string
          username: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          followers?: number | null
          following?: number | null
          full_name?: string | null
          id?: string
          is_premium?: boolean
          last_login_at?: string | null
          premium_expires_at?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          totalPlaylists?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_tracks: {
        Args: {
          artist_id_filter: string
          items_per_page?: number
          page_number?: number
          search_term: string
          status_filter?: boolean
        }
        Returns: {
          audio_url: string
          created_at: string
          duration: number
          genre_name: string
          id: string
          image_url: string
          is_published: boolean
          title: string
          total_count: number
        }[]
      }
    }
    Enums: {
      AlbumType: "SINGLE" | "EP" | "ALBUM" | "COMPILATION"
      ArtistRequestStatus: "PENDING" | "APPROVED" | "REJECTED"
      RepeatMode: "OFF" | "ALL" | "ONE"
      UserRole: "USER" | "ARTIST" | "ADMIN"
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
      AlbumType: ["SINGLE", "EP", "ALBUM", "COMPILATION"],
      ArtistRequestStatus: ["PENDING", "APPROVED", "REJECTED"],
      RepeatMode: ["OFF", "ALL", "ONE"],
      UserRole: ["USER", "ARTIST", "ADMIN"],
    },
  },
} as const
