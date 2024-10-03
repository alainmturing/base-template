import React, { useState, useEffect } from 'react';
//model tried importing button from card, trainer made it to import from button
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [books, setBooks] = useState([]);
  const [view, setView] = useState('books');
  const [currentBook, setCurrentBook] = useState('');
  const [currentGenre, setCurrentGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initialize with dummy data
    const initialBooks = ['1984', 'Brave New World', 'Dune'];
    setBooks(initialBooks);
    setQuotes([
      { id: 1, quote: "War is peace.", book: '1984', genre: 'Dystopian' },
      { id: 2, quote: "Community, Identity, Stability.", book: 'Brave New World' },
    ]);
  }, []);

  const addQuote = (newQuote) => {
    setQuotes([...quotes, { id: Date.now(), ...newQuote }]);
    if (!books.includes(newQuote.book)) {
      setBooks([...books, newQuote.book]);
    }
  };

  const updateQuote = (id, updatedQuote) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, ...updatedQuote } : q));
  };

  const deleteQuote = (id) => {
    setQuotes(quotes.filter(q => q.id !== id));
  };

  const filteredQuotes = quotes.filter(quote => 
    quote.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.book.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-center mb-4">Book Quote Collector</h1>
        <div className="flex justify-between mb-4">
          <Button onClick={() => setView('books')}>By Books</Button>
          <Button onClick={() => setView('genres')}>By Genres</Button>
          <Button onClick={() => setView('add')}>Add Quote</Button>
        </div>
        <SearchBar onSearch={setSearchTerm} />
      </header>

      {view === 'books' && <BookList books={books} quotes={filteredQuotes} setCurrentBook={setCurrentBook} />}
      {view === 'genres' && <GenreList quotes={filteredQuotes} setCurrentGenre={setCurrentGenre} />}
      {view === 'add' && <QuoteForm books={books} onAdd={addQuote} onEdit={updateQuote} />}
      
      {(view === 'books' || view === 'genres') && (
        <div className="mt-4">
          {filteredQuotes.map(quote => (
            <QuoteCard key={quote.id} quote={quote} onDelete={() => deleteQuote(quote.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookList({ books, quotes, setCurrentBook }) {
  return (
    <div>
      {books.map(book => (
        <Card key={book} className="mb-4" onClick={() => setCurrentBook(book)}>
          <CardHeader>
            <CardTitle>{book}</CardTitle>
          </CardHeader>
          <CardContent>
            {quotes.filter(q => q.book === book).length > 0 ? 
              quotes.filter(q => q.book === book).map(quote => 
                <p key={quote.id}>"{quote.quote}"</p>
              ) : 
              <p>No quotes available</p>
            }
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GenreList({ quotes, setCurrentGenre }) {
  const genres = [...new Set(quotes.map(q => q.genre).filter(Boolean))];
  
  return (
    <div>
      {genres.map(genre => (
        <Card key={genre} className="mb-4" onClick={() => setCurrentGenre(genre)}>
          <CardTitle>{genre || "Uncategorized"}</CardTitle>
          <CardContent>
            {quotes.filter(q => q.genre === genre).length > 0 ? 
              quotes.filter(q => q.genre === genre).map(quote => 
                <p key={quote.id}>"{quote.quote}"</p>
              ) : 
              <p>No quotes in this genre</p>
            }
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function QuoteForm({ books, onAdd, onEdit, initialQuote = { book: '', quote: '', genre: '' } }) {
  const [quote, setQuote] = useState(initialQuote);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (quote.id) {
      onEdit(quote.id, quote);
    } else {
      if (!quote.book) return alert('Please select a book.');
      onAdd(quote);
    }
    setQuote({ book: '', quote: '', genre: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={quote.book} onChange={(e) => setQuote({...quote, book: e.target.value})}>
        <SelectItem value="">Choose a book</SelectItem>
        {books.map(book => <SelectItem key={book} value={book}>{book}</SelectItem>)}
        <SelectItem value="addNew">+ Add New Book</SelectItem>
      </Select>
      {quote.book === 'addNew' && 
        <Input type="text" placeholder="New Book Title" value={quote.book} onChange={(e) => setQuote({...quote, book: e.target.value})} />}
      <Input type="text" value={quote.quote} onChange={(e) => setQuote({...quote, quote: e.target.value})} placeholder="Quote" required />
      <Input type="text" value={quote.genre} onChange={(e) => setQuote({...quote, genre: e.target.value})} placeholder="Genre (optional)" />
      <Button type="submit">{quote.id ? 'Update Quote' : 'Add Quote'}</Button>
    </form>
  );
}

function QuoteCard({ quote, onDelete }) {
  return (
    <Card className="mb-2">
      <CardContent>
        <p>"{quote.quote}"</p>
        <small>{quote.book} - {quote.genre}</small>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onDelete} variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
}

function SearchBar({ onSearch }) {
  return (
    <Input 
      type="search" 
      placeholder="Search quotes or books..." 
      onChange={(e) => onSearch(e.target.value)} 
      className="w-full mb-4"
    />
  );
}

export default App;