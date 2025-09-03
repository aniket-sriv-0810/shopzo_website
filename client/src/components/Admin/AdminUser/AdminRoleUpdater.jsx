import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdminRoleUpdater = ({ userId, currentRole, onRoleUpdate }) => {
    // Get the adminId from the URL parameters
    const { id: adminId } = useParams();
    const [role, setRole] = useState(currentRole);
    const [loading, setLoading] = useState(false);

    const handleRoleChange = async (e) => {
        const newRole = e.target.value;
        if (newRole === currentRole) return; // Exit if the role hasn't changed

        setLoading(true);
        setRole(newRole);

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`,
                { role: newRole },
                { withCredentials: true }
            );
            console.log('User role updated successfully:', res.data.data);
            onRoleUpdate(res.data.data); 
        } catch (error) {
            console.error('Failed to update role:', error.response?.data?.message || error.message);
            setRole(currentRole); // Revert the role back to the original value on failure
        } finally {
            setLoading(false);
        }
    };

    // Determine the color class based on the current role
    const roleColorClass = role === 'user' 
        ? 'bg-green-500 text-white' 
        : 'bg-yellow-500 text-white';

    return (
        <select
            value={role}
            onChange={handleRoleChange}
            disabled={loading} 
            // Apply dynamic color class and a sleek border
            className={`py-1 px-3 text-center rounded-full font-medium transition-colors duration-200  ${roleColorClass} ${loading ? 'opacity-50' : 'cursor-pointer'}`}
        >
            <option value="user">user</option>
            <option value="team">team</option>
        </select>
    );
};

export default AdminRoleUpdater;
