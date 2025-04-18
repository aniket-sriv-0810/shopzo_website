import React from "react";
import UserRow from "./UserRow";

const UserTable = ({ users, loggedInUser, deleteUser  }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
      <table className="min-w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white">
          <tr>
            <th className="px-4 py-3 border border-gray-200">Image</th>
            <th className="px-4 py-3 border border-gray-200">Name</th>
            <th className="px-4 py-3 border border-gray-200">Phone</th>
            <th className="px-4 py-3 border border-gray-200">Email</th>
            <th className="px-4 py-3 border border-gray-200">User ID</th>
            <th className="px-4 py-3 border border-gray-200">Delete Account</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              loggedInUser={loggedInUser}
              deleteUser={deleteUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
