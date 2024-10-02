// App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { format, eachDayOfInterval, getDaysInMonth, startOfMonth } from 'date-fns';

// Helper function to generate color palette
const generateColor = (index) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  return colors[index % colors.length];
};

function HabitWheel({ habits, days, onUpdateHabit }) {
  return (
    <div className="grid grid-cols-7 gap-2 p-4">
      {days.map((day, index) => {
        const dayHabits = habits.filter(h => h.dates.includes(day));
        const angle = 360 / days.length;
        const transform = `rotate(${angle * index - 90}deg)`;
        
        return (
          <div key={day} style={{ transform }} className="transform origin-center">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              {dayHabits.length > 0 ? (
                <div style={{ transform: `rotate(${-angle * index}deg)` }}>
                  <div className="flex">
                    {dayHabits.map((habit, hIndex) => (
                      <div key={hIndex} 
                           className="h-2 w-3 rounded-l-full rounded-r-full" 
                           style={{ backgroundColor: habit.color, width: `${100 / dayHabits.length}%` }}
                           onClick={() => onUpdateHabit(habit.id, day)} />
                    ))}
                  </div>
                </div>
              ) : <span className="text-xs">{format(new Date(day), 'd')}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [habits, setHabits] = useState([]);
  const now = new Date();
  const start = startOfMonth(now);
  const days = useMemo(() => eachDayOfInterval({ start, end: new Date(now.getFullYear(), now.getMonth() + 1, 0) }), [now]);

  const addHabit = (name, color) => {
    setHabits(prev => [...prev, { id: Date.now(), name, color, dates: [] }]);
  };

  const updateHabit = (id, date) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id ? { 
          ...habit, 
          dates: habit.dates.includes(date) ? habit.dates.filter(d => d !== date) : [...habit.dates, date] 
        } : habit
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Habit Wheel</CardTitle>
        </CardHeader>
        <CardContent>
          <HabitWheel habits={habits} days={days} onUpdateHabit={updateHabit} />
          <div className="mt-4">
            {habits.map((habit, idx) => (
              <div key={habit.id} className="flex items-center mb-2">
                <div style={{ backgroundColor: habit.color }} className="w-4 h-4 mr-2 rounded"></div>
                <span>{habit.name}</span>
              </div>
            ))}
            <Button onClick={() => addHabit('New Habit', generateColor(habits.length))}>Add Habit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;