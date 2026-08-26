import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Habitify",
  description: "Create your Habitify account",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}