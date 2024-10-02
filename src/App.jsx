import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [rounds, setRounds] = useState(12);
  const [roundMinutes, setRoundMinutes] = useState(3);
  const [roundSeconds, setRoundSeconds] = useState(0);
  const [restMinutes, setRestMinutes] = useState(1);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180000); // Initial time in ms for 3 minutes
  const timerIdRef = useRef(null);

  useEffect(() => {
    if (isRunning && !isResting) {
      if (timeLeft > 0) {
        timerIdRef.current = setTimeout(() => {
          setTimeLeft(prevTime => prevTime - 1000);
        }, 1000);
      } else {
        if (currentRound < rounds) {
          setIsResting(true);
          setTimeLeft(restMinutes * 60000 + restSeconds * 1000);
          setCurrentRound(prev => prev + 1);
        } else {
          setIsRunning(false);
        }
      }
    } else if (isRunning && isResting) {
      if (timeLeft > 0) {
        timerIdRef.current = setTimeout(() => {
          setTimeLeft(prevTime => prevTime - 1000);
        }, 1000);
      } else {
        setIsResting(false);
        setTimeLeft(roundMinutes * 60000 + roundSeconds * 1000);
      }
    }

    return () => clearTimeout(timerIdRef.current);
  }, [timeLeft, isRunning, isResting, currentRound, rounds]);

  const startTimer = () => {
    setIsRunning(true);
    setTimeLeft(roundMinutes * 60000 + roundSeconds * 1000);
  };

  const pauseResumeTimer = () => {
    if (isRunning) {
      clearTimeout(timerIdRef.current);
    } else if (!isResting || currentRound < rounds) {
      startTimer();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    clearTimeout(timerIdRef.current);
    setIsRunning(false);
    setIsResting(false);
    setCurrentRound(0);
    setTimeLeft(roundMinutes * 60000 + roundSeconds * 1000);
  };

  const formatTime = (timeMs) => {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = ((timeMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleIncrement = (setter, max = Infinity) => () => setter(prev => Math.min(prev + 1, max));
  const handleDecrement = (setter, min = 0) => () => setter(prev => Math.max(prev - 1, min));

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg mb-4">
        <h1 className="text-2xl font-bold text-center">Boxing Rounds Timer</h1>
      </div>
      <div className="sm:max-w-md sm:mx-auto bg-white p-4 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rounds</label>
            <div className="flex items-center">
              <Button onClick={handleDecrement(setRounds, 1)}>-</Button>
              <Input 
                type="number" 
                value={rounds} 
                onChange={e => setRounds(e.target.value)} 
                className={`w-20 text-center ${rounds === 0 ? 'border-red-500' : ''}`}
              />
              <Button onClick={handleIncrement(setRounds)}>+</Button>
            </div>
            {rounds === 0 && <p className="text-xs text-red-500">Rounds cannot be 0</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1"><b>Round Time</b></label>
            <div className="flex">
              <Input type="number" value={roundMinutes} onChange={e => setRoundMinutes(e.target.value)} className="w-20" />
              <span className="mx-2 font-bold">min</span>
              <Input type="number" value={roundSeconds} onChange={e => setRoundSeconds(e.target.value)} className="w-20" />
              <span className="font-bold">sec</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1"><b>Rest Time</b></label>
            <div className="flex">
              <Input type="number" value={restMinutes} onChange={e => setRestMinutes(e.target.value)} className="w-20" />
              <span className="mx-2 font-bold">min</span>
              <Input type="number" value={restSeconds} onChange={e => setRestSeconds(e.target.value)} className="w-20" />
              <span className="font-bold">sec</span>
            </div>
          </div>
          {!isRunning ? (
            <Button onClick={startTimer} className="w-full bg-blue-500 hover:bg-blue-600">Start</Button>
          ) : (
            <>
              <Button onClick={pauseResumeTimer} className="w-full mb-2 bg-yellow-500 hover:bg-yellow-600">
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button onClick={resetTimer} className="w-full bg-gray-500 hover:bg-gray-600">Reset</Button>
            </>
          )}
          <div className="text-center text-2xl font-bold">
            {isResting ? "Rest" : `Round ${currentRound}/${rounds}`}
            <div>{formatTime(timeLeft)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}