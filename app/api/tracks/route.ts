import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, fetch from Supabase
const MOCK_TRACKS = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Synthwave Artists',
    album: 'Digital Nights',
    duration: 245,
    genre: 'Electronic',
    streams: 15234,
    likes: 342,
    imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd8d2c17?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Electric Pulse',
    artist: 'Future Beats',
    album: 'Neon Highway',
    duration: 198,
    genre: 'Electronic',
    streams: 8932,
    likes: 215,
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let tracks = MOCK_TRACKS;

    // Filter by search
    if (search) {
      const query = search.toLowerCase();
      tracks = tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query)
      );
    }

    // Filter by genre
    if (genre) {
      tracks = tracks.filter((t) => t.genre.toLowerCase() === genre.toLowerCase());
    }

    // Pagination
    const paginated = tracks.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      total: tracks.length,
      limit,
      offset,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.artist || !body.audioUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, save to Supabase
    const newTrack = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      streams: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newTrack, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create track' },
      { status: 500 }
    );
  }
}
