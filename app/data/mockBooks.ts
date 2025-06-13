import type { Book } from '~/types/book';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    isbn: '9781786892737',
    genre: 'Fiction',
    status: 'completed',
    rating: 4,
    dateAdded: '2024-01-15',
    dateCompleted: '2024-02-01',
    notes: 'Thought-provoking exploration of parallel lives',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    publisher: 'Canongate Books',
    publishedYear: 2020,
    pageCount: 288,
    format: 'physical',
    location: 'Shelf A-1',
    tags: ['philosophy', 'contemporary', 'bestseller']
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    genre: 'Self-Help',
    status: 'reading',
    rating: 5,
    dateAdded: '2024-02-10',
    notes: 'Excellent practical guide to building good habits',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    publisher: 'Avery',
    publishedYear: 2018,
    pageCount: 320,
    format: 'ebook',
    tags: ['productivity', 'psychology', 'habits']
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441172719',
    genre: 'Science Fiction',
    status: 'wishlist',
    dateAdded: '2024-02-20',
    notes: 'Classic sci-fi epic - want to read before watching the movie',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    publisher: 'Ace Books',
    publishedYear: 1965,
    pageCount: 688,
    format: 'physical',
    tags: ['classic', 'space-opera', 'epic']
  },
  {
    id: '4',
    title: 'Educated',
    author: 'Tara Westover',
    isbn: '9780399590504',
    genre: 'Biography',
    status: 'completed',
    rating: 5,
    dateAdded: '2024-01-05',
    dateCompleted: '2024-01-25',
    notes: 'Powerful memoir about education and family',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    publisher: 'Random House',
    publishedYear: 2018,
    pageCount: 334,
    format: 'audiobook',
    tags: ['memoir', 'education', 'family']
  },
  {
    id: '5',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    isbn: '9781501161933',
    genre: 'Fiction',
    status: 'unread',
    dateAdded: '2024-02-25',
    notes: 'Highly recommended by book club',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    publisher: 'Atria Books',
    publishedYear: 2017,
    pageCount: 400,
    format: 'physical',
    location: 'Shelf B-2',
    tags: ['romance', 'hollywood', 'lgbtq']
  },
  {
    id: '6',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    genre: 'History',
    status: 'reading',
    rating: 4,
    dateAdded: '2024-01-30',
    notes: 'Fascinating perspective on human evolution and society',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    publisher: 'Harper',
    publishedYear: 2014,
    pageCount: 443,
    format: 'ebook',
    tags: ['anthropology', 'evolution', 'society']
  },
  {
    id: '7',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    isbn: '9781250301697',
    genre: 'Thriller',
    status: 'completed',
    rating: 3,
    dateAdded: '2024-01-20',
    dateCompleted: '2024-02-05',
    notes: 'Good twist but predictable in parts',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    publisher: 'Celadon Books',
    publishedYear: 2019,
    pageCount: 336,
    format: 'audiobook',
    tags: ['psychological', 'mystery', 'twist']
  },
  {
    id: '8',
    title: 'Becoming',
    author: 'Michelle Obama',
    isbn: '9781524763138',
    genre: 'Biography',
    status: 'completed',
    rating: 5,
    dateAdded: '2024-01-10',
    dateCompleted: '2024-01-28',
    notes: 'Inspiring and beautifully written',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    publisher: 'Crown',
    publishedYear: 2018,
    pageCount: 448,
    format: 'physical',
    location: 'Shelf A-3',
    tags: ['memoir', 'politics', 'inspiration']
  }
];

// Generate more books for testing infinite scroll
const additionalBooks: Book[] = [];
const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help', 'Thriller'];
const statuses: Book['status'][] = ['unread', 'reading', 'completed', 'wishlist'];
const formats: Book['format'][] = ['physical', 'ebook', 'audiobook'];

for (let i = 9; i <= 50; i++) {
  additionalBooks.push({
    id: i.toString(),
    title: `Sample Book ${i}`,
    author: `Author ${i}`,
    genre: genres[Math.floor(Math.random() * genres.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    rating: Math.floor(Math.random() * 5) + 1,
    dateAdded: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    format: formats[Math.floor(Math.random() * formats.length)],
    tags: ['sample', 'test'],
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    pageCount: Math.floor(Math.random() * 500) + 100,
    publishedYear: 2000 + Math.floor(Math.random() * 24),
  });
}

export const allMockBooks = [...mockBooks, ...additionalBooks];