interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null as T,
        error: data.error || `HTTP ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
    };
  }
}

// Tracks API
export const tracksApi = {
  // Get all tracks
  getAll: (params?: { search?: string; genre?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.genre) searchParams.set('genre', params.genre);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    
    const query = searchParams.toString();
    return apiCall(`/tracks${query ? `?${query}` : ''}`);
  },

  // Create a new track
  create: (track: any) =>
    apiCall('/tracks', {
      method: 'POST',
      body: JSON.stringify(track),
    }),

  // Get track by ID
  getById: (id: string) => apiCall(`/tracks/${id}`),

  // Update track
  update: (id: string, data: any) =>
    apiCall(`/tracks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete track
  delete: (id: string) =>
    apiCall(`/tracks/${id}`, {
      method: 'DELETE',
    }),
};

// Artists API
export const artistsApi = {
  // Get all artists
  getAll: (params?: { verified?: boolean; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.verified !== undefined) searchParams.set('verified', params.verified.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    
    const query = searchParams.toString();
    return apiCall(`/artists${query ? `?${query}` : ''}`);
  },

  // Get artist by ID
  getById: (id: string) => apiCall(`/artists/${id}`),

  // Get artist's tracks
  getTracks: (id: string) => apiCall(`/artists/${id}/tracks`),

  // Get artist's albums
  getAlbums: (id: string) => apiCall(`/artists/${id}/albums`),
};

// Playlists API
export const playlistsApi = {
  // Get user's playlists
  getUserPlaylists: (userId: string) =>
    apiCall(`/users/${userId}/playlists`),

  // Create playlist
  create: (playlist: any) =>
    apiCall('/playlists', {
      method: 'POST',
      body: JSON.stringify(playlist),
    }),

  // Get playlist by ID
  getById: (id: string) => apiCall(`/playlists/${id}`),

  // Add track to playlist
  addTrack: (playlistId: string, trackId: string) =>
    apiCall(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ trackId }),
    }),

  // Remove track from playlist
  removeTrack: (playlistId: string, trackId: string) =>
    apiCall(`/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE',
    }),

  // Delete playlist
  delete: (id: string) =>
    apiCall(`/playlists/${id}`, {
      method: 'DELETE',
    }),
};

// User API
export const userApi = {
  // Get current user
  getCurrent: () => apiCall('/user'),

  // Update profile
  updateProfile: (data: any) =>
    apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Get user stats
  getStats: (userId: string) =>
    apiCall(`/users/${userId}/stats`),
};

// Search API
export const searchApi = {
  // Global search
  search: (query: string, types?: string[]) => {
    const searchParams = new URLSearchParams();
    searchParams.set('q', query);
    if (types?.length) searchParams.set('types', types.join(','));
    
    return apiCall(`/search?${searchParams.toString()}`);
  },

  // Search tracks
  tracks: (query: string) =>
    apiCall(`/search/tracks?q=${encodeURIComponent(query)}`),

  // Search artists
  artists: (query: string) =>
    apiCall(`/search/artists?q=${encodeURIComponent(query)}`),

  // Search albums
  albums: (query: string) =>
    apiCall(`/search/albums?q=${encodeURIComponent(query)}`),
};

// Admin API
export const adminApi = {
  // Get dashboard stats
  getStats: () => apiCall('/admin/stats'),

  // Get analytics
  getAnalytics: (params?: { startDate?: string; endDate?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    
    const query = searchParams.toString();
    return apiCall(`/admin/analytics${query ? `?${query}` : ''}`);
  },

  // Upload file
  uploadFile: (formData: FormData) =>
    apiCall('/admin/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    }),

  // Get artist requests
  getArtistRequests: () =>
    apiCall('/admin/artist-requests'),

  // Approve artist request
  approveArtistRequest: (requestId: string) =>
    apiCall(`/admin/artist-requests/${requestId}/approve`, {
      method: 'POST',
    }),

  // Reject artist request
  rejectArtistRequest: (requestId: string) =>
    apiCall(`/admin/artist-requests/${requestId}/reject`, {
      method: 'POST',
    }),
};

export default {
  tracksApi,
  artistsApi,
  playlistsApi,
  userApi,
  searchApi,
  adminApi,
};
