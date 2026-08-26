"use client";

import Image from "next/image";
import { Pacifico } from "next/font/google";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import {NavigationItems} from "@/components/barrel";
import { useAuth } from "../context/AuthContext";

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
  const { isLoggedIn } = useAuth();


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

    setIsMenuOpen(false);
  };

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <aside className="hidden border-r-[0.5px] h-full w-full flex-col p-5 md:flex">
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

        <nav className="mt-12 flex flex-1 flex-col">
          <NavigationItems
            selectedPage={selectedPage}
            updatePage={updatePage}
            isLoggedIn={isLoggedIn}
          />
        </nav>
      </aside>

      {/* ================= MOBILE NAVBAR ================= */}
      <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center border-b bg-white px-4 shadow-sm md:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <div className="ml-3 flex items-center gap-2">
          <Image
            src="/images/favicon.png"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            alt="Habitify logo"
          />

          <h1 className={`${pacifico.className} text-2xl text-secondary`}>
            Habitify
          </h1>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* ================= MOBILE MENU ================= */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white p-5 shadow-xl transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/favicon.png"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              alt="Habitify logo"
            />

            <h1 className={`${pacifico.className} text-2xl text-secondary`}>
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

        <nav className="mt-10">
          <NavigationItems
            selectedPage={selectedPage}
            updatePage={updatePage}
            isLoggedIn={isLoggedIn}
            closeMenu={() => setIsMenuOpen(false)}
          />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;