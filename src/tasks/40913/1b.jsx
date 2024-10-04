import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const initialTasks = [
  { id: '1', title: 'Initial Task', description: 'This is a task in backlog', status: 'backlog' },
];

function Task({ task, onUpdate, onMove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);

  return (
    <Card className="mb-2 w-64 shadow-lg">
      <CardHeader className={`bg-${task.status}-500 text-white`}>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea 
            value={editedDescription} 
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full h-24 p-2 border"
          />
        ) : (
          <p>{editedDescription}</p>
        )}
        {isEditing ? (
          <div className="flex justify-end">
            <Button onClick={() => { setIsEditing(false); onUpdate(task.id, editedDescription); }}>Save</Button>
            <Button onClick={() => { setIsEditing(false); setEditedDescription(task.description); }}>Discard</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </CardContent>
    </Card>
  );
}

function Column({ status, children, onDrop }) {
  return (
    <div className="flex-1 p-2">
      <h2 className="text-center mb-2 text-lg font-bold">{status}</h2>
      <div onDrop={onDrop} onDragOver={(e) => e.preventDefault()} className="min-h-[300px] border-2 border-dashed p-2">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(t => 
      t.id === id ? {...t, status: newStatus} : t
    ));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskId = tasks[source.index].id;
    moveTask(taskId, destination.droppableId);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {['backlog', 'doing', 'review', 'done'].map(status => (
          <Column key={status} status={status} onDrop={() => {}}>
            {tasks.filter(t => t.status === status).map((task, index) => (
              <div key={task.id} draggable 
                onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
                onDragEnd={handleDragEnd}
                className="drag-item">
                <Task task={task} onUpdate={(id, desc) => {
                  setTasks(tasks.map(t => t.id === id ? {...t, description: desc} : t));
                }} />
              </div>
            ))}
          </Column>
        ))}
      </div>
    </div>
  );
}