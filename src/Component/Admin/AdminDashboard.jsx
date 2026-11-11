import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  FileText,
  Loader2,
  Mail,
  Users,
  Eye,
  X,
  BedDouble,
  Bath,
  Square,
  UserPlus,
  Star,
  ShieldCheck
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { generateAdminReport } from "../../services/reportGenerator";
import AdminNavbar from "../AdminNavbar";
import PropertyCard from "../PropertyCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, bookings: 0, contacts: 0 });
  const [properties, setProperties] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
   // 🔹 Add Admin form state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");





  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, bookingsRes, contactsRes, propsRes] = await Promise.all([
          axiosInstance.get("/admin/users"),
          axiosInstance.get("/admin/bookings"),
          axiosInstance.get("/admin/contacts"),
          axiosInstance.get("/properties?size=1000")
        ]);

        // Fix: Robust data extraction
        const propData = propsRes.data.content || propsRes.data.properties || propsRes.data;
        const userData = usersRes.data.content || usersRes.data;

        setStats({
          users: Array.isArray(userData) ? userData.length : 0,
          bookings: (bookingsRes.data.content || bookingsRes.data).length || 0,
          contacts: (contactsRes.data.content || contactsRes.data).length || 0
        });

        setProperties(Array.isArray(propData) ? propData : []);
        // Filter admins from users list if applicable
        setAdmins(Array.isArray(userData) ? userData.filter(u => u.role === 'ADMIN') : []);

      } catch (error) {
        console.error("Data fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


    /* =======================
     CREATE ADMIN
     ======================= */
  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!adminEmail || !adminPassword) {
      setAdminMessage("❌ All fields are required");
      return;
    }

    try {
      setAdminLoading(true);
      setAdminMessage("");

      const res = await axiosInstance.post("/admin/create", {
        email: adminEmail,
        password: adminPassword
      });

      // Update admin list instantly
      setAdmins(prev => [...prev, res.data]);

      setAdminMessage("✅ Admin created successfully");
      setAdminEmail("");
      setAdminPassword("");

      // Auto close modal
      setTimeout(() => setShowAddAdmin(false), 1200);

    } catch (err) {
      console.error(err);
      setAdminMessage("❌ Failed to create admin");
    } finally {
      setAdminLoading(false);
    }
  };






  const toggleFeatured = async (id, currentStatus) => {
    try {
      await axiosInstance.patch(`/properties/admin/${id}/featured`, { featured: !currentStatus });
      setProperties(properties.map(p => p.id === id ? { ...p, featured: !currentStatus } : p));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <>
      <AdminNavbar />
       <div className=" mt-17 lg:mt-31 w-full"></div>
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 pt-32 lg:pt-40">
        <div className="max-w-[1600px] mx-auto">
          
          {/* HEADER */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Control</h1>
              <p className="text-slate-500">Manage admins, property inventory, and reports.</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddAdmin(true)}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl hover:bg-slate-50 transition-all font-bold shadow-sm"
              >
                <UserPlus size={20} /> Add Admin
              </button>
              <button 
                onClick={() => generateAdminReport(stats, properties)}
                disabled={isGenerating || loading} 
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-200 font-bold"
              >
                <FileText size={20} /> Report
              </button>
            </div>
          </header>

          {/* ADMINS LIST QUICK VIEW */}
          <div className="mb-10 bg-indigo-900 rounded-xl p-8 text-white flex flex-wrap items-center gap-6">
            <div className="flex -space-x-3">
              {admins.slice(0, 5).map((admin, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-indigo-900 bg-indigo-500 flex items-center justify-center font-bold text-sm">
                  {admin.name?.charAt(0) || 'A'}
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-lg">Active Administrators</h4>
              <p className="text-indigo-300 text-sm">{admins.length} accounts with system access</p>
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[{ title: "Total Users", val: stats.users, icon: <Users />, col: "bg-blue-50 text-blue-500" },
              { title: "Bookings", val: stats.bookings, icon: <CalendarCheck />, col: "bg-purple-50 text-purple-500" },
              { title: "Enquiries", val: stats.contacts, icon: <Mail />, col: "bg-orange-50 text-orange-500" }
            ].map((s, i) => (
              <motion.div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className={`w-12 h-12 ${s.col} rounded-2xl flex items-center justify-center mb-4`}>{s.icon}</div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{s.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{loading ? "..." : s.val}</h3>
              </motion.div>
            ))}
          </div>

          {/* PROPERTY TABLE */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-2xl text-slate-800">Property Inventory</h2>
                <p className="text-slate-500 text-sm">Update visibility and featured status</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                  <tr>
                    <th className="px-8 py-5">Preview</th>
                    <th className="px-8 py-5">Property Title</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <img src={p.imageUrls?.[0] || p.imageUrl} className="w-16 h-12 rounded-xl object-cover bg-slate-100" alt="" />
                      </td>
                      <td className="px-8 py-4">
                        <div className="font-bold text-slate-800">{p.title}</div>
                        <div className="text-xs text-slate-400">{p.location}</div>
                      </td>
                      <td className="px-8 py-4">
                        <button 
                          onClick={() => toggleFeatured(p.id, p.featured)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                            p.featured ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <Star size={12} fill={p.featured ? "currentColor" : "none"} />
                          {p.featured ? "Featured" : "Standard"}
                        </button>
                      </td>
                      <td className="px-8 py-4 font-bold text-indigo-600">₹{p.price}</td>
                      <td className="px-8 py-4 text-right">
                        <button 
                          onClick={() => setSelectedProperty(p)}
                          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-md"
                        >
                          <Eye size={14} /> View Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTY CARD MODAL */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProperty(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-2xl">
              <button onClick={() => setSelectedProperty(null)} className="absolute top-4 right-4 z-[1100] bg-white p-2 rounded-full shadow-lg hover:text-red-500"><X size={20} /></button>
              <PropertyCard item={{ ...selectedProperty, imageUrls: selectedProperty.imageUrls || [selectedProperty.imageUrl] }} onBook={() => {}} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
{/* ================= ADD ADMIN MODAL ================= */}

 <AnimatePresence>
        {showAddAdmin && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div
              onClick={() => setShowAddAdmin(false)}
              className="absolute inset-0 bg-black/60"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md z-10"
            >
              <h2 className="text-2xl font-bold mb-4">Create Admin</h2>

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl"
                  required
                />

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold"
                >
                  {adminLoading ? "Creating..." : "Create Admin"}
                </button>

                {adminMessage && (
                  <p className="text-center font-semibold">
                    {adminMessage}
                  </p>
                )}
              </form>

              <button
                onClick={() => setShowAddAdmin(false)}
                className="absolute top-4 right-4"
              >
                <X />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



    </>
  );
}