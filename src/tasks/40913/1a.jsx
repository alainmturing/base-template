import React, { useState, useRef, useEffect } from 'react';
//model tried importing Button from @/components/ui/card
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDrop = () => {
    const copyTasks = [...tasks];
    const dragItemContent = copyTasks[dragItem.current];
    copyTasks.splice(dragItem.current, 1);
    copyTasks.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(copyTasks);
  };

  const addTask = () => {
    if (newTask.title) {
      setTasks([...tasks, { ...newTask, status: 'backlog' }]);
      setNewTask({ title: '', description: '' });
    }
  };

  const moveTask = (index, direction) => {
    const newStatus = ['backlog', 'doing', 'review', 'done'][['backlog', 'doing', 'review', 'done'].indexOf(tasks[index].status) + direction];
    if (newStatus) {
      const updatedTasks = [...tasks];
      updatedTasks[index] = { ...updatedTasks[index], status: newStatus };
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className="w-full max-w-3xl">
        <Input 
          value={newTask.title} 
          onChange={e => setNewTask({...newTask, title: e.target.value})} 
          placeholder="Task Title" 
          className="mb-2"
        />
        <Textarea 
          value={newTask.description} 
          onChange={e => setNewTask({...newTask, description: e.target.value})} 
          placeholder="Task Description"
        />
        <Button onClick={addTask}>Add Task</Button>
      </div>
      <KanbanBoard tasks={tasks} onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDrop={handleDrop} moveTask={moveTask} />
    </div>
  );
}

function KanbanBoard({ tasks, onDragStart, onDragEnter, onDrop, moveTask }) {
  const columns = ['backlog', 'doing', 'review', 'done'];

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-5xl space-y-4 sm:space-y-0 sm:space-x-4">
      {columns.map(status => (
        <Column 
          key={status} 
          status={status} 
          tasks={tasks.filter(t => t.status === status)} 
          onDragStart={onDragStart} 
          onDragEnter={onDragEnter} 
          onDrop={onDrop}
          moveTask={moveTask}
        />
      ))}
    </div>
  );
}

function Column({ status, tasks, onDragStart, onDragEnter, onDrop, moveTask }) {
  const colorClass = {
    'backlog': 'bg-red-100',
    'doing': 'bg-yellow-100',
    'review': 'bg-green-100',
    'done': 'bg-blue-100'
  }[status];

  return (
    <div className={`flex-1 p-4 rounded-lg ${colorClass}`} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <h2 className="text-lg font-semibold mb-2">{status.toUpperCase()}</h2>
      {tasks.map((task, index) => (
        <Task 
          key={index} 
          task={task} 
          index={index} 
          onDragStart={onDragStart} 
          onDragEnter={onDragEnter}
          moveTask={moveTask}
        />
      ))}
    </div>
  );
}

function Task({ task, index, onDragStart, onDragEnter, moveTask }) {
  const [editing, setEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(editedDescription !== task.description);
  }, [editedDescription, task.description]);

  return (
    <Card className="mb-2 p-2 cursor-move" draggable onDragStart={(e) => onDragStart(e, index)} onDragEnter={(e) => onDragEnter(e, index)}>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div>
            <Textarea 
              value={editedDescription} 
              onChange={e => setEditedDescription(e.target.value)} 
              className="mb-2"
            />
            {hasChanges && (
              <div className="flex space-x-2">
                <Button onClick={() => {setEditing(false); setEditedDescription(task.description);}}>Discard</Button>
                <Button onClick={() => {setEditing(false); /* Here you would typically save changes to state or server */ }}>Save</Button>
              </div>
            )}
          </div>
        ) : (
          <CardDescription onClick={() => setEditing(true)}>{task.description}</CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => moveTask(index, -1)} disabled={task.status === 'backlog'}>Previous</Button>
        <Button variant="outline" onClick={() => moveTask(index, 1)} disabled={task.status === 'done'}>Next</Button>
      </CardFooter>
    </Card>
  );
}