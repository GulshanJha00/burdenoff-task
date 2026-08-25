"use client";

import {
  Calendar,
  CalendarDays,
  LogIn,
  LogOut,
  Settings,
  Sun,
  User,
} from "lucide-react";

interface NavigationItemsProps {
  selectedPage: number;
  updatePage: (index: number) => void;
  isLoggedIn: boolean;
  closeMenu?: () => void;
}

const progressItems = ["Daily", "Weekly", "Monthly"];

const NavigationItems = ({
  selectedPage,
  updatePage,
  isLoggedIn,
  closeMenu,
}: NavigationItemsProps) => {
  return (
    <>
      <div>
        <p className="mb-3 px-3 text-sm font-bold uppercase tracking-wider text-secondary">
          Your Progress
        </p>

        <div className="space-y-1">
          {progressItems.map((item, index) => (
            <button
              key={item}
              onClick={() => updatePage(index)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                index === selectedPage
                  ? "bg-white text-secondary shadow-sm"
                  : "hover:bg-red-400"
              }`}
            >
              {index === 0 ? (
                <Sun size={20} />
              ) : index === 1 ? (
                <Calendar size={20} />
              ) : (
                <CalendarDays size={20} />
              )}

              <span className="font-medium">{item}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-gray-200" />

      <div className="space-y-1">
        <button
          onClick={closeMenu}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>

        <button
          onClick={closeMenu}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400"
        >
          <User size={20} />
          <span className="font-medium">Profile</span>
        </button>

        {isLoggedIn ? (
          <button
            onClick={closeMenu}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign out</span>
          </button>
        ) : (
          <button
            onClick={closeMenu}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400"
          >
            <LogIn size={20} />
            <span className="font-medium">Login</span>
          </button>
        )}
      </div>
    </>
  );
};

export default NavigationItems;