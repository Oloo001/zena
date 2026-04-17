"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminToggleUserRole } from "@/actions/admin.actions";
import { formatDate } from "@/lib/dates";
import toast from "react-hot-toast";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: Date;
    _count: { bookings: number };
  };
}

export default function AdminUserRow({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleRole = () => {
    if (
      !confirm(
        `Change ${user.name}'s role to ${
          user.role === "ADMIN" ? "USER" : "ADMIN"
        }?`
      )
    )
      return;

    startTransition(async () => {
      const result = await adminToggleUserRole(user.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Role updated");
      router.refresh();
    });
  };

  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50 transition-colors text-sm">

      {/* User */}
      <div className="col-span-4 flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs shrink-0">
          {user.name[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Phone */}
      <div className="col-span-2 text-xs text-gray-500">
        {user.phone ?? "—"}
      </div>

      {/* Bookings */}
      <div className="col-span-2 text-sm text-gray-900 font-medium">
        {user._count.bookings}
      </div>

      {/* Joined */}
      <div className="col-span-2 text-xs text-gray-500">
        {formatDate(user.createdAt)}
      </div>

      {/* Role */}
      <div className="col-span-2 flex items-center gap-2">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            user.role === "ADMIN"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.role}
        </span>
        <button
          onClick={handleToggleRole}
          disabled={isPending}
          className="text-xs text-gray-400 hover:text-indigo-600 hover:underline disabled:opacity-40"
        >
          Change
        </button>
      </div>
    </div>
  );
}