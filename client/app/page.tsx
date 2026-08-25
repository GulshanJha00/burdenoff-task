"use client";

import { useState } from "react";
import { MainPage, Sidebar } from "@/components/barrel";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState(0);

  return (
    <main className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[240px_1fr]">
      <Sidebar
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />

      <MainPage selectedPage={selectedPage} />
    </main>
  );
}