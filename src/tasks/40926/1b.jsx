import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Helper function to format time
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerSettings = ({ settings, updateSettings, invalidRounds }) => (
  <Card className="mb-4">
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-bold">Rounds</label>
          <div className="flex items-center">
            <Button onClick={() => updateSettings('rounds', -1)}>-</Button>
            <Input 
              value={settings.rounds} 
              onChange={(e) => updateSettings('rounds', e.target.value)} 
              className={`${invalidRounds ? 'border-red-500' : ''}`}
            />
            <Button onClick={() => updateSettings('rounds', 1)}>+</Button>
          </div>
        </div>
        {/* Similar setup for Round Time and Rest Time */}
      </div>
    </CardContent>
  </Card>
);

const TimerDisplay = ({ timeLeft, currentRound, totalRounds }) => (
  <div className="text-center text-4xl mb-4">
    {formatTime(timeLeft)} - Round {currentRound} of {totalRounds}
  </div>
);

const ControlButtons = ({ onStart, onPause, onResume, onReset, isRunning, isPaused }) => (
  <div className="flex space-x-4 justify-center">
    {!isRunning && <Button onClick={onStart}>Start</Button>}
    {isRunning && <Button variant="outline" onClick={isPaused ? onResume : onPause}>
      {isPaused ? 'Resume' : 'Pause'}
    </Button>}
    {isRunning && <Button variant="destructive" onClick={onReset}>Reset</Button>}
  </div>
);

export default function App() {
  const [settings, setSettings] = useState({
    rounds: 12,
    roundTime: 180, // 3 minutes
    restTime: 60, // 1 minute
  });
  const [timeLeft, setTimeLeft] = useState(settings.roundTime);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          if (isRest || currentRound === settings.rounds) {
            if (isRest) setCurrentRound(round => round + 1);
            setIsRest(!isRest);
            setTimeLeft(isRest ? settings.roundTime : settings.restTime);
            if (currentRound > settings.rounds) {
              setIsRunning(false);
            }
          } else {
            setIsRest(true);
            setTimeLeft(settings.restTime);
          }
        }
      }, 1000);
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isRunning, isPaused, currentRound, settings]);

  const updateSettings = (field, value) => {
    setSettings(prev => ({...prev, [field]: Math.max(field === 'rounds' ? 1 : 0, parseInt(prev[field] + value))}));
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(settings.roundTime);
    setCurrentRound(1);
    setIsRest(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-4">Boxing Timer</h1>
        <TimerSettings settings={settings} updateSettings={updateSettings} invalidRounds={settings.rounds < 1} />
        <TimerDisplay timeLeft={timeLeft} currentRound={currentRound} totalRounds={settings.rounds} />
        <ControlButtons 
          onStart={handleStart} 
          onPause={handlePause} 
          onResume={handleResume} 
          onReset={handleReset}
          isRunning={isRunning} 
          isPaused={isPaused} 
        />
      </div>
    </div>
  );
}