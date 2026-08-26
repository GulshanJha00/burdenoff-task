import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Habitify",
  description: "Login to your Habitify account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}