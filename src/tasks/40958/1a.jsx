import React, { useReducer, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";

// Reducer for quote operations
const quotesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_QUOTE':
      return [...state, action.payload];
    case 'EDIT_QUOTE':
      return state.map(q => q.id === action.payload.id ? action.payload : q);
    case 'DELETE_QUOTE':
      return state.filter(q => q.id !== action.payload);
    default:
      return state;
  }
};

function App() {
  const [books, setBooks] = useState([{ id: 1, title: 'Default Book' }]);
  const [genres] = useState(['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery']);
  const [quotes, dispatchQuotes] = useReducer(quotesReducer, []);
  const [viewBy, setViewBy] = useState('book');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Book Quote Collector</h1>
      <QuoteForm books={books} onAdd={(quote) => dispatchQuotes({ type: 'ADD_QUOTE', payload: quote })} />
      <SearchBar onSearch={setSearchTerm} />
      <ViewToggle onToggle={setViewBy} />
      {viewBy === 'book' ? 
        <BookList books={books} quotes={quotes.filter(q => q.text.includes(searchTerm))} /> : 
        <GenreList genres={genres} quotes={quotes} searchTerm={searchTerm} />}
    </div>
  );
}

// Components would be detailed here...

// QuoteForm, SearchBar, ViewToggle, BookList, QuoteList, GenreList would follow with similar structure

export default App;