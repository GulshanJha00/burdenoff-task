"use client";

import { useEffect, useState } from "react";
import { Flame, Target, Trophy, Plus, X, BookOpen, Droplets, Dumbbell, SquareActivity } from "lucide-react";
import { quote } from "./quote";
import { Pacifico } from "next/font/google";
import { AllHabits } from "@/components/barrel";
const pacifico = Pacifico({
    weight: "400",
    subsets: ["latin"],
});

const Daily = () => {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const [showHabitForm, setShowHabitForm] = useState(false);

    const today = new Date();
    const day = today.getDate();
    const dailyQuote = quote[day % quote.length];

    useEffect(() => {
        setMounted(true);

        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const hour = time.getHours();

    let greeting;

    if (hour >= 3 && hour < 12) {
        greeting = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    const categories = [
        "Health",
        "Fitness",
        "Learning",
        "Productivity",
        "Mindfulness",
        "General",
    ];

    const icons = [
        Droplets,
        BookOpen,
        Dumbbell,
        SquareActivity
    ]

    return (
        <>
            <main className="p-5 pt-20 md:p-8">

                {/* Date and clock */}
                <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-secondary md:text-sm">
                        {mounted
                            ? time.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })
                            : ""}
                    </p>

                    <div className="flex shrink-0 items-center gap-2 rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 md:px-4 md:py-2.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                        <h2 className="text-xs font-bold text-secondary md:font-mono md:text-lg md:tracking-wider">
                            {mounted
                                ? time.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })
                                : ""}
                        </h2>
                    </div>
                </div>

                {/*  GREETING and New habit */}
                <div className="mt-5 flex items-end justify-between gap-2">

                    <div className="min-w-0">
                        <h1 className="font-serif text-2xl font-extrabold  md:text-4xl">
                            {greeting},{" "}
                            <span
                                className={`${pacifico.className} text-2xl font-bold md:text-4xl`}
                            >
                                user
                            </span>
                        </h1>

                        <p className="mt-2 text-xs text-gray-500 md:text-sm">
                            "{dailyQuote}"
                        </p>
                    </div>

                    <button
                        onClick={() => setShowHabitForm(true)}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 md:gap-2 md:px-4 md:py-2.5 md:text-sm"
                    >
                        <Plus size={16} />
                        <span>New Habit</span>
                    </button>
                </div>

                {/*  STATS  */}
                <div className="mt-8 grid grid-cols-3 gap-2 md:mt-7 md:gap-4">

                    {/* Current Streak */}
                    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-300 hover:shadow-md shadow-red-500  transition-all duration-200 hover:scale-105 p-2 md:gap-4 md:p-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 md:h-11 md:w-11">
                            <Flame
                                size={18}
                                className="md:h-5.5 md:w-5.5"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-bold text-secondary md:text-2xl">
                                12
                            </p>

                            <p className="text-[10px] text-gray-500 md:text-sm">
                                Current Streak
                            </p>
                        </div>
                    </div>

                    {/* Best Streak */}
                    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-300 hover:shadow-md shadow-red-500  duration-200 hover:scale-105 transition-all transform p-2 md:gap-4 md:p-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-500 md:h-11 md:w-11">
                            <Trophy
                                size={18}
                                className="md:h-5.5 md:w-5.5"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-bold text-secondary md:text-2xl">
                                24
                            </p>

                            <p className="text-[10px] text-gray-500 md:text-sm">
                                Best Streak
                            </p>
                        </div>
                    </div>

                    {/* Today's Progress */}
                    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-300 hover:shadow-md shadow-red-500  duration-200 hover:scale-105 transition-all transform p-2 md:gap-4 md:p-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-500 md:h-11 md:w-11">
                            <Target
                                size={18}
                                className="md:h-5.5 md:w-5.5"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-bold text-secondary md:text-2xl">
                                75%
                            </p>

                            <p className="text-[10px] text-gray-500 md:text-sm">
                                Today's Progress
                            </p>
                        </div>
                    </div>

                </div>

                {/* All Habits */}

                <AllHabits/>


                {/*  Add Habit Form  */}

                {showHabitForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-secondary p-5 shadow-2xl md:p-6">

                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                        <Plus className="text-background" size={20} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-background md:text-xl">
                                            Create New Habit
                                        </h2>

                                        <p className="text-xs text-white/50">
                                            Build a habit and make it part of your routine.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowHabitForm(false)}
                                    className="cursor-pointer rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form className="mt-5 space-y-5">

                                {/* Habit name */}
                                <div>
                                    <label className="text-sm font-semibold text-background">
                                        Habit Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. Read for 30 minutes"
                                        className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/40"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-semibold text-background">
                                        Description
                                        <span className="ml-1 text-xs font-normal text-white/40">
                                            (optional)
                                        </span>
                                    </label>

                                    <textarea
                                        placeholder="What do you want to achieve?"
                                        rows={3}
                                        className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/40"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-sm font-semibold text-background">
                                        Category
                                    </label>

                                    <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                                        {categories.map((val, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="cursor-pointer rounded-lg border border-white/10 bg-white/10 px-3 py-3 text-left text-sm text-white transition hover:border-white/30 hover:bg-white/15"
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Icon */}
                                <div>
                                    <label className="text-sm font-semibold text-background">
                                        Icon
                                    </label>

                                    <div className="mt-2 grid grid-cols-6 gap-2 md:grid-cols-8">
                                        {icons.map((Icon, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition hover:border-white/30 hover:bg-white/15"
                                            >
                                                <Icon size={20} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-5 md:flex-row md:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowHabitForm(false)}
                                        className="w-full cursor-pointer rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 md:w-auto"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="w-full cursor-pointer rounded-lg bg-background px-5 py-3 text-sm font-semibold text-secondary transition hover:opacity-90 md:w-auto"
                                    >
                                        Add Habit
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}


            </main>
        </>
    );
};

export default Daily;