import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, Sparkles, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import BookingModal from "../BookingModel";
import Hero from "../Hero";
import PropertyCard from "../PropertyCard";

export default function Home({ user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filter, setFilter] = useState("ALL");

  // 🔍 EMAIL SEARCH
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // 📅 BOOKINGS
  const [bookings, setBookings] = useState([]);



// Delete Bookings 
const cancelBooking = async (bookingId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmDelete) return;

  try {
    await axiosInstance.delete(`/bookings/delete/${bookingId}`);

    // ✅ Remove booking from UI instantly
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));

    alert("Booking cancelled successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to cancel booking");
  }
};



  // ===============================
  // FETCH BOOKINGS BY EMAIL
  // ===============================
  const fetchBookings = async () => {
    try {
      setError("");

      if (!email || !email.trim()) {
        setError("Please enter a valid email");
        return;
      }

      const encodedEmail = encodeURIComponent(email.trim());

      const res = await axiosInstance.get(
        `/bookings/user/${encodedEmail}`
      );

      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
      setError("No bookings found for this email");
      setBookings([]);
    }
  };

  // ===============================
  // FETCH PROPERTIES
  // ===============================
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get("/properties?size=1000");
        setProperties(res.data?.content || res.data || []);

      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ===============================
  // FILTER PROPERTIES
  // ===============================
  const filteredItems =
    filter === "ALL"
      ? properties
      : properties.filter((p) => p.type === filter);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Hero />

      {/* ===============================
          MY BOOKINGS
      =============================== */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6">
          My Scheduled Visits
        </h2>

        {/* SEARCH BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={fetchBookings}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* BOOKINGS LIST */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-slate-400">
            No bookings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {bookings.map((b) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={b.id}
      className="group bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
    >
      {/* Property Preview */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={b.propertyImage} 
          alt={b.propertyTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-5 right-5">
           <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border
            ${b.status === "APPROVED" ? "bg-emerald-500/90 text-white border-emerald-400" : 
              b.status === "REJECTED" ? "bg-red-500/90 text-white border-red-400" : 
              "bg-amber-500/90 text-white border-amber-400"}
          `}>
            {b.status}
          </span>
        </div>

        <div className="absolute bottom-5 left-6 right-6">
          <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Scheduled Visit</p>
          <h3 className="text-white font-bold text-xl line-clamp-1 tracking-tight">
            {b.propertyTitle}
          </h3>
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-8 flex flex-col flex-grow bg-white">
        
        {/* Visit Information */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-slate-100">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Date</p>
              <p className="text-slate-900 font-bold">{b.visitDate}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Time Slot</p>
            <p className="text-slate-900 font-bold">{b.visitTime}</p>
          </div>
        </div>

        {/* Informational Message based on status */}
        <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
          b.status === "APPROVED" ? "bg-emerald-50/50 border-emerald-100 text-emerald-700" : 
          b.status === "REJECTED" ? "bg-red-50/50 border-red-100 text-red-700" : 
          "bg-slate-50 border-slate-100 text-slate-500"
        }`}>
          {b.status === "APPROVED" ? (
            <>
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">Your visit is confirmed! Our agent will meet you at the property at the scheduled time.</p>
            </>
          ) : b.status === "REJECTED" ? (
            <>
              <XCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">This slot was unavailable. Please try booking a different date or contact support.</p>
            </>
          ) : (
            <>
              <Clock size={18} className="shrink-0 mt-0.5" />
              
              <p className="text-xs font-medium leading-relaxed">Request received. Our team is reviewing your preferred slot and will update you shortly.</p>
            </>
          )}
        </div>

        {/* Property Quick Link */}
         <button
  onClick={() => cancelBooking(b.id)}
  className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all"
>
  Cancel Booking
</button>

      </div>
    </motion.div>
  ))}
</div>
        )}
      </section>

      {/* ===============================
          PROPERTIES
      =============================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-[0.3em] mb-3">
              <Sparkles size={14} /> Premium Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Featured Properties
            </h2>
          </motion.div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border">
            {["ALL", "BUY", "RENT"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition
                  ${filter === type
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <PropertyCard
                  key={item.id}
                  item={item}
                  onBook={(prop) => setSelectedProperty(prop)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {selectedProperty && (
          <BookingModal
            property={selectedProperty}
            user={user}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
