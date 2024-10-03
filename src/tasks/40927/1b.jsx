import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//Correction made by trainer to import Button from @/components/ui/button, previously the model tried importing from @/components/ui/card
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const initialBooks = [
  { id: '1', title: '1984', author: 'George Orwell', status: 'To Read', progress: 0 },
  { id: '2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: 'Currently Reading', progress: 40 },
  // ... more books
];

function App() {
  const [books, setBooks] = useState(initialBooks);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(books);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, { ...reorderedItem, status: result.destination.droppableId });

    setBooks(items);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:flex-row sm:justify-center">
      <DragDropContext onDragEnd={onDragEnd}>
        {['To Read', 'Currently Reading', 'Finished'].map(section => (
          <Section key={section} status={section} books={books} setBooks={setBooks} />
        ))}
      </DragDropContext>
    </div>
  );
}

function Section({ status, books, setBooks }) {
  const filteredBooks = books.filter(book => book.status === status);

  return (
    <div className="w-full sm:w-1/3 p-2">
      <h2 className="text-xl mb-2 text-center">{status}</h2>
      <Droppable droppableId={status}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
            {filteredBooks.map((book, index) => (
              <Draggable key={book.id} draggableId={book.id} index={index}>
                {(provided) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps}
                  >
                    <BookCard book={book} setBooks={setBooks} isEditable={status !== 'Finished'} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function BookCard({ book, setBooks, isEditable }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(book);

  const saveChanges = () => {
    setBooks(prevBooks => prevBooks.map(b => b.id === book.id ? editedBook : b));
    setIsEditing(false);
  };

  return (
    <Card className={`bg-${book.status === 'To Read' ? 'red' : book.status === 'Currently Reading' ? 'yellow' : 'green'}-100`}>
      <CardHeader>
        {isEditing ? (
          <Input value={editedBook.title} onChange={(e) => setEditedBook({...editedBook, title: e.target.value})} />
        ) : (
          <CardTitle>{book.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Input value={editedBook.author} onChange={(e) => setEditedBook({...editedBook, author: e.target.value})} />
        ) : (
          <p>{book.author}</p>
        )}
        {book.status === 'Currently Reading' && (
          isEditing ? (
            <Slider value={[editedBook.progress]} onValueChange={(value) => setEditedBook({...editedBook, progress: value[0]})} max={100} />
          ) : (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div style={{width: `${book.progress}%`}} className="h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>
          )
        )}
      </CardContent>
      <CardFooter>
        {!isEditing && isEditable ? 
          <Button onClick={() => setIsEditing(true)}>Edit</Button> : 
          isEditing && (
            <>
              <Button onClick={saveChanges} className="bg-green-500">Save</Button>
              <Button onClick={() => setIsEditing(false)} className="ml-2 bg-red-500">Discard</Button>
            </>
          )
        }
      </CardFooter>
    </Card>
  );
}

export default App;