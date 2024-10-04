import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Play, Pause, RotateCcw } from 'lucide-react';

export default function App() {
  const [rounds, setRounds] = useState(3);
  const [roundMinutes, setRoundMinutes] = useState(3);
  const [roundSeconds, setRoundSeconds] = useState(0);
  const [restMinutes, setRestMinutes] = useState(1);
  const [restSeconds, setRestSeconds] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRest, setIsRest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(roundMinutes * 60 + roundSeconds);
  const timerRef = useRef(null);

  const [errors, setErrors] = useState({
    rounds: false,
    roundTime: false,
    restTime: false,
  });

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

  const handleIncrement = (setter, value) => {
    setter(Math.max(0, value + 1));
  };

  const handleDecrement = (setter, value) => {
    setter(Math.max(0, value - 1));
  };

  const validateInputs = () => {
    const newErrors = {
      rounds: rounds < 1,
      roundTime: roundMinutes * 60 + roundSeconds < 1,
      restTime: restMinutes * 60 + restSeconds < 1,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const startTimer = () => {
    if (validateInputs()) {
      setTimerRunning(true);
      setTimerPaused(false);
      setCurrentRound(1);
      setIsRest(false);
      setTimeLeft(roundMinutes * 60 + roundSeconds);
    }
  };

  const pauseTimer = () => {
    setTimerPaused(true);
    clearInterval(timerRef.current);
  };

  const resumeTimer = () => {
    setTimerPaused(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerPaused(false);
    setCurrentRound(1);
    setIsRest(false);
    setTimeLeft(roundMinutes * 60 + roundSeconds);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const TimerInput = ({ label, minutes, seconds, setMinutes, setSeconds, error, disabled }) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Label className="text-xs text-gray-600">Min</Label>
          <div className="flex items-center">
            <Button
              type="button"
              onClick={() => handleDecrement(setMinutes, minutes)}
              className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 text-white"
              disabled={disabled}
            >
              -
            </Button>
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 text-center mx-1 border-indigo-300"
              disabled={disabled}
            />
            <Button
              type="button"
              onClick={() => handleIncrement(setMinutes, minutes)}
              className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 text-white"
              disabled={disabled}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Label className="text-xs text-gray-600">Sec</Label>
          <div className="flex items-center">
            <Button
              type="button"
              onClick={() => handleDecrement(setSeconds, seconds)}
              className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 text-white"
              disabled={disabled}
            >
              -
            </Button>
            <Input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 text-center mx-1 border-indigo-300"
              disabled={disabled}
            />
            <Button
              type="button"
              onClick={() => handleIncrement(setSeconds, seconds)}
              className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 text-white"
              disabled={disabled}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          Time must be at least 1 second.
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center p-4">
      <header className="w-full py-6 mb-8">
        <h1 className="text-4xl text-white text-center font-bold tracking-wider">
          Boxing Rounds Timer
        </h1>
      </header>

      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
          <CardTitle className="text-2xl font-bold text-white">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Rounds</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                onClick={() => handleDecrement(setRounds, rounds)}
                className="w-10 h-10 bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={timerRunning || timerPaused}
              >
                -
              </Button>
              <Input
                type="number"
                value={rounds}
                onChange={(e) => setRounds(Math.max(1, parseInt(e.target.value) || 1))}
                className={`w-20 text-center ${errors.rounds ? 'border-red-500' : 'border-indigo-300'}`}
                disabled={timerRunning || timerPaused}
              />
              <Button
                type="button"
                onClick={() => handleIncrement(setRounds, rounds)}
                className="w-10 h-10 bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={timerRunning || timerPaused}
              >
                +
              </Button>
            </div>
            {errors.rounds && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Rounds must be at least 1.
              </p>
            )}
          </div>

          <TimerInput
            label="Round Time (Work Period)"
            minutes={roundMinutes}
            seconds={roundSeconds}
            setMinutes={setRoundMinutes}
            setSeconds={setRoundSeconds}
            error={errors.roundTime}
            disabled={timerRunning || timerPaused}
          />

          <TimerInput
            label="Rest Time (Between Rounds)"
            minutes={restMinutes}
            seconds={restSeconds}
            setMinutes={setRestMinutes}
            setSeconds={setRestSeconds}
            error={errors.restTime}
            disabled={timerRunning || timerPaused}
          />

          {timerRunning && (
            <div className="text-center space-y-2 bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl">
              <h2 className="text-xl font-bold text-indigo-800">
                {isRest ? 'Rest Time' : `Round ${currentRound}`}
              </h2>
              <p className="text-5xl font-mono font-bold text-indigo-600">
                {formatTime(timeLeft)}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-4 mt-6">
            {!timerRunning && (
              <Button
                onClick={startTimer}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center transition-colors duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
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
                  } text-white px-6 py-2 rounded-full flex items-center transition-colors duration-300`}
                >
                  {timerPaused ? (
                    <>
                      <Play className="w-5 h-5 mr-2" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5 mr-2" /> Pause
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetTimer}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full flex items-center transition-colors duration-300"
                >
                  <RotateCcw className="w-5 h-5 mr-2" /> Reset
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}