"use client";

import Image from "next/image";
import { Pacifico } from "next/font/google";
import {
  Calendar,
  CalendarDays,
  LogOut,
  Menu,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

interface SidebarProps {
  selectedPage: number;
  setSelectedPage: (page: number) => void;
}

const Sidebar = ({
  selectedPage,
  setSelectedPage,
}: SidebarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const progressItems = ["Daily", "Weekly", "Monthly"];

  useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");

    if (savedPage !== null) {
      setSelectedPage(Number(savedPage));
    }
  }, [setSelectedPage]);

  const updatePage = (index: number) => {
    setSelectedPage(index);
    localStorage.setItem("selectedPage", String(index));

    window.dispatchEvent(new Event("selectedPageChanged"));

    // Close mobile menu
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden h-full w-full flex-col p-5 md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/favicon.png"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            alt="Habitify logo"
          />

          <h1 className={`${pacifico.className} text-3xl text-secondary`}>
            Habitify
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-12 flex flex-1 flex-col">
          {/* Progress */}
          <div>
            <p className="mb-3 px-3 text-base font-bold uppercase tracking-wider text-secondary">
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

          {/* Bottom navigation */}
          <div className="mt-auto space-y-1">
            <button className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>

            <button className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400">
              <User size={20} />
              <span className="font-medium">Profile</span>
            </button>

            <button className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400">
              <LogOut size={20} />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* ================= MOBILE ================= */}

      {/* Hamburger button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-3 shadow-md md:hidden"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Dark overlay */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile menu */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-white p-5 shadow-xl transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/favicon.png"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              alt="Habitify logo"
            />

            <h1
              className={`${pacifico.className} text-2xl text-secondary`}
            >
              Habitify
            </h1>
          </div>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile navigation */}
        <nav className="mt-10 flex flex-col">
          {/* Progress */}
          <p className="mb-3 px-3 text-sm font-bold uppercase tracking-wider text-secondary">
            Your Progress
          </p>

          <div className="space-y-1">
            {progressItems.map((item, index) => (
              <button
                key={item}
                onClick={() => updatePage(index)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                  index === selectedPage
                    ? "bg-secondary text-white shadow-sm"
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

          {/* Divider */}
          <div className="my-6 h-px bg-gray-200" />

          {/* Other options */}
          <div className="space-y-1">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400"
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400"
            >
              <User size={20} />
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;