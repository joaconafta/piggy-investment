'use client'
import AuthProvider from "@/components/AuthProvider";
import Login from "@/components/Login";

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      {/* <AuthProvider/> */}
      <Login />
    </main>
  );
}
