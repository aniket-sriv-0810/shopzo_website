import React from 'react';
import FeedbackRow from './FeedbackRow';

const FeedbackTable = ({ feedbacks, onDeleteFeedback }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-sm">
          <tr>
            <th className="px-4 py-2">Profile</th>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Message</th>
            <th className="px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <FeedbackRow
              key={feedback._id}
              feedback={feedback}
              onDelete={() => onDeleteFeedback(feedback._id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
