import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [habits, setHabits] = useState([]);
  const [currentHabit, setCurrentHabit] = useState('');
  const [currentColor, setCurrentColor] = useState('#0070f3');
  const [today] = useState(new Date());
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const addHabit = () => {
    if (currentHabit && !habits.some(h => h.name === currentHabit)) {
      setHabits([...habits, { name: currentHabit, color: currentColor, completed: Array(daysInMonth).fill(false) }]);
      setCurrentHabit('');
    }
  };

  const removeHabit = (habitName) => {
    setHabits(habits.filter(h => h.name !== habitName));
  };

  const toggleHabit = (dayIndex, habitIndex) => {
    const updatedHabits = habits.map((habit, index) => {
      if (index === habitIndex) {
        const updatedCompleted = [...habit.completed];
        updatedCompleted[dayIndex] = !updatedCompleted[dayIndex];
        return { ...habit, completed: updatedCompleted };
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg p-4 sm:p-6">
        <CardHeader>
          <CardTitle>Habit Wheel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <Input 
                value={currentHabit} 
                onChange={(e) => setCurrentHabit(e.target.value)} 
                placeholder="New Habit"
              />
              <Input 
                type="color" 
                value={currentColor} 
                onChange={(e) => setCurrentColor(e.target.value)} 
              />
              <Button onClick={addHabit}>Add Habit</Button>
            </div>
            <HabitWheel habits={habits} days={daysInMonth} onToggle={toggleHabit} />
            <div className="flex flex-wrap">
              {habits.map((habit, idx) => (
                <div key={idx} className="flex items-center space-x-2 m-2">
                  <div style={{ backgroundColor: habit.color }} className="w-4 h-4 rounded-full"></div>
                  <span>{habit.name}</span>
                  <Button onClick={() => removeHabit(habit.name)} size="sm" variant="destructive">Remove</Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HabitWheel({ habits, days, onToggle }) {
  const anglePerDay = 360 / days;

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div className="w-64 h-64 rounded-full border-2 border-dashed">
        {Array.from({ length: days }, (_, dayIndex) => (
          <HabitSegment 
            key={dayIndex} 
            dayIndex={dayIndex} 
            habits={habits} 
            angle={anglePerDay * dayIndex} 
            width={360 / days} 
            onToggle={onToggle} 
          />
        ))}
      </div>
    </div>
  );
}

function HabitSegment({ dayIndex, habits, angle, width, onToggle }) {
  const segmentAngle = width / habits.length;

  return (
    <div 
      style={{ 
        transform: `rotate(${angle}deg)`, 
        transformOrigin: 'right center'
      }} 
      className="absolute h-full w-1/2 right-0"
    >
      {habits.map((habit, hIndex) => (
        <div 
          key={hIndex}
          style={{ 
            width: `${100 / habits.length}%`, 
            transform: `rotate(${segmentAngle * hIndex}deg)`, 
            height: '100%', 
            backgroundColor: habit.completed[dayIndex] ? habit.color : 'transparent',
            borderRight: '1px solid #e5e7eb'
          }}
          className="absolute top-0 right-0 cursor-pointer"
          onClick={() => onToggle(dayIndex, habits.indexOf(habit))}
        ></div>
      ))}
    </div>
  );
}

export default App;