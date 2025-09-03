import React from "react";
import { MdDeleteForever } from "react-icons/md";
import AdminRoleUpdater from "./AdminRoleUpdater";

const UserRow = ({ user, loggedInUser, deleteUser, onRoleUpdate }) => {
  // Check if the current user is the same as the row user
  const isCurrentUser = loggedInUser?._id === user._id;
  // Check if the user in the row is an admin
  const isUserAnAdmin = user.role === "admin";
  // Check if the logged-in user is an admin
  const isLoggedInUserAdmin = loggedInUser?.role === "admin";

  // The delete button is disabled if:
  // 1. The logged-in user is not an admin.
  // 2. The user being deleted is the current logged-in user.
  // 3. The user being deleted is another admin.
  const isDeleteDisabled = !isLoggedInUserAdmin || isCurrentUser || isUserAnAdmin;

  // Dynamic CSS classes for role colors
  const roleColorClass = {
    user: "bg-green-500 text-white",
    team: "bg-yellow-500 text-gray-800",
    admin: "bg-red-500 text-white",
    vendor: "bg-indigo-500 text-white",
  }[user.role];

  return (
    <tr className="hover:bg-gray-100 text-gray-900 text-center transition-all">
      {/* Profile Image */}
      <td className="px-4 py-2 border">
        <img
          src={user?.image}
          alt={user.name}
          className="w-12 h-12 md:w-14 md:h-14 bg-white shadow-md shadow-gray-300 rounded-full mx-auto object-cover border border-gray-300"
        />
      </td>

      {/* Basic Info */}
      <td className="px-4 py-2 border capitalize">{user.name}</td>
      <td className="px-4 py-2 border">{user.phone}</td>
      <td className="px-4 py-2 border">{user.email}</td>
      <td className="px-4 py-2 text-gray-500 border">{user._id}</td>

      {/* Role Badge with Toggle */}
      <td className="px-4 py-2 border">
        {user.role === "user" || user.role === "team" ? (
          <AdminRoleUpdater userId={user._id} currentRole={user.role} onRoleUpdate={onRoleUpdate} />
        ) : (
          <p className={`px-3 py-1 text-center font-medium rounded-full ${roleColorClass}`}>
            {user.role}
          </p>
        )}
      </td>

      {/* Delete Button */}
      <td className="px-4 py-2 border">
        <button
          onClick={() => deleteUser(user._id)}
          disabled={isDeleteDisabled}
          className={`flex items-center m-auto justify-center gap-2 px-4 py-2 text-white font-semibold rounded-full transition-transform
            ${
              isDeleteDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 hover:scale-110"
            }`}
        >
          <MdDeleteForever className="text-xl" />
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
