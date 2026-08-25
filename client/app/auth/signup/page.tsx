"use client";

import Image from "next/image";
import { Pacifico } from "next/font/google";
import { ArrowBigLeft, ArrowLeft, ArrowRight, Backpack, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

const SignupPage = () => {
  return (
    <main className="h-[100dvh] overflow-hidden bg-background">
      <div className="grid h-full lg:grid-cols-2">
        {/* Left branding */}
        <section className="relative hidden h-full overflow-hidden bg-secondary lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border-[60px] border-white/5" />
          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full border-[70px] border-white/5" />

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

            <form className="space-y-4">
              {/* Name */}
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
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
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
                    className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-4 font-semibold text-white transition hover:opacity-90"
              >
                Create account
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
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
    </main>
  );
};

export default SignupPage;