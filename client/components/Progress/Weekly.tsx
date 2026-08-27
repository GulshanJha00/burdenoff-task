"use client";

import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Timer,
} from "lucide-react";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const Weekly = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          setIsBreak((currentBreak) => {
            if (!currentBreak) {
              setSessions((previousSessions) => previousSessions + 1);
            }

            return !currentBreak;
          });

          return isBreak ? WORK_TIME : BREAK_TIME;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_TIME);
  };

  const skipSession = () => {
    setIsRunning(false);

    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(WORK_TIME);
    } else {
      setIsBreak(true);
      setTimeLeft(BREAK_TIME);
    }
  };

  const progress = isBreak
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((WORK_TIME - timeLeft) / WORK_TIME) * 100;

  return (
    <section className="mt-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Timer size={24} />
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary/50">
            Pomodoro
          </p>

          <h1 className="mt-1 text-2xl font-bold text-secondary">
            {isBreak ? "Take a Break" : "Focus Time"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isBreak
              ? "Relax for 5 minutes before your next session."
              : "Focus for 25 minutes and get things done."}
          </p>
        </div>

        {/* Timer */}
        <div className="mt-8">
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
            {/* Progress ring */}
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-secondary/10"
              />

              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                className={
                  isBreak
                    ? "text-green-500"
                    : "text-secondary"
                }
                strokeDasharray="276.46"
                strokeDashoffset={
                  276.46 - (276.46 * progress) / 100
                }
              />
            </svg>

            {/* Timer text */}
            <div className="relative text-center">
              <p className="font-mono text-5xl font-bold tracking-tight text-secondary md:text-6xl">
                {formatTime(timeLeft)}
              </p>

              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                {isRunning
                  ? isBreak
                    ? "Break"
                    : "Focusing"
                  : "Paused"}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetTimer}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-secondary/30 hover:text-secondary"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>

          <button
            type="button"
            onClick={() => setIsRunning((previous) => !previous)}
            className="flex h-14 min-w-36 items-center justify-center gap-2 rounded-xl bg-secondary px-6 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            {isRunning ? (
              <>
                <Pause size={19} />
                Pause
              </>
            ) : (
              <>
                <Play size={19} />
                Start
              </>
            )}
          </button>

          <button
            type="button"
            onClick={skipSession}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-secondary/30 hover:text-secondary"
            title="Skip"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Sessions */}
        <div className="mt-7 rounded-2xl bg-secondary/5 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Completed Sessions
          </p>

          <p className="mt-1 text-2xl font-bold text-secondary">
            {sessions}
          </p>

          <p className="text-xs text-gray-400">
            {sessions === 1 ? "Pomodoro" : "Pomodoros"} completed
          </p>
        </div>

        {/* Session indicator */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              !isBreak ? "bg-secondary" : "bg-gray-200"
            }`}
          />

          <div className="h-px w-8 bg-gray-200" />

          <div
            className={`h-2.5 w-2.5 rounded-full ${
              isBreak ? "bg-green-500" : "bg-gray-200"
            }`}
          />

          <p className="ml-2 text-xs text-gray-400">
            {isBreak ? "5 min break" : "25 min focus"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Weekly;