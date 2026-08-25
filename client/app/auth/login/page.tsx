"use client";

import Image from "next/image";
import { Pacifico } from "next/font/google";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

const LoginPage = () => {
  return (
    <main className="h-[100dvh] overflow-hidden bg-[#fff8f5]">
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

             <h1 className={`${pacifico.className} text-3xl text-white`}>
                Habitify
              </h1>
            </div>
              </Link>

            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                Welcome back
              </p>

              <h2 className="text-6xl font-bold leading-[1.05] text-white xl:text-7xl">
                Small steps.
                <br />
                <span className="text-white/50">Big changes.</span>
              </h2>

              <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/60">
                Keep your habits on track and continue making progress,
                one day at a time.
              </p>
            </div>

            <p className="text-sm text-white/40">
              Make progress, not perfection.
            </p>
          </div>
        </section>

        {/* Login */}
        <section className="flex h-full items-center justify-center overflow-y-auto px-6 py-8 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link href={"/"}>
            <div className="mb-8 flex items-center gap-3 lg:hidden">
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


            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary/50">
                Welcome back
              </p>

              <h2 className="text-4xl font-bold text-secondary sm:text-5xl">
                Login
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Continue your habit journey.
              </p>
            </div>

            <form className="space-y-5">
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
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-secondary">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-secondary/60 hover:text-secondary"
                  >
                    Forgot password?
                  </button>
                </div>

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
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-4 font-semibold text-white transition hover:opacity-90"
              >
                Login
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-secondary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;