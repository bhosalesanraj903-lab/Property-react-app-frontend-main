import { CheckCircle, XCircle, Calendar, Mail, Phone, Search, Loader2, Clock, FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../services/axiosInstance";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    const loadBookings = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/bookings");
            setBookings(res.data || []);
        } catch (err) {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axiosInstance.put(`/admin/bookings/${id}/status`, null, {
                params: { status },
            });
            toast.success(`Booking ${status.toLowerCase()}`);
            loadBookings();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    // --- CSV EXPORT LOGIC ---
    const exportCSV = () => {
        if (bookings.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const headers = ["Property Title", "Customer Name", "Email", "Phone", "Visit Date", "Visit Time", "Status"];

        const rows = bookings.map(b => [
            `"${b.propertyTitle}"`, // Wrapped in quotes to handle commas in titles
            `"${b.name}"`,
            b.email,
            b.phone,
            b.visitDate,
            b.visitTime,
            b.status
        ].join(","));

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Bookings_Report_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV Exported Successfully");
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "ALL" || b.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        
        <div className="min-h-screen bg-slate-50/50 font-sans">
            <AdminNavbar />

            <div className="max-w-[1400px] mx-auto p-4 md:p-8 pt-28">

                {/* HEADER SECTION */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Visit Requests</h1>
                        <p className="text-slate-500 font-medium mt-1">Review and approve property site visits.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={exportCSV}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <FileDown size={20} className="text-indigo-600" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* SEARCH & FILTERS BAR */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by customer or property..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
                        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${activeFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLE CONTENT */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Syncing Bookings...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <tr>
                                        <th className="px-8 py-6">Customer Details</th>
                                        <th className="px-8 py-6">Target Property</th>
                                        <th className="px-8 py-6">Visit Schedule</th>
                                        <th className="px-8 py-6">Current Status</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode='popLayout'>
                                        {filteredBookings.map((b) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={b.id}
                                                className="group hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-slate-900">{b.name}</div>
                                                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                                                        <p className="flex items-center gap-2"><Mail size={12} /> {b.email}</p>
                                                        <p className="flex items-center gap-2"><Phone size={12} /> {b.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <img src={b.propertyImage} className="w-12 h-12 rounded-2xl object-cover bg-slate-100" alt="" />
                                                        <div className="font-bold text-slate-700 text-sm">{b.propertyTitle}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="inline-flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900">{b.visitDate}</span>
                                                        <span className="text-[10px] font-black text-indigo-400 uppercase mt-1 tracking-wider">{b.visitTime}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest
                            ${b.status === "APPROVED" ? "bg-emerald-100 text-emerald-600" :
                                                            b.status === "REJECTED" ? "bg-red-100 text-red-600" :
                                                                "bg-orange-100 text-orange-600"}
                          `}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => updateStatus(b.id, "APPROVED")}
                                                            className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                            title="Approve Visit"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(b.id, "REJECTED")}
                                                            className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                            title="Reject Visit"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {filteredBookings.length === 0 && !loading && (
                            <div className="py-24 text-center">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="text-slate-200" size={32} />
                                </div>
                                <h3 className="font-bold text-slate-800">No matching requests</h3>
                                <p className="text-slate-400 text-sm mt-1">Try changing your search or filter settings.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}