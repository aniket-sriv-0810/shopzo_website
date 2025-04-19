import React from 'react';

const FeedbackRow = ({ feedback, onDelete }) => {
  const { user, message } = feedback;

  return (
    <tr className="border-b text-center text-sm">
      {/* User with image */}
      <td className="px-4 py-2 flex items-center gap-3 justify-center">
        <img
          src={user?.image || "/default-user.jpg"}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover border shadow-md shadow-gray-400"
        />
      </td>

      <td className="px-4 py-2 ">{user?._id || "N/A"}</td>
      <td className="px-4 py-2 capitalize">{user?.name || "N/A"}</td>
      <td className="px-4 py-2 lowercase">{user?.email || "N/A"}</td>
      <td className="px-4 py-2 capitalize">{user?.phone || "N/A"}</td>
      <td className="px-4 py-2">{message}</td>

      {/* DELETE button */}
      <td className="px-4 py-2">
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-all"
        >
          DELETE
        </button>
      </td>
    </tr>
  );
};

export default FeedbackRow;
