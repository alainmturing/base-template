import React, { useState, useRef, useEffect } from 'react';
//Card footer imported by trainer
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statuses = ['backlog', 'doing', 'review', 'done'];

function App() {
  const [tasks, setTasks] = useState([]);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    const copyListItems = [...tasks];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(copyListItems);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <TaskForm addTask={task => setTasks([...tasks, { ...task, status: 'backlog' }])} />
      <KanbanBoard tasks={tasks} setTasks={setTasks} 
                   onDragStart={handleDragStart} 
                   onDragEnter={handleDragEnter} 
                   onDragEnd={handleDragEnd} />
    </div>
  );
}

function TaskForm({ addTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submitTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={submitTask} className="mb-4 w-full max-w-lg">
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Task title" 
        className="mb-2 w-full p-2 border rounded"
      />
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Description" 
        className="mb-2 w-full p-2 border rounded"
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
}

function KanbanBoard({ tasks, setTasks, onDragStart, onDragEnter, onDragEnd }) {
  return (
    <div className="flex flex-col sm:flex-row w-full">
      {statuses.map(status => (
        <Column key={status} status={status} tasks={tasks.filter(t => t.status === status)} 
                setTasks={setTasks} onDragStart={onDragStart} onDragEnter={onDragEnter} onDragEnd={onDragEnd} />
      ))}
    </div>
  );
}

function Column({ status, tasks, setTasks, onDragStart, onDragEnter, onDragEnd }) {
  const colorClass = {
    'backlog': 'bg-red-200',
    'doing': 'bg-yellow-200',
    'review': 'bg-green-200',
    'done': 'bg-blue-200'
  };

  return (
    <div className={`flex-1 m-2 p-2 rounded ${colorClass[status]}`}>
      <h2 className="text-center font-bold">{status.toUpperCase()}</h2>
      <div className="min-h-[100px]">
        {tasks.map((task, index) => (
          <Task key={task.title} task={task} index={index} setTasks={setTasks} 
                onDragStart={onDragStart} onDragEnter={onDragEnter} onDragEnd={onDragEnd} />
        ))}
      </div>
    </div>
  );
}

function Task({ task, index, setTasks, onDragStart, onDragEnter, onDragEnd }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(task.description);

  const saveEdit = () => {
    setTasks(prevTasks => 
      prevTasks.map((t, idx) => idx === index ? {...t, description: editDescription} : t)
    );
    setIsEditing(false);
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, index)} 
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      className="my-2 p-2 border rounded shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
    >
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full" />
          ) : (
            <p>{task.description}</p>
          )}
        </CardContent>
        <CardFooter>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button onClick={saveEdit} disabled={task.description === editDescription}>Save</Button>
              <Button onClick={() => { setIsEditing(false); setEditDescription(task.description); }}>Discard</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;