import { Calendar, LayoutDashboard, LogOut, Mail, Menu, Users, X, Bell, UserCircle, ChevronRight, LandPlot } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNavbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { path: "/admin", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { path: "/admin/users", name: "Users", icon: <Users size={18} /> },
        { path: "/admin/bookings", name: "Bookings", icon: <Calendar size={18} /> },
        { path: "/admin/contacts", name: "Messages", icon: <Mail size={18} /> },
        { path: "/admin/properties", name: "Properties", icon: <LandPlot size={18} /> },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-200">
            {/* ROW 1: BRAND & PROFILE */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Mobile Hamburger (Only visible on small screens) */}
                    <button 
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/admin")}>
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                            <span className="font-bold">R</span>
                        </div>
                        <span className="font-black text-xl tracking-tight hidden sm:block italic">
                            REALTY<span className="text-indigo-600 text-sm align-top ml-0.5">OS</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <button className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        System Online
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none">Admin Panel</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-1">Lead Access</p>
                        </div>
                        <UserCircle size={32} className="text-slate-300" />
                    </div>
                </div>
            </div>

            {/* ROW 2: NAVIGATION (Visible on Desktop) */}
            <div className="hidden lg:block bg-slate-50/50 border-t border-slate-100">
                <div className="max-w-[1600px] mx-auto px-8 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                                    ${isActive 
                                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                                        : "text-slate-500 hover:text-indigo-600 hover:bg-white"}
                                `}
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-400 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* MOBILE MENU (Slide Down) */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
                    >
                        <div className="p-4 space-y-2">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={({ isActive }) => `
                                        flex items-center justify-between px-4 py-4 rounded-xl font-bold
                                        ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        {item.name}
                                    </div>
                                    <ChevronRight size={16} />
                                </NavLink>
                            ))}
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-bold border-t mt-2"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}