import { Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { DynamicSelect } from '~/components/ui/dynamic-select';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import type { Book } from '~/types/book';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Omit<Book, 'id' | 'dateAdded'>) => void;
}

const initialGenres = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 
  'Biography', 'History', 'Self-Help', 'Thriller', 'Horror', 'Poetry', 
  'Drama', 'Adventure', 'Comedy', 'Philosophy', 'Science', 'Technology'
];

const initialPublishers = [
  'Penguin Random House', 'HarperCollins', 'Macmillan', 'Simon & Schuster', 
  'Hachette', 'Scholastic', 'Wiley', 'Oxford University Press', 'Cambridge University Press',
  'Pearson', 'McGraw-Hill', 'Springer', 'Elsevier'
];

const initialLanguages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish'
];

const initialTags = [
  'bestseller', 'classic', 'award-winner', 'contemporary', 'historical', 
  'young-adult', 'children', 'educational', 'reference', 'cookbook',
  'travel', 'health', 'business', 'psychology', 'philosophy'
];

export function AddBookModal({ isOpen, onClose, onAddBook }: AddBookModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishedYear: '',
    pageCount: '',
    genre: '',
    language: 'English',
    status: 'unread' as Book['status'],
    format: 'physical' as Book['format'],
    rating: 0,
    location: '',
    notes: '',
    coverUrl: '',
  });

  const [genres, setGenres] = useState(initialGenres);
  const [publishers, setPublishers] = useState(initialPublishers);
  const [languages, setLanguages] = useState(initialLanguages);
  const [tags, setTags] = useState(initialTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.author.trim()) {
      return;
    }

    const bookData: Omit<Book, 'id' | 'dateAdded'> = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim() || undefined,
      genre: formData.genre || 'Fiction',
      status: formData.status,
      format: formData.format,
      rating: formData.rating || undefined,
      publisher: formData.publisher.trim() || undefined,
      publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
      pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
      location: formData.location.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      coverUrl: formData.coverUrl.trim() || undefined,
      tags: selectedTags,
    };

    onAddBook(bookData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publishedYear: '',
      pageCount: '',
      genre: '',
      language: 'English',
      status: 'unread',
      format: 'physical',
      rating: 0,
      location: '',
      notes: '',
      coverUrl: '',
    });
    setSelectedTags([]);
    onClose();
  };

  const handleAddGenre = (newGenre: string) => {
    if (!genres.includes(newGenre)) {
      setGenres([...genres, newGenre]);
    }
  };

  const handleAddPublisher = (newPublisher: string) => {
    if (!publishers.includes(newPublisher)) {
      setPublishers([...publishers, newPublisher]);
    }
  };

  const handleAddLanguage = (newLanguage: string) => {
    if (!languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
    }
  };

  const handleAddTag = (newTag: string) => {
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Add a new book to your collection. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter book title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="Enter ISBN"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverUrl">Cover Image URL</Label>
              <Input
                id="coverUrl"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="Enter cover image URL"
              />
            </div>
          </div>

          {/* Publishing Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Publisher</Label>
              <DynamicSelect
                value={formData.publisher ? [formData.publisher] : []}
                onChange={(values) => setFormData({ ...formData, publisher: values[0] || '' })}
                options={publishers}
                onAddOption={handleAddPublisher}
                placeholder="Select or add publisher"
                multiple={false}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publishedYear">Published Year</Label>
              <Input
                id="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                placeholder="2024"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pageCount">Page Count</Label>
              <Input
                id="pageCount"
                type="number"
                value={formData.pageCount}
                onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                placeholder="300"
                min="1"
              />
            </div>
          </div>

          {/* Categories and Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Genre</Label>
              <DynamicSelect
                value={formData.genre ? [formData.genre] : []}
                onChange={(values) => setFormData({ ...formData, genre: values[0] || '' })}
                options={genres}
                onAddOption={handleAddGenre}
                placeholder="Select or add genre"
                multiple={false}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Language</Label>
              <DynamicSelect
                value={formData.language ? [formData.language] : []}
                onChange={(values) => setFormData({ ...formData, language: values[0] || 'English' })}
                options={languages}
                onAddOption={handleAddLanguage}
                placeholder="Select or add language"
                multiple={false}
              />
            </div>
          </div>

          {/* Status and Format */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: Book['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="reading">Currently Reading</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="wishlist">Wishlist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={formData.format} onValueChange={(value: Book['format']) => setFormData({ ...formData, format: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical Book</SelectItem>
                  <SelectItem value="ebook">E-book</SelectItem>
                  <SelectItem value="audiobook">Audiobook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star === formData.rating ? 0 : star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {formData.rating > 0 ? `${formData.rating}/5` : 'No rating'}
                </span>
              </div>
            </div>
          </div>

          {/* Location (for physical books) */}
          {formData.format === 'physical' && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Shelf A-1, Living Room, etc."
              />
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <DynamicSelect
              value={selectedTags}
              onChange={setSelectedTags}
              options={tags}
              onAddOption={handleAddTag}
              placeholder="Select or add tags"
              multiple={true}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this book..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.title.trim() || !formData.author.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}