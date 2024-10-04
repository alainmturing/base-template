// App.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';

// Extracted Components

const PieChart = ({ percentage, color }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="120" height="120" className="mx-auto">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth="10"
        r={radius}
        cx="60"
        cy="60"
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth="10"
        strokeLinecap="round"
        r={radius}
        cx="60"
        cy="60"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transition: 'stroke-dashoffset 0.5s ease',
        }}
      />
      <text
        x="60"
        y="65"
        textAnchor="middle"
        className="text-xl font-semibold fill-current text-gray-800"
      >
        {percentage}%
      </text>
    </svg>
  );
};

const ProgressDisplay = ({ goal, logs }) => {
  const today = new Date().toDateString();
  const log = logs.find((log) => log.date === today);
  const value = log ? log.value : 0;
  const goalValue = goal.value !== '' ? Number(goal.value) : 1; // Prevent division by zero
  const percentage = Math.min(((value / goalValue) * 100).toFixed(2), 100);

  return (
    <Card className="mb-4 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-indigo-600">Today's Progress</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {value} / {goal.value !== '' ? goal.value : '--'} {goal.unit}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Progress
          value={percentage}
          className="w-full mb-4 bg-gray-200"
          style={{ height: '10px' }}
        />
        <PieChart percentage={percentage} color="#6366f1" />
      </CardContent>
    </Card>
  );
};

const GoalSetter = ({
  newGoal,
  setNewGoal,
  handleSaveGoal,
}) => {
  const handleGoalChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      setNewGoal({ ...newGoal, value });
    }
  };

  const handleUnitChange = (unit) => {
    setNewGoal({ ...newGoal, unit });
  };

  return (
    <Card className="mb-4 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-green-600">Set Daily Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Input
            type="number"
            value={newGoal.value}
            onChange={handleGoalChange}
            className="mb-2 sm:mb-0"
            placeholder="Enter goal"
            min="1"
            aria-label="Daily goal input"
          />
          <Select value={newGoal.unit} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pages">Pages</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSaveGoal}
            disabled={newGoal.value === ''}
            className="bg-green-500 hover:bg-green-600"
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const LogEntry = ({
  currentDate,
  setCurrentDate,
  currentLog,
  setCurrentLog,
  handleSaveLog,
}) => {
  const handleLogChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]\d*$/.test(value)) {
      setCurrentLog(value);
    }
  };

  return (
    <Card className="mb-4 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-blue-600">Log Reading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="mb-2 sm:mb-0">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => {
                if (date) setCurrentDate(date);
              }}
              className="border rounded-md p-2"
            />
          </div>
          <Input
            type="number"
            value={currentLog}
            onChange={handleLogChange}
            placeholder={`Pages / Minutes`}
            className="mb-2 sm:mb-0"
            min="0"
            aria-label="Reading log input"
          />
          <Button
            onClick={handleSaveLog}
            disabled={currentLog === ''}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const History = ({ logs }) => {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-purple-600">Reading History</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedLogs.length === 0 ? (
          <p className="text-gray-500">No logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {sortedLogs.map((log) => {
              const percentage = Math.min(
                ((log.value / (log.goalValue !== '' ? Number(log.goalValue) : 1)) *
                  100).toFixed(2),
                100
              );
              return (
                <li
                  key={log.date}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span className="text-gray-700">{log.date}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {log.value} / {log.goalValue !== '' ? log.goalValue : '--'}{' '}
                      {log.unit}
                    </span>
                    <div className="w-24">
                      <Progress
                        value={percentage}
                        className="bg-gray-200"
                        style={{ height: '6px' }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

// Main App Component

export default function App() {
  const [goal, setGoal] = useState({ value: '', unit: 'pages' });
  const [newGoal, setNewGoal] = useState({ value: '', unit: 'pages' });
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentLog, setCurrentLog] = useState('');

  const handleSaveGoal = () => {
    if (newGoal.value !== '') {
      setGoal({ ...newGoal });
    }
  };

  const handleSaveLog = () => {
    if (currentLog === '') return;
    const dateStr = currentDate.toDateString();
    const existingLog = logs.find((log) => log.date === dateStr);
    if (existingLog) {
      setLogs(
        logs.map((log) =>
          log.date === dateStr ? { ...log, value: Number(currentLog) } : log
        )
      );
    } else {
      setLogs([
        ...logs,
        {
          date: dateStr,
          value: Number(currentLog),
          goalValue: goal.value,
          unit: goal.unit,
        },
      ]);
    }
    setCurrentLog('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-700">
              Daily Reading Goal Tracker
            </CardTitle>
            <CardDescription className="text-gray-600">
              Track your reading progress by pages or minutes each day.
            </CardDescription>
          </CardHeader>
        </Card>
        <GoalSetter
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          handleSaveGoal={handleSaveGoal}
        />
        <LogEntry
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          currentLog={currentLog}
          setCurrentLog={setCurrentLog}
          handleSaveLog={handleSaveLog}
        />
        <ProgressDisplay goal={goal} logs={logs} />
        <History logs={logs} />
      </div>
    </div>
  );
}
