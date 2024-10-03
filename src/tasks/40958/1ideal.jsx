import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
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

export default function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [viewMode, setViewMode] = useState('book'); // 'book' or 'genre'
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

  // Handlers for Quotes
  const handleAddQuote = () => {
    if (!quoteText || !selectedBook) return;
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
    setIsQuoteDialogOpen(false);
  };

  const handleEditQuote = () => {
    if (!quoteText || !selectedBook) return;
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
    setIsQuoteDialogOpen(false);
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

  const handleDeleteBook = (id) => {
    if (window.confirm('Deleting this book will remove all associated quotes. Proceed?')) {
      setBooks(books.filter((book) => book.id !== id));
      setQuotes(quotes.filter((quote) => quote.bookId !== id));
    }
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

  const handleDeleteGenre = (id) => {
    if (window.confirm('Deleting this genre will remove it from all associated quotes. Proceed?')) {
      setGenres(genres.filter((genre) => genre.id !== id));
      setQuotes(
        quotes.map((quote) =>
          quote.genreId === id ? { ...quote, genreId: null } : quote
        )
      );
    }
  };

  // Search functionality
  const filteredQuotes = quotes.filter((quote) =>
    quote.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get quotes organized by viewMode
  const organizedQuotes =
    viewMode === 'book'
      ? books.map((book) => ({
          ...book,
          quotes: filteredQuotes.filter((quote) => quote.bookId === book.id),
        }))
      : genres.map((genre) => ({
          ...genre,
          quotes: filteredQuotes.filter((quote) => quote.genreId === genre.id),
        }));

  // Responsive classes
  const containerClass = 'p-4 max-w-4xl mx-auto';
  const headerClass = 'flex flex-col sm:flex-row justify-between items-center mb-4';
  const buttonClass = 'mt-2 sm:mt-0 ml-0 sm:ml-2';

  return (
    <div className={containerClass}>
      <div className={headerClass}>
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-4">Book Quote Collector</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <Input
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2 sm:mb-0 sm:mr-2 border border-indigo-300"
          />
          <Select value={viewMode} onValueChange={setViewMode} className="w-36 mb-2 sm:mb-0 sm:mr-2">
            <SelectTrigger>
              <SelectValue placeholder="View By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="genre">Genre</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { setIsQuoteDialogOpen(true); setEditingQuote(null); }} className={`${buttonClass} bg-green-500 text-white`}>
            Add Quote
          </Button>
          <Button onClick={() => { setIsBookDialogOpen(true); setEditingBook(null); }} className={`${buttonClass} bg-blue-500 text-white`}>
            Add Book
          </Button>
          <Button onClick={() => { setIsGenreDialogOpen(true); setEditingGenre(null); }} className={`${buttonClass} bg-yellow-500 text-black`}>
            Add Genre
          </Button>
        </div>
      </div>

      {/* Organized Quotes */}
      <div>
        {organizedQuotes.map((group) => (
          <Card key={group.id} className="mb-6 border-2 border-gray-300 shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg text-indigo-700 font-semibold">
                {viewMode === 'book' ? group.title : group.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {group.quotes.length > 0 ? (
                group.quotes.map((quote) => (
                  <Card key={quote.id} className="mb-2 border-2 border-indigo-300 rounded">
                    <CardContent>
                      <p className="text-xl italic font-semibold text-purple-800">"{quote.text}"</p>
                      <p className="text-sm text-gray-600">
                        {viewMode === 'genre' && quote.bookId
                          ? `Book: ${books.find((b) => b.id === quote.bookId)?.title}`
                          : viewMode === 'book' && quote.genreId
                          ? `Genre: ${genres.find((g) => g.id === quote.genreId)?.name}`
                          : ''}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingQuote(quote);
                          setQuoteText(quote.text);
                          setSelectedBook(quote.bookId);
                          setSelectedGenre(quote.genreId);
                          setIsQuoteDialogOpen(true);
                        }}
                        className="mr-2 bg-indigo-500 text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="bg-red-500 text-white"
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500">No quotes available.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingQuote ? 'Edit Quote' : 'Add Quote'}
            </DialogTitle>
            <DialogDescription>
              {editingQuote ? 'Update the details of the quote.' : 'Add a new quote to your collection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder="Enter quote..."
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              className="mb-4 border border-indigo-300"
            />
            <Select
              value={selectedBook}
              onValueChange={setSelectedBook}
              className="mb-4"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Book" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="link"
              onClick={() => setIsBookDialogOpen(true)}
              className="mb-4 text-indigo-500"
            >
              Add New Book
            </Button>
            <Select
              value={selectedGenre}
              onValueChange={setSelectedGenre}
              className="mb-4"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Genre (Optional)" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="link"
              onClick={() => setIsGenreDialogOpen(true)}
              className="mb-4 text-indigo-500"
            >
              Add New Genre
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={editingQuote ? handleEditQuote : handleAddQuote} className="bg-green-500 text-white">
              {editingQuote ? 'Update Quote' : 'Add Quote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Book Dialog */}
      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingBook ? 'Edit Book' : 'Add Book'}
            </DialogTitle>
            <DialogDescription>
              {editingBook ? 'Update the title of the book.' : 'Add a new book to your collection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Book Title"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              className="mb-4 border border-blue-300"
            />
          </div>
          <DialogFooter>
            <Button onClick={editingBook ? handleEditBook : handleAddBook} className="bg-blue-500 text-white">
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Genre Dialog */}
      <Dialog open={isGenreDialogOpen} onOpenChange={setIsGenreDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingGenre ? 'Edit Genre' : 'Add Genre'}
            </DialogTitle>
            <DialogDescription>
              {editingGenre ? 'Update the name of the genre.' : 'Add a new genre to your collection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Genre Name"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              className="mb-4 border border-yellow-300"
            />
          </div>
          <DialogFooter>
            <Button onClick={editingGenre ? handleEditGenre : handleAddGenre} className="bg-yellow-500 text-black">
              {editingGenre ? 'Update Genre' : 'Add Genre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
