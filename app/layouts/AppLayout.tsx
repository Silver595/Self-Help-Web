import { Outlet, Link, NavLink } from "react-router";
import Header from "~/components/layout/Header";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-white text-[#171A20]">
      {/* Navbar */}
      <Header />

      {/* Page Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}