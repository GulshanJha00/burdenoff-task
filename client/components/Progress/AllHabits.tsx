"use client";

import { useState } from "react";

const AllHabits = () => {
  const categories = [
    "All",
    "Health",
    "Fitness",
    "Learning",
    "Productivity",
    "Mindfulness",
    "General",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

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
              className={`shrink-0 cursor-pointer rounded-lg px-4 py-2 text-xs font-medium transition md:px-5 md:py-2.5 md:text-sm ${
                isSelected
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
      <div className="mt-5 space-y-2">
        {/* Example habit */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              🔥
            </div>

            <div>
              <h3 className="text-sm font-semibold text-secondary">
                Morning Workout
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                Fitness · Daily
              </p>
            </div>
          </div>

          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              📖
            </div>

            <div>
              <h3 className="text-sm font-semibold text-secondary">
                Read 20 Pages
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                Learning · Daily
              </p>
            </div>
          </div>

          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        </div>
      </div>
    </section>
  );
};

export default AllHabits;