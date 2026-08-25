"use client"
import Image from "next/image";
import { Pacifico } from "next/font/google";
import {
  Calendar,
  CalendarDays,
  LogOut,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

const progressItems = ["Daily", "Weekly", "Monthly"];

const Sidebar = () => {

  const [progress, setProgress] = useState(0)
  return (
    <aside className="flex h-full w-full flex-col p-5 ">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/favicon.png"
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
          alt="Habitify logo"
        />

        <h1 className={`${pacifico.className} text-secondary text-3xl`}>
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
                onClick={()=>setProgress(index)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                  index === progress
                    ? "bg-white text-red-500 shadow-sm"
                    : " hover:bg-red-400"
                }`}
              >
                {index === 0 ? (
                   <Sun size={20}/>
                  
                ) : index === 1 ? (
                  <Calendar size={20} />
                ):
                <CalendarDays size={20} />
                }
                <span className="font-medium">{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="mt-auto space-y-1">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition cursor-pointer hover:bg-red-400">
            <Settings size={20} />
            <span className="font-medium ">Settings</span>
          </button>

          <button className="flex cursor-pointer w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400">
            <User size={20} />
            <span className="font-medium">Profile</span>
          </button>

          <button className="flex cursor-pointer w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400">
            <LogOut size={20} />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;