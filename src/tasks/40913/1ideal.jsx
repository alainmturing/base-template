import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const statuses = [
  { id: 'backlog', title: 'Backlog', color: 'bg-red-500' },
  { id: 'doing', title: 'Doing', color: 'bg-yellow-500' },
  { id: 'inReview', title: 'In Review', color: 'bg-green-500' },
  { id: 'done', title: 'Done', color: 'bg-blue-500' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const draggedTaskId = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addTask = () => {
    if (newTaskTitle.trim() === '') return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'backlog',
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const updateTaskStatus = (id, status) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const updateTaskDescription = (id, description) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, description } : task
      )
    );
  };

  const handleDragStart = (e, id) => {
    if (isMobile) return;
    draggedTaskId.current = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    e.target.classList.add('opacity-50', 'scale-105');
  };

  const handleDragEnd = (e) => {
    if (isMobile) return;
    e.target.classList.remove('opacity-50', 'scale-105');
  };

  const handleDragOver = (e) => {
    if (isMobile) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    if (isMobile) return;
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    updateTaskStatus(Number(id), status);
    draggedTaskId.current = null;
  };

  const handleMobileMove = (taskId, currentStatus) => {
    const currentStatusIndex = statuses.findIndex(s => s.id === currentStatus);
    const nextStatus = statuses[(currentStatusIndex + 1) % statuses.length].id;
    updateTaskStatus(taskId, nextStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="mb-6 shadow-lg sticky top-0 z-10 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <Input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Task Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addTask} className="w-full sm:w-auto">
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="min-h-[300px] overflow-y-auto"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <Card className={`h-full ${status.color} text-white shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{status.title}</CardTitle>
              </CardHeader>
              <CardContent className="h-full pb-4">
                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.status === status.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        draggable={!isMobile}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className="cursor-move transition-all duration-200 ease-in-out"
                      >
                        <TaskCard
                          task={task}
                          updateTaskDescription={updateTaskDescription}
                          isMobile={isMobile}
                          onMobileMove={() => handleMobileMove(task.id, task.status)}
                        />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, updateTaskDescription, isMobile, onMobileMove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(task.description);
  const textareaRef = useRef(null);
  const saveButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(event.target) &&
        (!saveButtonRef.current || !saveButtonRef.current.contains(event.target))
      ) {
        handleDiscard();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    setDesc(task.description);
  }, [task.description]);

  const handleSave = () => {
    if (desc.trim() !== '') {
      updateTaskDescription(task.id, desc);
    }
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setDesc(task.description);
    setIsEditing(false);
  };

  return (
    <Card className="bg-white text-black shadow-md rounded-lg transition-all duration-200 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold break-words">{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full resize-none"
            rows={3}
            autoFocus
          />
        ) : (
          <CardDescription
            onClick={() => setIsEditing(true)}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200 break-words"
          >
            {task.description || 'No description'}
          </CardDescription>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          <Button
            ref={saveButtonRef}
            onClick={handleSave}
            variant="default"
            size="sm"
          >
            Save
          </Button>
          <Button onClick={handleDiscard} variant="destructive" size="sm">
            Discard
          </Button>
        </CardFooter>
      )}
      {isMobile && (
        <CardFooter>
          <Button onClick={onMobileMove} variant="outline" size="sm" className="w-full">
            Move to Next Status
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

