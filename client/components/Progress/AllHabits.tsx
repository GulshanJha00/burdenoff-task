"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Droplets,
  BookOpen,
  Dumbbell,
  SquareActivity,
  Flame,
  Trophy,
  Check,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

interface Habit {
  _id: string;
  name: string;
  description?: string;
  category: string;
  icon: string;
  createdAt: string;
}

interface Streak {
  currentStreak: number;
  longestStreak: number;
}

const AllHabits = ({ refreshKey }: { refreshKey: number }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [streaks, setStreaks] = useState<Record<string, Streak>>({});

  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({});

  const categories = [
    "All",
    "Health",
    "Fitness",
    "Learning",
    "Productivity",
    "Mindfulness",
    "General",
  ];

  // --------------------------------
  // GET HABITS
  // --------------------------------

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits/get`,
          {
            withCredentials: true,
          }
        );

        const fetchedHabits = response.data.habits || [];

        setHabits(fetchedHabits);

        // Check today's status for every habit
        const checkedStatus: Record<string, boolean> = {};

        for (const habit of fetchedHabits) {
  try {
    // Check whether habit is already checked in today
    const checkInResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits/${habit._id}/checkin`,
      {
        withCredentials: true,
      }
    );

    checkedStatus[habit._id] =
      checkInResponse.data.checkedIn;


    // Get streak
    const streakResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits/${habit._id}/streak`,
      {
        withCredentials: true,
      }
    );

    setStreaks((previous) => ({
      ...previous,
      [habit._id]: {
        currentStreak:
          streakResponse.data.currentStreak,

        longestStreak:
          streakResponse.data.longestStreak,
      },
    }));

  } catch (error) {
    console.error(
      `Failed to load ${habit.name}:`,
      error
    );

    checkedStatus[habit._id] = false;
  }
}

        setCheckedIn(checkedStatus);
      } catch (error: any) {
        console.error("Failed to fetch habits:", error);

        const message =
          error.response?.data?.message ||
          "Failed to load your habits";

        toast.error(message);
      }
    };

    refresh();
  }, [refreshKey]);

  // --------------------------------
  // FILTER HABITS
  // --------------------------------

  const filteredHabits = habits.filter(
    (habit) =>
      selectedCategory === "All" ||
      selectedCategory === habit.category
  );

  // --------------------------------
  // CHECK IN
  // --------------------------------

  const checkInHabit = async (habitId: string) => {
    try {
      setCheckingIn(habitId);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits/checkin`,
        {
          habitId,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Check-in response:", response.data);

      const {
        currentStreak,
        longestStreak,
      } = response.data;

      // Update streak
      setStreaks((previous) => ({
        ...previous,
        [habitId]: {
          currentStreak,
          longestStreak,
        },
      }));

      // Mark as checked in
      setCheckedIn((previous) => ({
        ...previous,
        [habitId]: true,
      }));

      // Success toast
      toast.success("Habit checked in successfully!");
    } catch (error: any) {
      console.error("Check-in error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to check in habit";

      toast.error(message);
    } finally {
      setCheckingIn(null);
    }
  };

  // --------------------------------
  // DELETE HABIT
  // --------------------------------

  const deleteHabit = async (habitId: string) => {
    try {
      setDeleting(habitId);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/habits/${habitId}`,
        {
          withCredentials: true,
        }
      );

      // Remove habit from frontend immediately
      setHabits((previous) =>
        previous.filter((habit) => habit._id !== habitId)
      );

      // Remove its frontend streak data
      setStreaks((previous) => {
        const updated = { ...previous };
        delete updated[habitId];
        return updated;
      });

      // Remove its checked-in state
      setCheckedIn((previous) => {
        const updated = { ...previous };
        delete updated[habitId];
        return updated;
      });

      toast.success("Habit deleted successfully");
    } catch (error: any) {
      console.error("Delete habit error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete habit";

      toast.error(message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="mt-8">
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isSelected =
            selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
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
      <div className="mt-6">
        {filteredHabits.length === 0 ? (
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm transition-all duration-300 hover:border-secondary/20 hover:shadow-md">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-secondary/5 transition-transform duration-500 group-hover:scale-125" />

            <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-secondary/5" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary shadow-sm">
              <span className="text-3xl">
                🌱
              </span>
            </div>

            <div className="relative mt-5">
              <h2 className="text-xl font-bold tracking-tight text-secondary">
                Nothing here yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                {selectedCategory === "All"
                  ? "Start building your routine by creating your first habit."
                  : `You don't have any ${selectedCategory.toLowerCase()} habits yet.`}
              </p>
            </div>

            <div className="mx-auto mt-6 flex items-center justify-center gap-2">
              <span className="h-1 w-1 rounded-full bg-secondary/30" />
              <span className="h-1.5 w-8 rounded-full bg-secondary/20" />
              <span className="h-1 w-1 rounded-full bg-secondary/30" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHabits.map((habit) => {
              const streak = streaks[habit._id];

              const isChecking =
                checkingIn === habit._id;

              const isCheckedIn =
                checkedIn[habit._id];

              return (
                <div
                  key={habit._id}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Icon + Category */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/60 text-2xl">
                      {habit.icon === "Droplets" && (
                        <Droplets />
                      )}

                      {habit.icon === "BookOpen" && (
                        <BookOpen />
                      )}

                      {habit.icon === "Dumbbell" && (
                        <Dumbbell />
                      )}

                      {habit.icon === "SquareActivity" && (
                        <SquareActivity />
                      )}
                    </div>

                    <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                      {habit.category}
                    </span>
                  </div>

                  {/* Habit info */}
                  <h2 className="text-lg font-bold text-secondary">
                    {habit.name}
                  </h2>

                  <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-gray-500">
                    {habit.description ||
                      "No description"}
                  </p>

                  {/* Streaks */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {/* Current */}
                    <div className="rounded-xl bg-secondary/5 p-3">
                      <div className="flex items-center gap-2">
                        <Flame
                          size={16}
                          className="text-secondary"
                        />

                        <span className="text-xs font-medium text-gray-400">
                          Current
                        </span>
                      </div>

                      <p className="mt-1 text-2xl font-bold text-secondary">
                        {streak?.currentStreak ?? 0}
                      </p>

                      <p className="text-xs text-gray-400">
                        days
                      </p>
                    </div>

                    {/* Longest */}
                    <div className="rounded-xl bg-secondary/5 p-3">
                      <div className="flex items-center gap-2">
                        <Trophy
                          size={16}
                          className="text-secondary"
                        />

                        <span className="text-xs font-medium text-gray-400">
                          Longest
                        </span>
                      </div>

                      <p className="mt-1 text-2xl font-bold text-secondary">
                        {streak?.longestStreak ?? 0}
                      </p>

                      <p className="text-xs text-gray-400">
                        days
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2">
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        const confirmed =
                          window.confirm(
                            `Delete "${habit.name}"? This will also delete all of its check-ins.`
                          );

                        if (confirmed) {
                          deleteHabit(habit._id);
                        }
                      }}
                      disabled={
                        deleting === habit._id
                      }
                      className="flex cursor-pointer items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleting === habit._id ? (
                        <span className="h-4 w-4 animate-spin cursor-pointer rounded-full border-2 border-red-400 border-t-transparent" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>

                    {/* Check In */}
                    <button
                      type="button"
                      onClick={() =>
                        checkInHabit(habit._id)
                      }
                      disabled={
                        isChecking ||
                        isCheckedIn ||
                        deleting === habit._id
                      }
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isCheckedIn
                          ? "cursor-not-allowed bg-green-100 text-green-700"
                          : isChecking
                          ? "cursor-not-allowed bg-secondary/50 text-white"
                          : "bg-secondary text-white hover:opacity-90"
                      }`}
                    >
                      {isCheckedIn ? (
                        <>
                          <Check size={17} />
                          Checked In
                        </>
                      ) : isChecking ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Checking in...
                        </>
                      ) : (
                        <>
                          <Check size={17} />
                          Check In
                        </>
                      )}
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400">
                      Created{" "}
                      {new Date(
                        habit.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllHabits;