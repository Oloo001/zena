import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">My profile</h1>

        {/* Avatar + name */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            <span className="mt-1.5 inline-block text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 text-sm">
          {[
            { label: "Full name", value: user.name },
            { label: "Email", value: user.email },
            { label: "Phone", value: user.phone ?? "Not provided" },
            { label: "Member since", value: new Date(user.createdAt).toLocaleDateString("en-KE", { month: "long", year: "numeric" }) },
            { label: "Total bookings", value: String(user._count.bookings) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="font-medium text-gray-900 mb-3 text-sm">Security</p>
          <p className="text-xs text-gray-400">
            Password changes and account settings will be added in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}