// components/gallery/data.ts
export type MediaCategory = 'school' | 'mentor' | 'topic';

export interface MediaItem {
  id: number;
  title: string;
  category: MediaCategory;
  tags: string[];
  createdAt: string;
}

export interface ImageItem extends MediaItem {
  img: string;
}

export interface VideoItem extends MediaItem {
  youtubeId: string;
}

export type FilterState = {
  category: MediaCategory | null;
  tags: string[];
  search: string;
  time: 'newest' | 'oldest';
  sort: 'asc' | 'desc';
};

export const ALL_TAGS = [
  'anime', 'believer', 'inspiration', 'peace', 'motivation', 'training', 'intro'
] as const;

export const CATEGORIES: MediaCategory[] = ['school', 'mentor', 'topic'];

// Dummy images data
export const IMAGES: ImageItem[] = [
  {
    id: 1,
    title: "Anime Spirit Glow",
    category: "mentor",
    tags: ["anime", "motivation"],
    img: "https://picsum.photos/seed/anime1/600/600",
    createdAt: "2024-05-02T10:30:00Z"
  },
  {
    id: 2,
    title: "Faith Light Horizon",
    category: "school",
    tags: ["believer", "peace"],
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=600&fit=crop",
    createdAt: "2024-06-10T14:00:00Z"
  },
  {
    id: 3,
    title: "Cyber Anime Street",
    category: "topic",
    tags: ["anime", "inspiration"],
    img: "https://picsum.photos/seed/cyberanime/600/600",
    createdAt: "2024-03-22T18:45:00Z"
  },
  {
    id: 4,
    title: "Divine Connection",
    category: "school",
    tags: ["believer", "peace"],
    img: "https://picsum.photos/seed/divine/600/600",
    createdAt: "2024-04-15T09:20:00Z"
  },
  {
    id: 5,
    title: "Neon Samurai",
    category: "mentor",
    tags: ["anime", "training"],
    img: "https://picsum.photos/seed/neonsamurai/600/600",
    createdAt: "2024-02-28T16:30:00Z"
  },
  {
    id: 6,
    title: "Hope Rising",
    category: "topic",
    tags: ["inspiration", "motivation"],
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop",
    createdAt: "2024-01-10T11:15:00Z"
  }
];

// Dummy videos data
export const VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "Training Series Intro",
    youtubeId: "dQw4w9WgXcQ",
    category: "topic",
    tags: ["training", "intro"],
    createdAt: "2024-05-01T13:20:00Z"
  },
  {
    id: 2,
    title: "Anime Motivation Clip",
    youtubeId: "1xVw6PsSinI",
    category: "mentor",
    tags: ["anime", "inspiration"],
    createdAt: "2024-03-11T08:50:00Z"
  },
  {
    id: 3,
    title: "Faith Documentary Teaser",
    youtubeId: "Sagg08DrO5U",
    category: "school",
    tags: ["believer", "peace"],
    createdAt: "2024-04-05T20:15:00Z"
  },
  {
    id: 4,
    title: "Neon Genesis Tutorial",
    youtubeId: "J---aiyznGQ",
    category: "mentor",
    tags: ["anime", "training"],
    createdAt: "2024-06-18T15:30:00Z"
  }
];