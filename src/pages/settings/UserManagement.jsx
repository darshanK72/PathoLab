import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, UserCircle, Shield, User } from 'lucide-react';
import { api } from '../../lib/api';

const UserManagement = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'Technician' });
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await api.createUser(formData);
            if (result.success) {
                setShowAddForm(false);
                setFormData({ username: '', password: '', role: 'Technician' });
                loadUsers();
            } else {
                setError(result.message);
            }
        } catch {
            setError('Failed to create user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.deleteUser(id);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    };

    if (currentUser?.role !== 'Admin') {
        return (
            <div className="p-10 text-center text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Only administrators can manage user accounts.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Lab Personnel</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <UserPlus className="w-4 h-4" />
                    New User
                </button>
            </div>

            {showAddForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 animate-in slide-in-from-top-2">
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Technician">Technician</option>
                                <option value="Receptionist">Receptionist</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors text-sm font-medium h-[38px]"
                        >
                            Create Account
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-xs mt-3 font-medium">{error}</p>}
                </div>
            )}

            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">User Details</th>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Access Level</th>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Registered On</th>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading accounts...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No users found.</td></tr>
                        ) : users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-gray-900 capitalize">{user.username}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                                        user.role === 'Admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        disabled={user.username === 'admin'}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 disabled:opacity-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Minimal cn implementation to avoid dependency issues if not imported correctly
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default UserManagement;
