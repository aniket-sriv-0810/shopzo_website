import React from "react";
import { MdDeleteForever } from "react-icons/md";

const UserRow = ({ user, loggedInUser, deleteUser  }) => {
  const isCurrentUser = loggedInUser?._id === user._id;

  return (
    <tr className="hover:bg-gray-100 text-gray-900 text-center transition-all">
      <td className="px-4 py-2 border">
        <img
          src={user.image}
          alt={user.name}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto object-cover border border-gray-300"
        />
      </td>
      <td className="px-4 py-2 border capitalize">{user.name}</td>
      <td className="px-4 py-2 border">{user.phone}</td>
      <td className="px-4 py-2 border">{user.email}</td>
      <td className="px-4 py-2 border">{user._id}</td>
      <td className="px-4 py-2 border">
        <button
          onClick={() => deleteUser(user._id)}
          disabled={isCurrentUser}
          className={`hover:cursor-pointer flex items-center m-auto justify-center gap-2 px-4 py-2 text-white font-semibold rounded-full transition-transform 
            ${isCurrentUser ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 hover:scale-110"}`}
        >
          <MdDeleteForever className="text-xl" />
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
