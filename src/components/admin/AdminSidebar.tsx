"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Car, 
  CalendarCheck, 
  Users, 
  CreditCard, 
  ExternalLink, 
  LogOut 
} from "lucide-react"; // Using Lucide for a professional look

// Define the interface for props to fix the 'underlined' error
interface AdminSidebarProps {
  onNavItemClick?: () => void; // Optional: used to close mobile drawer
}

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/cars", label: "Fleet", icon: Car },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

export default function AdminSidebar({ onNavItemClick }: AdminSidebarProps) {
  const pathname = usePathname();

  /**
   * Helper to handle clicks on navigation items.
   * If onNavItemClick exists (which it will on mobile), we trigger it to close the drawer.
   */
  const handleLinkClick = () => {
    if (onNavItemClick) {
      onNavItemClick();
    }
  };
return (
    // 'h-full' instead of 'min-h-screen' so it behaves inside the Mobile Drawer properly
    <aside className="w-full md:w-64 flex flex-col h-full bg-white border-r border-gray-100">
      
      {/* Branding Header - Hidden on mobile if you're using the MobileAdminHeader */}
      <div className="hidden md:block px-6 py-8">
        <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tight">
          ZENA
        </Link>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">
          Admin Control
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          // Logic to highlight the active link
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-6 border-t border-gray-50 space-y-1">
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={18} />
          View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}