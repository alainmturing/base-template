import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function App() {
  const [books, setBooks] = useState([]);
  const [draggingBookId, setDraggingBookId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditBook, setCurrentEditBook] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', author: '', progress: 0 });
  const [originalEditForm, setOriginalEditForm] = useState({ title: '', author: '', progress: 0 });
  const [addForm, setAddForm] = useState({ title: '', author: '' });
  const [addFormErrors, setAddFormErrors] = useState({ title: false, author: false });

  const statuses = ['To Read', 'Currently Reading', 'Finished'];
  const statusColors = {
    'To Read': 'bg-red-100',
    'Currently Reading': 'bg-yellow-100',
    Finished: 'bg-green-100',
  };
  const statusBorders = {
    'To Read': 'border-red-500',
    'Currently Reading': 'border-yellow-500',
    Finished: 'border-green-500',
  };

  // Drag and drop events for desktop and mobile
  const handleDragStart = (e, id) => {
    setDraggingBookId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleTouchStart = (e, id) => {
    setDraggingBookId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('text/plain'));
    updateBookStatus(id, newStatus);
  };

  const handleTouchEnd = (newStatus) => {
    if (draggingBookId) {
      updateBookStatus(draggingBookId, newStatus);
    }
    setDraggingBookId(null);
  };

  const updateBookStatus = (id, newStatus) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id
          ? {
              ...book,
              status: newStatus,
              progress:
                newStatus === 'Currently Reading'
                  ? book.progress || 0
                  : newStatus === 'Finished'
                  ? 100
                  : 0,
            }
          : book
      )
    );
  };

  // Modal handling
  const openEditModal = (book) => {
    setCurrentEditBook(book);
    const formData = {
      title: book.title,
      author: book.author,
      progress: book.progress,
    };
    setEditForm(formData);
    setOriginalEditForm(formData);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentEditBook(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'progress' ? Number(value) : value,
    }));
  };

  const handleProgressChange = (e) => {
    const value = Number(e.target.value);
    setEditForm((prev) => ({
      ...prev,
      progress: value,
    }));
  };

  const saveEdit = () => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === currentEditBook.id
          ? { ...book, ...editForm }
          : book
      )
    );
    closeEditModal();
  };

  const discardEdit = () => {
    closeEditModal();
  };

  const updateProgress = (id, newProgress) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, progress: newProgress } : book
      )
    );
  };

  // Adding new books
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (value.trim() !== '') {
      setAddFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const { title, author } = addForm;
    const errors = {
      title: title.trim() === '',
      author: author.trim() === '',
    };
    setAddFormErrors(errors);
    if (errors.title || errors.author) {
      return;
    }
    const newBook = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      status: 'To Read',
      progress: 0,
    };
    setBooks((prevBooks) => [...prevBooks, newBook]);
    setAddForm({ title: '', author: '' });
  };

  const hasChanges = () => {
    return JSON.stringify(editForm) !== JSON.stringify(originalEditForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-center mb-8">📚 Reading List Tracker</h1>
      <AddBookForm
        form={addForm}
        errors={addFormErrors}
        onChange={handleAddChange}
        onSubmit={handleAddSubmit}
      />
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-8">
        {statuses.map((status) => (
          <BookList
            key={status}
            status={status}
            books={books.filter((book) => book.status === status)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onTouchEnd={() => handleTouchEnd(status)}
            onDragStart={handleDragStart}
            onTouchStart={handleTouchStart}
            onEdit={openEditModal}
            statusColors={statusColors}
            statusBorders={statusBorders}
            updateProgress={updateProgress}
          />
        ))}
      </div>
      {isModalOpen && currentEditBook && (
        <EditModal
          book={currentEditBook}
          form={editForm}
          onChange={handleEditChange}
          onProgressChange={handleProgressChange}
          hasChanges={hasChanges()}
          onSave={saveEdit}
          onDiscard={discardEdit}
        />
      )}
    </div>
  );
}

// BookList component
function BookList({
  status,
  books,
  onDragOver,
  onDrop,
  onTouchEnd,
  onDragStart,
  onTouchStart,
  onEdit,
  statusColors,
  statusBorders,
  updateProgress,
}) {
  return (
    <div
      className="flex-1 bg-white p-4 rounded-lg shadow-md border-t-4"
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, status)}
      onTouchEnd={onTouchEnd}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">{status}</h2>
      {books.length === 0 ? (
        <p className="text-gray-500 text-center">No books in this section yet.</p>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDragStart={onDragStart}
              onTouchStart={onTouchStart}
              onEdit={onEdit}
              statusColor={statusColors[status]}
              statusBorder={statusBorders[status]}
              updateProgress={updateProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// BookCard component
function BookCard({ book, onDragStart, onTouchStart, onEdit, statusColor, statusBorder, updateProgress }) {
  const handleDragStart = (e) => {
    onDragStart(e, book.id);
  };

  const handleTouchStart = (e) => {
    onTouchStart(e, book.id);
  };

  const handleClick = () => {
    onEdit(book);
  };

  const handleProgressChange = (e) => {
    updateProgress(book.id, Number(e.target.value));
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      className={`cursor-pointer ${statusColor} border ${statusBorder} transition-transform transform hover:scale-105`}
    >
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription className="text-sm text-gray-700">{book.author}</CardDescription>
      </CardHeader>
      <CardContent>
        {book.status === 'Currently Reading' && (
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Progress: {book.progress}%</span>
              <span
                className="text-sm text-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                Edit
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={book.progress}
              onChange={handleProgressChange}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full"
          disabled={book.status === 'Finished'}
        >
          {book.status === 'Finished' ? 'Completed' : 'Edit Details'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// AddBookForm component
function AddBookForm({ form, errors, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4">Add a New Book</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            name="title"
            value={form.title}
            onChange={onChange}
            className={`w-full ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter book title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">Title is required.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <Input
            name="author"
            value={form.author}
            onChange={onChange}
            className={`w-full ${errors.author ? 'border-red-500' : ''}`}
            placeholder="Enter author name"
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">Author is required.</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
        >
          Add Book
        </Button>
      </div>
    </form>
  );
}

// EditModal component
function EditModal({
  book,
  form,
  onChange,
  onProgressChange,
  hasChanges,
  onSave,
  onDiscard,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onDiscard}
      ></div>
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              name="title"
              value={form.title}
              onChange={onChange}
              className="w-full"
              placeholder="Enter book title"
              disabled={book.status === 'Finished'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <Input
              name="author"
              value={form.author}
              onChange={onChange}
              className="w-full"
              placeholder="Enter author name"
              disabled={book.status === 'Finished'}
            />
          </div>
          {book.status === 'Currently Reading' && (
            <div>
              <label className="block text-sm font-medium mb-1">Progress</label>
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={form.progress}
                onChange={onProgressChange}
                className="w-full"
              />
              <span className="text-sm">Progress: {form.progress}%</span>
            </div>
          )}
        </div>
        {hasChanges && (
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="secondary"
              onClick={onDiscard}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
            >
              Discard
            </Button>
            <Button
              onClick={onSave}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;