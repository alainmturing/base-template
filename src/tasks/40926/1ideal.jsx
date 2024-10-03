import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function App() {
  const [rounds, setRounds] = useState(3);
  const [roundMinutes, setRoundMinutes] = useState(3);
  const [roundSeconds, setRoundSeconds] = useState(0);
  const [restMinutes, setRestMinutes] = useState(1);
  const [restSeconds, setRestSeconds] = useState(30);

  const [roundsError, setRoundsError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRest, setIsRest] = useState(false);

  // Initialize timeLeft when timer starts
  useEffect(() => {
    if (isRunning && !isPaused) {
      if (timeLeft === 0) {
        if (isRest) {
          if (currentRound > rounds) {
            // Timer completed
            setIsRunning(false);
            setIsPaused(false);
            setCurrentRound(1);
            return;
          }
          setTimeLeft(restMinutes * 60 + restSeconds);
          setIsRest(false);
        } else {
          if (currentRound > rounds) {
            // Timer completed
            setIsRunning(false);
            setIsPaused(false);
            setCurrentRound(1);
            return;
          }
          setTimeLeft(roundMinutes * 60 + roundSeconds);
          setIsRest(true);
        }
      }

      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [
    isRunning,
    isPaused,
    timeLeft,
    isRest,
    currentRound,
    rounds,
    roundMinutes,
    roundSeconds,
    restMinutes,
    restSeconds,
  ]);

  const handleStart = () => {
    if (validateRounds()) {
      setIsRunning(true);
      setIsPaused(false);
      setTimeLeft(roundMinutes * 60 + roundSeconds);
      setCurrentRound(1);
      setIsRest(false);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentRound(1);
    setTimeLeft(0);
    setIsRest(false);
    // Reset to initial values
  };

  const validateRounds = () => {
    if (rounds <= 0) {
      setRoundsError('Number of rounds must be greater than 0.');
      return false;
    }
    setRoundsError('');
    return true;
  };

  const increment = (setter, value) => {
    setter(value + 1);
  };

  const decrement = (setter, value) => {
    if (value > 0) {
      setter(value - 1);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full p-4 bg-gradient-to-r from-red-500 to-orange-500">
        <h1 className="text-white text-2xl font-bold text-center">
          Boxing Rounds Timer
        </h1>
      </header>
      <main className="flex-1 w-full max-w-md p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Number of Rounds */}
            <div className="mb-4">
              <Label htmlFor="rounds">Number of Rounds</Label>
              <div className="flex items-center mt-1">
                <input
                  type="number"
                  id="rounds"
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value))}
                  className={`w-full p-2 border ${
                    roundsError ? 'border-red-500' : 'border-gray-300'
                  } rounded`}
                />
              </div>
              {roundsError && (
                <p className="text-red-500 text-sm mt-1">{roundsError}</p>
              )}
            </div>
            {/* Round Time */}
            <div className="mb-4">
              <Label>Round Time</Label>
              <div className="flex items-center mt-1 space-x-2">
                {/* Minutes */}
                <div className="flex-1">
                  <Label htmlFor="roundMinutes">Minutes</Label>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        decrement(setRoundMinutes, roundMinutes)
                      }
                      className="px-2 py-1 bg-gray-200 rounded-l"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="roundMinutes"
                      value={roundMinutes}
                      onChange={(e) =>
                        setRoundMinutes(parseInt(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 text-center"
                    />
                    <button
                      onClick={() =>
                        increment(setRoundMinutes, roundMinutes)
                      }
                      className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Seconds */}
                <div className="flex-1">
                  <Label htmlFor="roundSeconds">Seconds</Label>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        decrement(setRoundSeconds, roundSeconds)
                      }
                      className="px-2 py-1 bg-gray-200 rounded-l"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="roundSeconds"
                      value={roundSeconds}
                      onChange={(e) =>
                        setRoundSeconds(parseInt(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 text-center"
                    />
                    <button
                      onClick={() =>
                        increment(setRoundSeconds, roundSeconds)
                      }
                      className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Rest Time */}
            <div className="mb-4">
              <Label>Rest Time</Label>
              <div className="flex items-center mt-1 space-x-2">
                {/* Minutes */}
                <div className="flex-1">
                  <Label htmlFor="restMinutes">Minutes</Label>
                  <div className="flex items-center">
                    <button
                      onClick={() => decrement(setRestMinutes, restMinutes)}
                      className="px-2 py-1 bg-gray-200 rounded-l"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="restMinutes"
                      value={restMinutes}
                      onChange={(e) =>
                        setRestMinutes(parseInt(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 text-center"
                    />
                    <button
                      onClick={() => increment(setRestMinutes, restMinutes)}
                      className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Seconds */}
                <div className="flex-1">
                  <Label htmlFor="restSeconds">Seconds</Label>
                  <div className="flex items-center">
                    <button
                      onClick={() => decrement(setRestSeconds, restSeconds)}
                      className="px-2 py-1 bg-gray-200 rounded-l"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="restSeconds"
                      value={restSeconds}
                      onChange={(e) =>
                        setRestSeconds(parseInt(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 text-center"
                    />
                    <button
                      onClick={() => increment(setRestSeconds, restSeconds)}
                      className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {!isRunning && (
              <Button
                onClick={handleStart}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Start Timer
              </Button>
            )}
            {isRunning && (
              <div className="flex space-x-2 w-full">
                <Button
                  onClick={handlePause}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Reset
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
        {isRunning && (
          <Card>
            <CardHeader>
              <CardTitle>
                {isRest ? 'Rest Time' : `Round ${currentRound}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-4xl font-bold">
                {formatTime(timeLeft)}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
