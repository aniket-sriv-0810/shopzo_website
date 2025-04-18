import React from 'react';

const FeedbackRow = ({ feedback, onDelete }) => {
  const { user, message, status } = feedback;

  return (
    <tr className="border-b  text-center">
      <td className="px-4 py-2 capitalize">{user?.name || "user"}</td>
      <td className="px-4 py-2 capitalize">{user?.email || "user"}</td>
      <td className="px-4 py-2 capitalize">{user?.phone || "user"}</td>
      <td className="px-4 py-2">{message}</td>

      {/* DELETE in its own column, centered */}
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
