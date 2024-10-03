import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Button,
} from '@/components/ui/button';
import {
  Input,
} from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const CustomCheckbox = ({ checked, onChange, label, color }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    <div 
      className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
        checked ? 'bg-opacity-100' : 'bg-opacity-0'
      }`}
      style={{ backgroundColor: checked ? color : 'transparent', borderColor: color }}
    >
      {checked && <span className="text-white text-xs">✓</span>}
    </div>
    <span>{label}</span>
  </label>
);

const App = () => {
  const [habits, setHabits] = useState([]);
  const [trackingData, setTrackingData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentHabit, setCurrentHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({ name: '', color: '#a855f7' });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  useEffect(() => {
    setTrackingData((prevData) => {
      const initialData = { ...prevData };
      for (let day = 1; day <= daysInMonth; day++) {
        if (!initialData[day]) {
          initialData[day] = {};
        }
        habits.forEach((habit) => {
          if (!(habit.id in initialData[day])) {
            initialData[day][habit.id] = false;
          }
        });
      }
      return initialData;
    });
  }, [habits, daysInMonth]);

  const toggleHabit = useCallback((dayIndex, habitId) => {
    setTrackingData((prevData) => {
      const newData = { ...prevData };
      if (!newData[dayIndex]) {
        newData[dayIndex] = {};
      }
      newData[dayIndex] = {
        ...newData[dayIndex],
        [habitId]: !newData[dayIndex][habitId]
      };
      return newData;
    });
  }, []);

  const addHabit = () => {
    if (newHabit.name.trim() === '') return;
    const id = Date.now().toString();
    setHabits([...habits, { ...newHabit, id }]);
    setNewHabit({ name: '', color: '#a855f7' });
    setIsDialogOpen(false);
  };

  const updateHabit = () => {
    if (newHabit.name.trim() === '') return;
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === currentHabit.id ? { ...habit, ...newHabit } : habit
      )
    );
    setNewHabit({ name: '', color: '#a855f7' });
    setIsEditDialogOpen(false);
    setCurrentHabit(null);
  };

  const removeHabit = (habitId) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId));
    setTrackingData((prevData) => {
      const newData = { ...prevData };
      Object.keys(newData).forEach((day) => {
        delete newData[day][habitId];
      });
      return newData;
    });
  };

  const calculateStreak = (habitId) => {
    let streak = 0;
    for (let day = daysInMonth; day >= 1; day--) {
      if (trackingData[day]?.[habitId]) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  };

  const renderWheel = () => {
    const baseRadius = 150;
    const center = 200;
    const segmentAngle = 360 / daysInMonth;
  
    return (
      <svg width={400} height={400} className="mx-auto">
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const dayNumber = dayIndex + 1;
          const startAngle = segmentAngle * dayIndex - 90;
          const endAngle = startAngle + segmentAngle;
  
          const dayHabits = trackingData[dayNumber] || {};
          const completedHabits = Object.entries(dayHabits).filter(([_, completed]) => completed);
  
          let slices;
          if (completedHabits.length === 0) {
            slices = [(
              <path
                key={`slice-${dayIndex}`}
                d={`M${center},${center} L${center + baseRadius * Math.cos((startAngle * Math.PI) / 180)},${center + baseRadius * Math.sin((startAngle * Math.PI) / 180)} A${baseRadius},${baseRadius} 0 0,1 ${center + baseRadius * Math.cos((endAngle * Math.PI) / 180)},${center + baseRadius * Math.sin((endAngle * Math.PI) / 180)} Z`}
                fill="#e5e7eb"
                stroke="#ffffff"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            )];
          } else {
            const subSliceAngle = segmentAngle / completedHabits.length;
            slices = completedHabits.map(([habitId, _], index) => {
              const subStartAngle = startAngle + subSliceAngle * index;
              const subEndAngle = subStartAngle + subSliceAngle;
  
              const x1 = center + baseRadius * Math.cos((subStartAngle * Math.PI) / 180);
              const y1 = center + baseRadius * Math.sin((subStartAngle * Math.PI) / 180);
              const x2 = center + baseRadius * Math.cos((subEndAngle * Math.PI) / 180);
              const y2 = center + baseRadius * Math.sin((subEndAngle * Math.PI) / 180);
  
              const largeArcFlag = subSliceAngle > 180 ? 1 : 0;
  
              const habit = habits.find(h => h.id === habitId);
  
              return (
                <path
                  key={`slice-${dayIndex}-${index}`}
                  d={`M${center},${center} L${x1},${y1} A${baseRadius},${baseRadius} 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                  fill={habit?.color || '#e5e7eb'}
                  stroke="#ffffff"
                  strokeWidth="1"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              );
            });
          }
  
          return (
            <Popover key={`popover-${dayIndex}`}>
              <PopoverTrigger asChild>
                <g>{slices}</g>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2">
                  <h3 className="font-semibold mb-2">Day {dayNumber}</h3>
                  {habits.map((habit) => (
                    <div key={habit.id} className="mb-1">
                      <CustomCheckbox
                        checked={dayHabits[habit.id] || false}
                        onChange={() => toggleHabit(dayNumber, habit.id)}
                        label={habit.name}
                        color={habit.color}
                      />
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
  
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const dayNumber = dayIndex + 1;
          const angle = (segmentAngle * dayIndex - 90 + segmentAngle / 2) * (Math.PI / 180);
          const textRadius = baseRadius + 20;
          const x = center + textRadius * Math.cos(angle);
          const y = center + textRadius * Math.sin(angle);
          return (
            <text
              key={`label-${dayIndex}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {dayNumber}
            </text>
          );
        })}
      </svg>
    );
  };

  const renderLegend = () => (
    <div className="mt-6 flex flex-wrap justify-center space-x-4">
      {habits.map((habit) => (
        <div key={habit.id} className="flex items-center space-x-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: habit.color }}
          ></span>
          <span>{habit.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Habit Wheel</CardTitle>
          <CardDescription className="text-sm">
            Track your habits visually for {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div className="flex items-center space-x-2">
              <Button onClick={() => setIsDialogOpen(true)} className="flex items-center">
                <span className="mr-2">➕</span> Add Habit
              </Button>
            </div>
          </div>

          {habits.length === 0 ? (
            <div className="text-center text-gray-500">No habits added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              {renderWheel()}
              {renderLegend()}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {habits.map((habit) => (
                  <Card key={habit.id} className="flex items-center p-4">
                    <span
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: habit.color }}
                    ></span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{habit.name}</span>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentHabit(habit);
                              setNewHabit({ name: habit.name, color: habit.color });
                              setIsEditDialogOpen(true);
                            }}
                            aria-label={`Edit ${habit.name}`}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHabit(habit.id)}
                            aria-label={`Remove ${habit.name}`}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Streak: {calculateStreak(habit.id)} day(s)
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Enter the details of the habit you want to track.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Habit Name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Color
              </label>
              <input
                type="color"
                value={newHabit.color}
                onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                className="w-full h-10 border rounded"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addHabit}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Modify the details of your habit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Habit Name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Color
              </label>
              <input
                type="color"
                value={newHabit.color}
                onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                className="w-full h-10 border rounded"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateHabit}>Update</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;