import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Trash2, Users as UsersIcon, ShieldAlert } from "lucide-react";
import AdminNavbar from "../Component/AdminNavbar";
import { deleteUser, getUsers } from "../services/adminApi";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        getUsers()
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
            deleteUser(id).then(() => {
                // Optimistic UI update instead of page reload
                setUsers(users.filter(u => u.id !== id));
            });
        }
    };

    return (
        <>
            <AdminNavbar />
            <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-10 flex justify-center">
                <div className="w-full max-w-4xl">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                <UsersIcon className="bg-indigo-600 text-white p-1.5 rounded-xl" size={32} />
                                User Management
                            </h2>
                            <p className="text-slate-500 mt-1">Manage and monitor registered platform users.</p>
                        </div>
                        <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Users</span>
                            <span className="text-2xl font-black text-indigo-600">{users.length}</span>
                        </div>
                    </div>

                    {/* Users List Card */}
                    <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                                        <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence>
                                        {users.length > 0 ? (
                                            users.map((u, index) => (
                                                <motion.tr
                                                    key={u.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-indigo-50/30 transition-colors group"
                                                >
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                                                {u.email.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-700 font-semibold">{u.email}</span>
                                                                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">Verified User</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                                <Mail size={14} className="text-slate-300" /> {u.email}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                                <Phone size={14} className="text-slate-300" /> {u.phone || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button
                                                            onClick={() => handleDelete(u.id)}
                                                            className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-8 py-20 text-center">
                                                    {loading ? (
                                                        <div className="animate-pulse text-slate-400 font-medium">Loading user database...</div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-slate-300">
                                                            <ShieldAlert size={48} />
                                                            <span className="font-semibold text-slate-400">No users found.</span>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <p className="text-center mt-8 text-slate-400 text-sm">
                        Careful: Deleting a user will permanently remove their access to the platform.
                    </p>
                </div>
            </div>
        </>
    );
}