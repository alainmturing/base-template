// App.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//MODEL IS TRYING TO IMPORT COMPONENTS FROM FILE
// import GoalSetter from './components/GoalSetter';
// import ProgressDisplay from './components/ProgressDisplay';
// import LogEntry from './components/LogEntry';
// import Calendar from './components/Calendar';
// import LogList from './components/LogList';

export default function App() {
  const [goal, setGoal] = useState(30); // Default goal in pages or minutes
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const updateGoal = (newGoal) => setGoal(newGoal);

  const logReading = (amount) => {
    const newLog = {
      date: selectedDate.toISOString().split('T')[0],
      amount: amount,
      goalAtTime: goal,
    };
    setLogs(prevLogs => [newLog, ...prevLogs].sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Daily Reading Goal Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalSetter onUpdate={updateGoal} currentGoal={goal} />
          <ProgressDisplay goal={goal} currentProgress={logs[0]?.amount || 0} />
          <LogEntry onSubmit={logReading} date={selectedDate} />
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </CardContent>
      </Card>
      <LogList logs={logs} />
    </div>
  );
}

// Additional components like GoalSetter, ProgressDisplay, etc. would follow here