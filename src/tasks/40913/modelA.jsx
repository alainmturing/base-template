import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialTasks = {
  backlog: [],
  doing: [],
  review: [],
  done: []
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);
  const [editingTask, setEditingTask] = useState({ id: null, content: '' });

  const handleDragStart = (e, task, status) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: task.id, from: status }));
    setDraggedTask(task);
  };

  const handleDrop = (e, toStatus) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (data.from !== toStatus) {
      setTasks(prev => ({
        ...prev,
        [data.from]: prev[data.from].filter(t => t.id !== data.id),
        [toStatus]: [...prev[toStatus], { ...tasks[data.from].find(t => t.id === data.id), status: toStatus }]
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addTask = (title, description) => {
    setTasks(prev => ({
      ...prev,
      backlog: [...prev.backlog, { id: Date.now(), title, description, status: 'backlog' }]
    }));
  };

  const startEditing = (task) => {
    setEditingTask({ id: task.id, content: task.description });
  };

  const saveEdit = (taskId) => {
    setTasks(prev => ({
      ...prev,
      [prev[editingTask.status]]: prev[editingTask.status].map(task => 
        task.id === taskId ? { ...task, description: editingTask.content } : task
      )
    }));
    setEditingTask({ id: null, content: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        {['backlog', 'doing', 'review', 'done'].map(status => (
          <Column 
            key={status} 
            status={status} 
            tasks={tasks[status]} 
            onDrop={handleDrop} 
            onDragOver={handleDragOver}
            addTask={addTask}
            startEditing={startEditing}
            saveEdit={saveEdit}
            editingTask={editingTask}
          />
        ))}
      </div>
    </div>
  );
}

function Column({ status, tasks, onDrop, onDragOver, addTask, startEditing, saveEdit, editingTask }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  return (
    <div 
      onDrop={(e) => onDrop(e, status)} 
      onDragOver={onDragOver}
      className="flex-1 bg-white rounded-lg shadow p-4 min-h-[200px] flex flex-col"
    >
      <h2 className="text-lg font-semibold mb-2 capitalize">{status}</h2>
      <div className="flex-grow overflow-y-auto">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDragStart={handleDragStart} 
            startEditing={startEditing}
            saveEdit={saveEdit}
            isEditing={editingTask.id === task.id}
            editingContent={editingTask.content}
          />
        ))}
      </div>
      {status === 'backlog' && (
        <div className="mt-4">
          <Input 
            placeholder="Task Title" 
            value={newTaskTitle} 
            onChange={(e) => setNewTaskTitle(e.target.value)} 
            className="mb-2"
          />
          <Input 
            placeholder="Description" 
            value={newTaskDescription} 
            onChange={(e) => setNewTaskDescription(e.target.value)} 
          />
          <Button onClick={() => {addTask(newTaskTitle, newTaskDescription); setNewTaskTitle(''); setNewTaskDescription('');}} className="mt-2 w-full">
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onDragStart, startEditing, saveEdit, isEditing, editingContent }) {
  const [localContent, setLocalContent] = useState(task.description);

  return (
    <Card 
      draggable 
      onDragStart={(e) => onDragStart(e, task, task.status)} 
      className="mb-2 cursor-move transition-transform duration-200 ease-in-out transform hover:scale-105"
    >
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <>
            <Input 
              value={editingContent} 
              onChange={(e) => setLocalContent(e.target.value)} 
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button onClick={() => saveEdit(task.id)}>Save</Button>
              <Button variant="destructive" onClick={() => startEditing({...task, description: task.description})}>Discard</Button>
            </div>
          </>
        ) : (
          <CardDescription onClick={() => startEditing(task)} className="cursor-pointer">
            {localContent}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className={`text-${task.status === 'backlog' ? 'red' : task.status === 'doing' ? 'yellow' : task.status === 'review' ? 'green' : 'blue'}-500`}>
        {task.status}
      </CardFooter>
    </Card>
  );
}

export default App;