"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Droplets,
  BookOpen,
  Dumbbell,
  SquareActivity,
} from "lucide-react";

interface Habit {
  _id: string;
  name: string;
  description?: string;
  category: string;
  icon: string;
  createdAt: string;
}

const AllHabits = ({ refreshKey }: { refreshKey: number }) => {

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [habits, setHabits ] = useState<Habit[]>([])

  const categories = [
    "All",
    "Health",
    "Fitness",
    "Learning",
    "Productivity",
    "Mindfulness",
    "General",
  ];

useEffect(() => {
  const refresh = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits/get`,
        {
          withCredentials: true,
        }
      );

      console.log(response.data.habits);
      setHabits(response.data.habits || []);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    }
  };

  refresh();
}, [refreshKey]);





  return (
    <section className="mt-8">

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 cursor-pointer rounded-lg px-4 py-2 text-xs font-medium transition md:px-5 md:py-2.5 md:text-sm ${isSelected
                  ? "bg-secondary text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-500 hover:border-secondary/30 hover:text-secondary"
                }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Habits */}
      
<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {habits
    .filter(
      (habit) =>
        selectedCategory === "All" ||
        selectedCategory === habit.category
    )
    .map((habit) => (
      <div
        key={habit._id}
        className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      >
        {/* Icon */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/60 text-2xl">
            {habit.icon === "Droplets" && <Droplets/>}
            {habit.icon === "BookOpen" && <BookOpen/>}
            {habit.icon === "Dumbbell" && <Dumbbell/>}
            {habit.icon === "SquareActivity" && <SquareActivity/>}
          </div>

          {/* Category */}
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            {habit.category}
          </span>
        </div>

        {/* Habit info */}
        <h2 className="text-lg font-bold text-secondary">
          {habit.name}
        </h2>

        <p className="mt-2 min-h-10 text-sm leading-relaxed text-gray-500">
          {habit.description || "No description"}
        </p>

        {/* Footer */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">
            Created{" "}
            {new Date(habit.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    ))}
</div>

    </section>
  );
};

export default AllHabits;