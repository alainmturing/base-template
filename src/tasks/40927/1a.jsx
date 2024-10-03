import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const initialBooks = [
  { id: '1', title: '1984', author: 'George Orwell', status: 'to-read', progress: 0 },
  { id: '2', title: 'Dune', author: 'Frank Herbert', status: 'currently-reading', progress: 50 },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', status: 'finished', progress: 100 },
];

function BookCard({ book, index, onEdit, onSave, onDiscard, isEditing }) {
  const [editBook, setEditBook] = useState({...book});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditBook(prev => ({...prev, [name]: value}));
  };

  const handleProgressChange = (value) => {
    setEditBook(prev => ({...prev, progress: value}));
  };

  return (
    <Draggable draggableId={book.id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Card className={`mb-4 ${book.status === 'to-read' ? 'bg-red-100' : book.status === 'currently-reading' ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <CardHeader>
              <CardTitle>{isEditing ? <Input name="title" value={editBook.title} onChange={handleChange} /> : book.title}</CardTitle>
              <CardDescription>{isEditing ? <Input name="author" value={editBook.author} onChange={handleChange} /> : book.author}</CardDescription>
            </CardHeader>
            {book.status === 'currently-reading' && (
              <CardContent>
                <Slider value={[editBook.progress]} onValueChange={handleProgressChange} max={100} />
                <div className="text-center mt-2">{editBook.progress}%</div>
              </CardContent>
            )}
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button onClick={() => onSave(editBook)} className="bg-green-500">Save</Button>
                  <Button onClick={() => onDiscard()} className="bg-red-500">Discard</Button>
                </>
              ) : (
                <Button onClick={() => onEdit(book)} disabled={book.status === 'finished'}>Edit</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

function Section({ title, books, onDrop }) {
  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl mb-4">{title}</h2>
      <Droppable droppableId={title}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {books.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} {...book} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default function App() {
  const [books, setBooks] = useState(initialBooks);
  const [editingBook, setEditingBook] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(books);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedBook = { ...reorderedItem, status: result.destination.droppableId.toLowerCase().replace(' ', '-') };
    setBooks(items.map((b, i) => b.id === updatedBook.id ? updatedBook : b));
  };

  const handleEdit = (book) => setEditingBook(book);
  const handleSave = (updatedBook) => {
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    setEditingBook(null);
  };
  const handleDiscard = () => setEditingBook(null);

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl mb-4">Reading List Tracker</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col sm:flex-row justify-between">
          {['To Read', 'Currently Reading', 'Finished'].map(section => (
            <Section 
              key={section} 
              title={section} 
              books={books.filter(book => book.status === section.toLowerCase().replace(' ', '-'))} 
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}