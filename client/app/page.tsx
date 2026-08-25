import { MainPage, Sidebar } from "@/components/barrel";

export default function Home() {
  return (
    <div className="grid grid-cols-1 bg-background md:grid-cols-[0.5fr_2.5fr] w-full h-full">

    <Sidebar/>
    <MainPage progress={0}/>
    </div>
  );
}
