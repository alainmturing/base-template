import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // State Variables
  const [rounds, setRounds] = useState(3);
  const [roundMinutes, setRoundMinutes] = useState(3);
  const [roundSeconds, setRoundSeconds] = useState(0);
  const [restMinutes, setRestMinutes] = useState(1);
  const [restSeconds, setRestSeconds] = useState(30);
  const [error, setError] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRest, setIsRest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(roundMinutes * 60 + roundSeconds);
  const timerRef = useRef(null);

  // Effect to handle timer countdown
  useEffect(() => {
    if (timerRunning && !timerPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(timerRef.current);
            if (isRest) {
              if (currentRound < rounds) {
                setCurrentRound(currentRound + 1);
                setIsRest(false);
                return roundMinutes * 60 + roundSeconds;
              } else {
                // Timer complete
                setTimerRunning(false);
                return 0;
              }
            } else {
              setIsRest(true);
              return restMinutes * 60 + restSeconds;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [
    timerRunning,
    timerPaused,
    isRest,
    currentRound,
    rounds,
    roundMinutes,
    roundSeconds,
    restMinutes,
    restSeconds,
  ]);

  // Handlers for increment and decrement
  const handleDecrement = (setter, value) => {
    setter(value > 0 ? value - 1 : 0);
  };

  const handleIncrement = (setter, value) => {
    setter(value + 1);
  };

  // Validation for rounds
  useEffect(() => {
    if (rounds < 1) {
      setError(true);
    } else {
      setError(false);
    }
  }, [rounds]);

  // Start Timer
  const startTimer = () => {
    if (rounds < 1) {
      setError(true);
      return;
    }
    setTimerRunning(true);
    setTimerPaused(false);
    setCurrentRound(1);
    setIsRest(false);
    setTimeLeft(roundMinutes * 60 + roundSeconds);
  };

  // Pause Timer
  const pauseTimer = () => {
    setTimerPaused(true);
    clearInterval(timerRef.current);
  };

  // Resume Timer
  const resumeTimer = () => {
    setTimerPaused(false);
  };

  // Reset Timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerPaused(false);
    setCurrentRound(1);
    setIsRest(false);
    setTimeLeft(roundMinutes * 60 + roundSeconds);
  };

  // Format Time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-red-500 to-orange-500 py-4 mb-6">
        <h1 className="text-3xl text-white text-center font-bold">
          Boxing Rounds Timer
        </h1>
      </header>

      {/* Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Timer Settings</CardTitle>
          <CardDescription className="mt-2">
            Customize your boxing workout with our intuitive timer. Set rounds, work, and rest periods to match your training needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Guide */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Quick Guide</h3>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                  <li>Set your desired number of rounds</li>
                  <li>Adjust round and rest durations</li>
                  <li>Click 'Start' to begin your workout</li>
                  <li>Use 'Pause' and 'Resume' as needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rounds Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">Rounds</label>
            <div className="flex items-center">
              <Button
                type="button"
                onClick={() => handleDecrement(setRounds, rounds)}
                className="w-10 h-10 flex items-center justify-center"
              >
                -
              </Button>
              <input
                type="number"
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value, 10) || 0)}
                className={`w-16 text-center border ${
                  error ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                } rounded mx-2 appearance-none`}
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              />
              <Button
                type="button"
                onClick={() => handleIncrement(setRounds, rounds)}
                className="w-10 h-10 flex items-center justify-center"
              >
                +
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-1">
                Rounds must be at least 1.
              </p>
            )}
          </div>

          {/* Round Time Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Round Time (Work Period)
            </label>
            <div className="flex items-center space-x-4">
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Min</span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    onClick={() => handleDecrement(setRoundMinutes, roundMinutes)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={roundMinutes}
                    onChange={(e) => setRoundMinutes(parseInt(e.target.value, 10) || 0)}
                    className="w-12 h-10 text-center border border-gray-300 rounded mx-1 appearance-none flex items-center justify-center"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleIncrement(setRoundMinutes, roundMinutes)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Sec</span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    onClick={() => handleDecrement(setRoundSeconds, roundSeconds)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={roundSeconds}
                    onChange={(e) => setRoundSeconds(parseInt(e.target.value, 10) || 0)}
                    className="w-12 h-10 text-center border border-gray-300 rounded mx-1 appearance-none flex items-center justify-center"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleIncrement(setRoundSeconds, roundSeconds)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Rest Time Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Rest Time (Between Rounds)
            </label>
            <div className="flex items-center space-x-4">
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Min</span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    onClick={() => handleDecrement(setRestMinutes, restMinutes)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={restMinutes}
                    onChange={(e) => setRestMinutes(parseInt(e.target.value, 10) || 0)}
                    className="w-12 h-10 text-center border border-gray-300 rounded mx-1 appearance-none flex items-center justify-center"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleIncrement(setRestMinutes, restMinutes)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Sec</span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    onClick={() => handleDecrement(setRestSeconds, restSeconds)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={restSeconds}
                    onChange={(e) => setRestSeconds(parseInt(e.target.value, 10) || 0)}
                    className="w-12 h-10 text-center border border-gray-300 rounded mx-1 appearance-none flex items-center justify-center"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleIncrement(setRestSeconds, restSeconds)}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Timer Display */}
        {timerRunning && (
          <CardContent className="text-center">
            <h2 className="text-lg font-bold">
              {isRest ? 'Rest Time' : `Round ${currentRound}`}
            </h2>
            <p className="text-4xl font-mono mt-2">{formatTime(timeLeft)}</p>
          </CardContent>
        )}

        {/* Controls */}
        <CardContent className="flex justify-center space-x-4 mt-4">
          {!timerRunning && (
            <Button
              onClick={startTimer}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Start
            </Button>
          )}
          {timerRunning && (
            <>
              <Button
                onClick={timerPaused ? resumeTimer : pauseTimer}
                className={`${
                  timerPaused
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white px-4 py-2 rounded`}
              >
                {timerPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={resetTimer}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Reset
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}