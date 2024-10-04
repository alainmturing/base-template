import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

function App() {
  const [goal, setGoal] = useState({ pages: 50, minutes: 30 });
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Dummy data for demonstration
    if (logs.length === 0) {
      setLogs([
        { date: new Date(2023, 3, 1), pages: 20, minutes: 15, goalAtTime: { pages: 50, minutes: 30 } },
      ]);
    }
  }, []);

  const addLog = (type, value) => {
    const newLog = { 
      date: currentDate, 
      [type]: value, 
      goalAtTime: { ...goal }
    };
    setLogs(prevLogs => [newLog, ...prevLogs].sort((a, b) => b.date - a.date));
  };

  const updateGoal = (type, value) => {
    setGoal(prevGoal => ({ ...prevGoal, [type]: value }));
  };

  const currentLog = logs.find(log => log.date.toDateString() === currentDate.toDateString());

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Daily Reading Goal Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalSetting goal={goal} updateGoal={updateGoal} />
          <LogEntry addLog={addLog} />
          <Calendar 
            date={currentDate} 
            onDateChange={setCurrentDate} 
            className="mt-4"
          />
          <ProgressDisplay log={currentLog} goal={currentLog?.goalAtTime || goal} />
          <div className="mt-4">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-2">
                  <p>{log.date.toDateString()}: {log.pages} pages, {log.minutes} minutes</p>
                </div>
              ))
            ) : (
              <p>No logs yet. Start logging your reading!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GoalSetting({ goal, updateGoal }) {
  return (
    <div className="mb-4">
      <Input 
        type="number" 
        placeholder="Pages" 
        value={goal.pages} 
        onChange={(e) => updateGoal('pages', e.target.value)} 
        className="mr-2"
      />
      <Input 
        type="number" 
        placeholder="Minutes" 
        value={goal.minutes} 
        onChange={(e) => updateGoal('minutes', e.target.value)} 
      />
    </div>
  );
}

function LogEntry({ addLog }) {
  const [value, setValue] = useState('');
  const [type, setType] = useState('pages');

  return (
    <div className="mb-4">
      <Input 
        type="number" 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        placeholder="Enter pages or minutes"
      />
      <Button onClick={() => { addLog(type, parseInt(value, 10)); setValue(''); }}>
        Log Reading
      </Button>
      <select 
        onChange={(e) => setType(e.target.value)} 
        value={type} 
        className="ml-2 p-2 border rounded"
      >
        <option value="pages">Pages</option>
        <option value="minutes">Minutes</option>
      </select>
    </div>
  );
}

function ProgressDisplay({ log, goal }) {
  const progress = log ? 
    (log.pages / goal.pages * 100 || log.minutes / goal.minutes * 100) : 0;

  return (
    <div className="mt-4">
      <div className="h-4 bg-gray-200 rounded-full mb-2">
        <div style={{ width: `${progress}%` }} className="h-full bg-blue-500 rounded-full"></div>
      </div>
      <div className="w-24 h-24 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span>{progress.toFixed(0)}%</span>
        </div>
        <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
          <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3db" strokeWidth="3" strokeDasharray="100 100"></circle>
          <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${progress} ${100 - progress}`}></circle>
        </svg>
      </div>
    </div>
  );
}

export default App;