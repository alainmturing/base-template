import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, Plus, Book, BookOpen, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [quoteText, setQuoteText] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [newGenreName, setNewGenreName] = useState('');
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isGenreDialogOpen, setIsGenreDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [editingGenre, setEditingGenre] = useState(null);
  const [quoteError, setQuoteError] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!quoteText.trim()) newErrors.quote = "Please enter a quote.";
    if (!selectedBook) newErrors.book = "Please select a book.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuote = () => {
    setIsSubmitting(true);
    if (validateForm()) {
      const newQuote = {
        id: Date.now(),
        text: quoteText,
        bookId: selectedBook,
        genreId: selectedGenre || null,
      };
      setQuotes([...quotes, newQuote]);
      setQuoteText('');
      setSelectedBook('');
      setSelectedGenre('');
      setErrors({});
      setIsQuoteDialogOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleEditQuote = () => {
    setIsSubmitting(true);
    if (validateForm()) {
      setQuotes(
        quotes.map((quote) =>
          quote.id === editingQuote.id
            ? { ...quote, text: quoteText, bookId: selectedBook, genreId: selectedGenre || null }
            : quote
        )
      );
      setEditingQuote(null);
      setQuoteText('');
      setSelectedBook('');
      setSelectedGenre('');
      setErrors({});
      setIsQuoteDialogOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleDeleteQuote = (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      setQuotes(quotes.filter((quote) => quote.id !== id));
    }
  };

  // Handlers for Books
  const handleAddBook = () => {
    if (!newBookTitle) return;
    const exists = books.find(
      (book) => book.title.toLowerCase() === newBookTitle.toLowerCase()
    );
    if (exists) {
      alert('Book already exists.');
      return;
    }
    const newBook = {
      id: Date.now(),
      title: newBookTitle,
    };
    setBooks([...books, newBook]);
    setNewBookTitle('');
    setIsBookDialogOpen(false);
  };

  const handleEditBook = () => {
    if (!newBookTitle) return;
    setBooks(
      books.map((book) =>
        book.id === editingBook.id ? { ...book, title: newBookTitle } : book
      )
    );
    setEditingBook(null);
    setNewBookTitle('');
    setIsBookDialogOpen(false);
  };

  // Handlers for Genres
  const handleAddGenre = () => {
    if (!newGenreName) return;
    const exists = genres.find(
      (genre) => genre.name.toLowerCase() === newGenreName.toLowerCase()
    );
    if (exists) {
      alert('Genre already exists.');
      return;
    }
    const newGenre = {
      id: Date.now(),
      name: newGenreName,
    };
    setGenres([...genres, newGenre]);
    setNewGenreName('');
    setIsGenreDialogOpen(false);
  };

  const handleEditGenre = () => {
    if (!newGenreName) return;
    setGenres(
      genres.map((genre) =>
        genre.id === editingGenre.id ? { ...genre, name: newGenreName } : genre
      )
    );
    setEditingGenre(null);
    setNewGenreName('');
    setIsGenreDialogOpen(false);
  };

  // Search functionality
  const filteredQuotes = quotes.filter((quote) =>
    quote.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get quotes organized by book and genre
  const quotesByBook = books.map((book) => ({
    ...book,
    quotes: filteredQuotes.filter((quote) => quote.bookId === book.id),
  }));

  const quotesByGenre = genres.map((genre) => ({
    ...genre,
    quotes: filteredQuotes.filter((quote) => quote.genreId === genre.id),
  }));

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mb-4">Book Quote Collector</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
          <Input
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto border border-indigo-300"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2 sm:mt-0 mb-4">
        <Button onClick={() => { setIsQuoteDialogOpen(true); setEditingQuote(null); }} className="bg-green-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Quote
        </Button>
        <Button onClick={() => { setIsBookDialogOpen(true); setEditingBook(null); }} className="bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Book
        </Button>
        <Button onClick={() => { setIsGenreDialogOpen(true); setEditingGenre(null); }} className="bg-yellow-500 text-black">
          <Plus className="w-4 h-4 mr-2" /> Add Genre
        </Button>
      </div>

      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="books" className="flex items-center"><Book className="w-4 h-4 mr-2" /> Books</TabsTrigger>
          <TabsTrigger value="genres" className="flex items-center"><BookOpen className="w-4 h-4 mr-2" /> Genres</TabsTrigger>
        </TabsList>
        <TabsContent value="books">
        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            {quotesByBook.map((book) => (
                <Card key={book.id} className="mb-4 border border-gray-300 shadow-sm rounded-lg overflow-visible">
                <CardHeader className="bg-gray-50 py-2">
                    <CardTitle className="text-lg text-indigo-700 font-semibold">{book.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-visible">
                    {book.quotes.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {book.quotes.map((quote) => (
                        <li key={quote.id} className="p-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full">
                            <div className="flex-grow w-full">
                                <p className="text-sm italic font-medium text-gray-900 break-words whitespace-normal w-full"
                                style={{ wordWrap: "break-word", overflowWrap: "break-word", wordBreak: "break-all" }}>
                                "{quote.text}"
                                </p>
                                {quote.genreId && (
                                <p className="text-xs text-gray-600 mt-1">
                                    Genre: {genres.find((g) => g.id === quote.genreId)?.name}
                                </p>
                                )}
                            </div>
                            <div className="flex flex-shrink-0 gap-1 mt-2 sm:mt-0">
                                <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setEditingQuote(quote);
                                    setQuoteText(quote.text);
                                    setSelectedBook(quote.bookId);
                                    setSelectedGenre(quote.genreId);
                                    setIsQuoteDialogOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                >
                                <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteQuote(quote.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                >
                                <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-gray-500 p-3">No quotes available.</p>
                    )}
                </CardContent>
                </Card>
            ))}
            </ScrollArea>

        </TabsContent>
        <TabsContent value="genres">
        <ScrollArea className="overflow-auto pr-4">
            {quotesByGenre.map((genre) => (
                <Card key={genre.id} className="mb-4 border border-gray-300 shadow-sm rounded-lg overflow-visible">
                <CardHeader className="bg-gray-50 py-2">
                    <CardTitle className="text-lg text-indigo-700 font-semibold">{genre.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-visible">
                    {genre.quotes.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {genre.quotes.map((quote) => (
                        <li key={quote.id} className="p-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full">
                            <div className="flex-grow w-full">
                                <p className="text-sm italic font-medium text-gray-900 break-words whitespace-normal w-full"
                                style={{ wordWrap: "break-word", overflowWrap: "break-word", wordBreak: "break-all" }}>
                                "{quote.text}"
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                Book: {books.find((b) => b.id === quote.bookId)?.title}
                                </p>
                            </div>
                            <div className="flex flex-shrink-0 gap-1 mt-2 sm:mt-0">
                                <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setEditingQuote(quote);
                                    setQuoteText(quote.text);
                                    setSelectedBook(quote.bookId);
                                    setSelectedGenre(quote.genreId);
                                    setIsQuoteDialogOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                >
                                <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteQuote(quote.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                >
                                <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-gray-500 p-3">No quotes available.</p>
                    )}
                </CardContent>
                </Card>
            ))}
            </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingQuote ? 'Edit Quote' : 'Add Quote'}</DialogTitle>
            <DialogDescription>
              {editingQuote ? 'Update the details of the quote.' : 'Add a new quote to your collection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Textarea
                placeholder="Enter quote..."
                value={quoteText}
                onChange={(e) => {
                  setQuoteText(e.target.value);
                  setErrors((prev) => ({ ...prev, quote: '' }));
                }}
                className={cn(
                  "col-span-3",
                  errors.quote && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.quote && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.quote}
                </p>
              )}
            </div>
            <div>
              <Select
                value={selectedBook}
                onValueChange={(value) => {
                  setSelectedBook(value);
                  setErrors((prev) => ({ ...prev, book: '' }));
                }}
              >
                <SelectTrigger className={cn(errors.book && "border-red-500 focus-visible:ring-red-500")}>
                  <SelectValue placeholder="Select Book" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>{book.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.book && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.book}
                </p>
              )}
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>{genre.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={editingQuote ? handleEditQuote : handleAddQuote}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (editingQuote ? 'Update Quote' : 'Add Quote')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Book Dialog */}
      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
            <DialogDescription>
              {editingBook ? 'Update the title of the book.' : 'Add a new book to your collection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Book Title"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={editingBook ? handleEditBook : handleAddBook}>
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Genre Dialog */}
      <Dialog open={isGenreDialogOpen} onOpenChange={setIsGenreDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGenre ? 'Edit Genre' : 'Add Genre'}</DialogTitle>
            <DialogDescription>
              {editingGenre ? 'Update the name of the genre.' : 'Add a new genre to your collection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Genre Name"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={editingGenre ? handleEditGenre : handleAddGenre}>
              {editingGenre ? 'Update Genre' : 'Add Genre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
