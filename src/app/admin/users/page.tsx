import { adminGetAllUsers } from "@/actions/admin.actions";
import AdminUserRow from "@/components/admin/AdminUserRow";

export default async function AdminUsersPage() {
  const users = await adminGetAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-4">User</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Bookings</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2">Role</div>
        </div>
        <div className="divide-y divide-gray-50">
          {users.map((user) => (
            <AdminUserRow key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}