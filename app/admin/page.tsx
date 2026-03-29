'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Music, Users, Settings, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalUsers: number;
  totalTracks: number;
  totalPlaylists: number;
  totalStreams: number;
  newUsersToday: number;
  newTracksToday: number;
}

const STATS: DashboardStats = {
  totalUsers: 45230,
  totalTracks: 12480,
  totalPlaylists: 8920,
  totalStreams: 2450000,
  newUsersToday: 342,
  newTracksToday: 28,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'requests'>('overview');

  const StatCard = ({ label, value, change }: { label: string; value: string; change: string }) => (
    <div className="bg-card rounded-lg p-6 border border-border">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-green-500">{change}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage Echo content and users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Refresh</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            View Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
          { id: 'content' as const, label: 'Content Management', icon: Music },
          { id: 'users' as const, label: 'Users', icon: Users },
          { id: 'requests' as const, label: 'Artist Requests', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={STATS.totalUsers.toLocaleString()} change={`+${STATS.newUsersToday} today`} />
            <StatCard label="Total Tracks" value={STATS.totalTracks.toLocaleString()} change={`+${STATS.newTracksToday} today`} />
            <StatCard label="Total Playlists" value={STATS.totalPlaylists.toLocaleString()} change="+2.5% this week" />
            <StatCard label="Total Streams" value={(STATS.totalStreams / 1000000).toFixed(1) + 'M'} change="+15% this month" />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Users</h3>
              <div className="space-y-3">
                {['alice.smith@example.com', 'bob.wilson@example.com', 'carol.jones@example.com'].map((email) => (
                  <div key={email} className="flex items-center justify-between p-2 hover:bg-secondary rounded transition">
                    <span className="text-sm text-foreground">{email}</span>
                    <span className="text-xs text-muted-foreground">Just now</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Tracks Added</h3>
              <div className="space-y-3">
                {['Midnight Dreams', 'Electric Pulse', 'Ethereal Wave'].map((track) => (
                  <div key={track} className="flex items-center justify-between p-2 hover:bg-secondary rounded transition">
                    <span className="text-sm text-foreground">{track}</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <Link href="/admin/content/tracks">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Music className="h-4 w-4 mr-2" />
                Manage Tracks
              </Button>
            </Link>
            <Link href="/admin/content/albums">
              <Button variant="outline">Manage Albums</Button>
            </Link>
            <Link href="/admin/content/artists">
              <Button variant="outline">Manage Artists</Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Content Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-secondary rounded">
                <span className="text-foreground">Total Artists</span>
                <span className="text-xl font-bold text-primary">2,840</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary rounded">
                <span className="text-foreground">Active Artists</span>
                <span className="text-xl font-bold text-primary">1,250</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary rounded">
                <span className="text-foreground">Pending Artist Requests</span>
                <span className="text-xl font-bold text-destructive">23</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <input
              type="search"
              placeholder="Search users..."
              className="flex-1 rounded-lg bg-secondary px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button variant="outline">Export</Button>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">User</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Joined</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Premium</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Alice Smith', email: 'alice@example.com', role: 'User', joined: '2024-01-15', premium: 'Yes' },
                  { name: 'Bob Wilson', email: 'bob@example.com', role: 'Artist', joined: '2024-01-10', premium: 'No' },
                  { name: 'Carol Jones', email: 'carol@example.com', role: 'User', joined: '2024-01-05', premium: 'Yes' },
                ].map((user) => (
                  <tr key={user.email} className="border-b border-border hover:bg-secondary transition">
                    <td className="px-6 py-3 text-foreground">{user.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'Artist' ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{user.joined}</td>
                    <td className="px-6 py-3">
                      <span className={user.premium === 'Yes' ? 'text-green-500' : 'text-muted-foreground'}>
                        {user.premium}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Artist Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
            <p className="text-sm text-yellow-200">23 pending artist requests await review</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 1, name: 'DJ ProBeats', genre: 'Electronic', followers: 2500, status: 'Pending' },
              { id: 2, name: 'Luna Acoustic', genre: 'Indie', followers: 1200, status: 'Pending' },
              { id: 3, name: 'The Rhythm Collective', genre: 'Hip-Hop', followers: 3400, status: 'Pending' },
            ].map((request) => (
              <div key={request.id} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{request.name}</h4>
                  <p className="text-xs text-muted-foreground">{request.genre} • {request.followers.toLocaleString()} followers</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                    Reject
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
