"use client";

import Image from "next/image";
import { Pacifico } from "next/font/google";
import { ArrowLeft, ArrowRight, Lock, Mail, User, Globe, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";


const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [clicked, setClicked] = useState(true)
  const router = useRouter()
  const { checkAuth } = useAuth()



  useEffect(() => {
    const detectedTimezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone

    setTimezone(detectedTimezone);
  }, []);

  const eventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClicked(false)

    if (!name || !email || !timezone || !password || !cnfPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== cnfPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        timezone,
        password,
      },
        {
          withCredentials: true,
        })

      const { token, user } = response.data;
      console.log(token);
      console.log(user);


      toast.success("Account details look good!");
      await checkAuth();
      router.push("/")
      // TODO: Add winston for logging and storing

    } catch (error) {
      console.log(error);
      // TODO: Add winston for logging and storing
    }
    setClicked(true)

  };

  return (
    <main className="h-dvh overflow-hidden bg-background">
      <div className="grid h-full lg:grid-cols-2">
        {/* Left branding */}
        <section className="relative hidden h-full overflow-hidden bg-secondary lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border-60 border-white/5" />
          <div className="absolute -bottom-40 -right-20 h-125 w-125 rounded-full border-70 border-white/5" />

          <div className="relative flex h-full flex-col justify-between p-14 xl:p-20">
            <Link href={"/"}>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/favicon.png"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                  alt="Habitify logo"
                />

                <h1 className={`${pacifico.className} text-4xl text-white`}>
                  Habitify
                </h1>
              </div>
            </Link>

            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                Start today
              </p>

              <h2 className="text-6xl font-bold leading-[1.05] text-white xl:text-7xl">
                Build habits.
                <br />
                <span className="text-white/50">Change yourself.</span>
              </h2>

              <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/60">
                Create an account and start turning small daily actions
                into habits that last.
              </p>
            </div>

            <p className="text-sm text-white/40">
              Make progress, not perfection.
            </p>
          </div>
        </section>

        {/* Signup */}
        <section className="flex h-full items-center justify-center overflow-y-auto px-6 py-8 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link href={"/"}>
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <Image
                  src="/images/favicon.png"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                  alt="Habitify logo"
                />

                <h1 className={`${pacifico.className} text-3xl text-secondary`}>
                  Habitify
                </h1>
              </div>
            </Link>

            <div className="mb-6">
              <div className="flex justify-between items-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary/50">
                  Get started
                </p>
                <Link href={"/"} className="px-3 py-2 bg-white rounded-sm hover:bg-secondary/80 flex justify-center items-center gap-3 hover:text-background ">
                  <ArrowLeft size={15}></ArrowLeft>
                  Back</Link>

              </div>


              <h2 className="text-4xl font-bold text-secondary sm:text-5xl">
                Create account
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Start building better habits today.
              </p>
            </div>

            <form className="space-y-4" onSubmit={eventHandler}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary">
                  Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary">
                  Timezone
                </label>

                <div className="relative">
                  <Globe
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    required
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="America/Los_Angeles">America/Los_Angeles</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Europe/Berlin">Europe/Berlin</option>
                    <option value="Asia/Dubai">Asia/Dubai</option>
                    <option value="Asia/Singapore">Asia/Singapore</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                    <option value="Australia/Sydney">Australia/Sydney</option>
                  </select>
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Used to calculate your daily habits and streaks correctly.
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={cnfPassword}
                    onChange={(e) => setCnfPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
              </div>

              {clicked ? <button
                type="submit"
                className="group cursor-pointer mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-4 font-semibold text-white transition hover:opacity-90"
              >
                Create account
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
                :
                <h1
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary/40 py-4 font-semibold text-white "
                >
                  <Loader
                    size={18}
                    className="transition-transform animate-spin group-hover:translate-x-1"
                  />
                  Creating...
                </h1>}


            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-secondary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </main>
  );
};

export default SignupPage;