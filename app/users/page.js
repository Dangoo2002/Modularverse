'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fetchWithAuth, getUser } from '../lib/auth';

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const u = await getUser();
      if (!u || u.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setCurrentUser(u);
      await loadUsers();
      setLoading(false);
    }
    init();
  }, [router]);

  const loadUsers = async () => {
    try {
      const res = await fetchWithAuth('/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetchWithAuth(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        loadUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      const res = await fetchWithAuth(`/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        loadUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600 mb-10">
            Manage all users and their roles
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
            </div>

            {users.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No users found
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="p-6 md:p-8 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-lg">
                          {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {u.name || 'Unnamed'}
                          </h3>
                          <p className="text-gray-600 text-sm">{u.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}