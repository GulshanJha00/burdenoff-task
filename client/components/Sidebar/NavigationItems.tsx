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
import Link from "next/link";
import axios from "axios";


interface NavigationItemsProps {
  selectedPage: number;
  updatePage: (index: number) => void;
  isLoggedIn: boolean;
  checkAuth: () => void;
  closeMenu?: () => void;
}

const progressItems = ["Daily", "Pomodoro"];

const NavigationItems = ({
  selectedPage,
  updatePage,
  isLoggedIn,
  checkAuth,
  closeMenu,
}: NavigationItemsProps) => {

  const handleLogout = async () => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    await checkAuth();

    closeMenu?.();
  } catch (error) {
    console.error("Logout error:", error);
  }
};

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
                  : "hover:bg-secondary/80 hover:text-background"
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

      <div className="mt-auto space-y-1">
        {isLoggedIn ? (
          <>

            <button
              onClick={handleLogout}

              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-secondary/80 hover:text-background"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign out</span>
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 hover:bg-secondary/80 hover:text-background"
          >
            <LogIn size={20} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default NavigationItems;
