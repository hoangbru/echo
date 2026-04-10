'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import Image from 'next/image';

interface ArtistRequest {
  id: string;
  name: string;
  email: string;
  genre: string;
  bio: string;
  image?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Mock data
const MOCK_REQUESTS: ArtistRequest[] = [
  {
    id: '1',
    name: 'New Artist Name',
    email: 'newartist@example.com',
    genre: 'Indie Pop',
    bio: 'Fresh artist looking to share music on Echo',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    requestDate: '2024-02-15',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Experimental Sound',
    email: 'exp.sound@example.com',
    genre: 'Experimental',
    bio: 'Pushing the boundaries of sound and music',
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
    requestDate: '2024-02-10',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Jazz Collective',
    email: 'jazz@example.com',
    genre: 'Jazz',
    bio: 'Modern jazz ensemble from New York',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=crop',
    requestDate: '2024-02-05',
    status: 'pending',
  },
];

export default function ArtistRequestsPage() {
  const [requests, setRequests] = useState<ArtistRequest[]>(MOCK_REQUESTS);

  const approveRequest = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'approved' } : r
    ));
  };

  const rejectRequest = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'rejected' } : r
    ));
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Artist Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pending requests: {pendingRequests.length}
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-card rounded-lg border border-border p-6 hover:border-primary transition">
            <div className="flex items-start gap-6">
              {request.image && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={request.image}
                    alt={request.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{request.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {request.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Requested: {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                    {request.status !== 'pending' && (
                      <div className="flex items-center gap-1 mt-2">
                        {request.status === 'approved' ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-500">Approved</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-500">Rejected</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-foreground mb-1">
                    <span className="font-medium">Genre:</span> {request.genre}
                  </p>
                  <p className="text-sm text-muted-foreground">{request.bio}</p>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectRequest(request.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
