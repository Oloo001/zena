"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"; // New import
import { Sun, Moon } from "lucide-react"; // New icons

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Featured" },
  { href: "/cars", label: "Fleet" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme(); // Hook for theme control
  const [mounted, setMounted] = useState(false); // Guard for hydration

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [menuOpen]);

  // Mount logic for theme icons
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <nav className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tight">
            <i>CITY HIRE LTD</i>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400">
                Admin
              </Link>
            )}
          </div>

          {/* Right Section: Auth & Theme & Burger */}
          <div className="flex items-center gap-3">
            {/* THEME TOGGLE BUTTON */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            {status === "loading" ? (
              <div className="w-20 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ) : session?.user ? (
              <div className="relative hidden md:block">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-xs">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden sm:block max-w-[120px] truncate">{session.user.name}</span>
                  <span className="text-gray-400 text-xs">▾</span>
                </button>

                {/* Desktop Dropdown menu */}
                {menuOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      My bookings
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      Profile
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        Admin dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-50 dark:border-gray-900 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Sign in</Link>
                <Link href="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Get started</Link>
              </div>
            )}

            {/* Mobile Burger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`bg-white dark:bg-gray-950 w-72 h-full p-6 flex flex-col transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-8">
             <span className="text-xl font-bold text-indigo-600 italic">ZENA</span>
          </div>

          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-700 dark:text-gray-200 text-lg font-medium hover:text-indigo-600">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto border-t border-gray-100 dark:border-gray-900 pt-6 space-y-4">
            {session?.user ? (
              <>
                <Link href="/dashboard/bookings" className="block text-gray-700 dark:text-gray-200 text-lg">My Bookings</Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="block text-indigo-600 dark:text-indigo-400 font-bold text-lg">Admin Dashboard</Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left text-red-500 text-lg font-medium py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-700 dark:text-gray-200 text-lg">Sign In</Link>
                <Link href="/register" className="block bg-indigo-600 text-white text-center py-3 rounded-xl font-semibold">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}