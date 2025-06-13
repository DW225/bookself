export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  status: 'unread' | 'reading' | 'completed' | 'wishlist';
  rating?: number;
  dateAdded: string;
  dateCompleted?: string;
  notes?: string;
  coverUrl?: string;
  publisher?: string;
  publishedYear?: number;
  pageCount?: number;
  format: 'physical' | 'ebook' | 'audiobook';
  location?: string; // For physical books
  tags: string[];
  language?: string;
}

export interface BookFilters {
  status: string[];
  genre: string[];
  format: string[];
  rating: number[];
}

export type SortOption = 
  | 'title-asc' 
  | 'title-desc' 
  | 'author-asc' 
  | 'author-desc' 
  | 'date-added-asc' 
  | 'date-added-desc' 
  | 'rating-asc' 
  | 'rating-desc';