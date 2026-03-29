'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Music, Image as ImageIcon, Loader, Check, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: 'audio' | 'image';
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [trackTitle, setTrackTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        addFile(file, 'audio');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        addFile(file, 'image');
      }
    }
  };

  const addFile = (file: File, type: 'audio' | 'image') => {
    const newFile: UploadedFile = {
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type,
      status: 'uploading',
      progress: 0,
    };

    setFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 40;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev =>
          prev.map(f =>
            f.id === newFile.id
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        );
      } else {
        setFiles(prev =>
          prev.map(f =>
            f.id === newFile.id
              ? { ...f, progress }
              : f
          )
        );
      }
    }, 500);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handlePublish = () => {
    if (trackTitle && artistName) {
      // Handle publish logic
      alert(`Publishing track: "${trackTitle}" by "${artistName}"`);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Music</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload audio files and cover images for your tracks
        </p>
      </div>

      {/* Track Information */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Track Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Track Title
            </label>
            <Input
              placeholder="Enter track title"
              value={trackTitle}
              onChange={(e) => setTrackTitle(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Artist Name
            </label>
            <Input
              placeholder="Enter artist name"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </div>

      {/* File Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio Upload */}
        <div
          onClick={() => audioInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition cursor-pointer bg-secondary hover:bg-opacity-50"
        >
          <Music className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-semibold text-foreground mb-1">Upload Audio</h3>
          <p className="text-sm text-muted-foreground mb-4">
            MP3, WAV, FLAC (Max 500MB)
          </p>
          <Button size="sm" variant="outline">
            Choose File
          </Button>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="hidden"
          />
        </div>

        {/* Image Upload */}
        <div
          onClick={() => imageInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition cursor-pointer bg-secondary hover:bg-opacity-50"
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-semibold text-foreground mb-1">Upload Cover Image</h3>
          <p className="text-sm text-muted-foreground mb-4">
            JPG, PNG (Max 10MB)
          </p>
          <Button size="sm" variant="outline">
            Choose File
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Uploaded Files</h2>
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 bg-secondary p-4 rounded-lg"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-primary bg-opacity-20">
                  {file.type === 'audio' ? (
                    <Music className="h-4 w-4 text-primary" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground ml-2">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>

                <div className="w-6 flex items-center justify-center">
                  {file.status === 'uploading' && (
                    <Loader className="h-4 w-4 text-primary animate-spin" />
                  )}
                  {file.status === 'success' && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publish Button */}
      {files.length > 0 && (
        <div className="flex gap-4">
          <Button
            className="flex-1"
            onClick={handlePublish}
            disabled={!trackTitle || !artistName}
          >
            <Upload className="h-4 w-4 mr-2" />
            Publish Track
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setFiles([]);
              setTrackTitle('');
              setArtistName('');
            }}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
