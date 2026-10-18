import { TaskItem } from './types';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'node-101',
    title: 'Initialize Doubly Linked List',
    description: 'Set up Head and Tail sentinel pointers in memory with O(1) references.',
    priority: 'urgent',
    category: 'Architecture',
    status: 'completed',
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'node-102',
    title: 'Implement In-Place Reversal',
    description: 'Traverse list swapping current.next and current.prev pointers simultaneously.',
    priority: 'high',
    category: 'Algorithms',
    status: 'in-progress',
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'node-103',
    title: 'Build Interactive Pointer Canvas',
    description: 'Render dynamic SVG arrows connecting next and prev pointers in real-time.',
    priority: 'medium',
    category: 'UI/UX',
    status: 'in-progress',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'node-104',
    title: 'Deploy to Vercel Cloud',
    description: 'Optimize Next.js bundle and configure edge caching with instant deployment.',
    priority: 'low',
    category: 'DevOps',
    status: 'todo',
    createdAt: Date.now() - 3600000,
  },
];

export const PRESET_BUNDLES: { name: string; icon: string; tasks: TaskItem[] }[] = [
  {
    name: 'Dev Sprint Pipeline',
    icon: '⚡',
    tasks: INITIAL_TASKS,
  },
  {
    name: 'Browser History Queue',
    icon: '🌐',
    tasks: [
      {
        id: 'hist-1',
        title: 'https://github.com/dsa',
        description: 'Visited repository root page',
        priority: 'medium',
        category: 'Navigation',
        status: 'completed',
        createdAt: Date.now() - 50000,
      },
      {
        id: 'hist-2',
        title: 'https://nextjs.org/docs',
        description: 'Reading App Router and Server Components docs',
        priority: 'high',
        category: 'Research',
        status: 'in-progress',
        createdAt: Date.now() - 30000,
      },
      {
        id: 'hist-3',
        title: 'https://vercel.com/dashboard',
        description: 'Checking live production deployment metrics',
        priority: 'urgent',
        category: 'Monitoring',
        status: 'todo',
        createdAt: Date.now() - 10000,
      },
    ],
  },
  {
    name: 'Audio Player Playlist',
    icon: '🎵',
    tasks: [
      {
        id: 'song-1',
        title: 'Midnight Algorithm (Synthwave)',
        description: 'Duration: 3:42 | Bitrate: 320kbps | Key: F# Minor',
        priority: 'high',
        category: 'Synthwave',
        status: 'completed',
        createdAt: Date.now() - 20000,
      },
      {
        id: 'song-2',
        title: 'Pointers & References (Lo-Fi)',
        description: 'Duration: 2:58 | Chill beats to study DSA to',
        priority: 'medium',
        category: 'Lo-Fi',
        status: 'in-progress',
        createdAt: Date.now() - 15000,
      },
      {
        id: 'song-3',
        title: 'Binary Search Symphony',
        description: 'Duration: 4:15 | Orchestral electronic crescendos',
        priority: 'low',
        category: 'Classical Electro',
        status: 'todo',
        createdAt: Date.now() - 5000,
      },
    ],
  },
];
