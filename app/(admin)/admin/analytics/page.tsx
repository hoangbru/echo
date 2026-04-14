'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';

const streamingData = [
  { date: 'Jan 1', streams: 4200, users: 2400 },
  { date: 'Jan 8', streams: 3000, users: 2210 },
  { date: 'Jan 15', streams: 2000, users: 2290 },
  { date: 'Jan 22', streams: 2780, users: 2000 },
  { date: 'Jan 29', streams: 1890, users: 2181 },
  { date: 'Feb 5', streams: 2390, users: 2500 },
  { date: 'Feb 12', streams: 3490, users: 2100 },
];

const genreData = [
  { name: 'Electronic', value: 35 },
  { name: 'Indie', value: 25 },
  { name: 'Hip-Hop', value: 20 },
  { name: 'Pop', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981'];

const statsCards = [
  { label: 'Total Streams', value: '1.2M', change: '+12.5%' },
  { label: 'Active Users', value: '24.5K', change: '+8.2%' },
  { label: 'New Artists', value: '142', change: '+5.3%' },
  { label: 'Avg. Session', value: '23m 45s', change: '+2.1%' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform performance and user insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-green-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streams Over Time */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Streams Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={streamingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="streams"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Streams"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Genre Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Tracks */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top 5 Tracks</h2>
          <div className="space-y-3">
            {[
              { rank: 1, title: 'Midnight Dreams', artist: 'Synthwave Artists', streams: '125K' },
              { rank: 2, title: 'Electric Pulse', artist: 'Future Beats', streams: '98K' },
              { rank: 3, title: 'Urban Rhythm', artist: 'Urban Beats', streams: '87K' },
              { rank: 4, title: 'Cosmic Journey', artist: 'Ambient Visions', streams: '76K' },
              { rank: 5, title: 'Retro Vibes', artist: 'Nostalgia Band', streams: '65K' },
            ].map((track) => (
              <div key={track.rank} className="flex items-center justify-between p-3 bg-secondary rounded">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary w-6">{track.rank}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{track.title}</p>
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">{track.streams}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Artists */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top 5 Artists</h2>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Synthwave Artists', followers: '45.2K', growth: '+12%' },
              { rank: 2, name: 'Future Beats', followers: '38.9K', growth: '+8%' },
              { rank: 3, name: 'Urban Beats', followers: '32.1K', growth: '+15%' },
              { rank: 4, name: 'Ambient Visions', followers: '28.5K', growth: '+6%' },
              { rank: 5, name: 'Nostalgia Band', followers: '24.3K', growth: '+10%' },
            ].map((artist) => (
              <div key={artist.rank} className="flex items-center justify-between p-3 bg-secondary rounded">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary w-6">{artist.rank}</span>
                  <p className="text-sm font-medium text-foreground">{artist.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{artist.followers}</p>
                  <p className="text-xs text-green-500">{artist.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
