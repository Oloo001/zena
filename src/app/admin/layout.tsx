import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MobileAdminHeader from "@/components/admin/MobileAdminHeader"; // New mobile header with hamburger menu

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard/bookings");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* 1. Desktop Sidebar 
          Hidden on mobile, visible from 'md' (768px) up.
      */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-gray-200 bg-white">
        <AdminSidebar />
      </aside>

      {/* 2. Mobile Header 
          Visible only on mobile. Contains a hamburger menu to trigger the sidebar.
      */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <MobileAdminHeader />
      </div>

      {/* 3. Main Content Area 
          Adjusts padding dynamically: 
          - p-4 for small phones 
          - p-8 for desktop
      */}
      <main className="flex-1 min-w-0 w-full">
        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}