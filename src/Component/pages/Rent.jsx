import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, Building2, MapPin, Filter } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import PropertyCard from "../PropertyCard";
import BookingModal from "../BookingModel";

export default function Rent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Backend Integration ---
  useEffect(() => {
    const fetchRentProperties = async () => {
      try {
        setLoading(true);
        // Specifically fetching RENT category from your Spring Boot controller
        const res = await axiosInstance.get("/properties/type/RENT?size=1000");
        
        // Handling Spring Page structure: res.data.content
        const data = res.data.content || res.data || [];
        setProperties(data);
      } catch (err) {
        console.error("Failed to load rental properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentProperties();
  }, []);

  // Search filter logic
  const filteredRentals = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Section Header --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4"
            >
              <Building2 size={16} /> Verified Rentals
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
              Flexible Living <br />
              <span className="text-emerald-600">On Your Terms</span>
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-medium">
              Explore fully furnished apartments and cozy studios across India.
            </p>
          </div>

          {/* Search Bar */}
          {/* <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="City, area, or society..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm outline-none font-medium"
            />
          </div> */}
        </header>

        {/* --- Rentals Grid --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Fetching best deals...</p>
          </div>
        ) : (
          <>
            {filteredRentals.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                <AnimatePresence>
                  {filteredRentals.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Passing "/mo" to price for Rental Context */}
                      <PropertyCard 
                        item={{...item, price: `${item.price}/mo`}} 
                        onBook={() => setSelectedProperty(item)} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-200 py-32 text-center">
                <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
                  <MapPin size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-500 text-lg font-bold">No rentals found in this area.</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-emerald-600 font-bold hover:underline"
                >
                  Show all rentals
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- Booking Modal --- */}
      <AnimatePresence>
        {selectedProperty && (
          <BookingModal 
            property={selectedProperty} 
            onClose={() => setSelectedProperty(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}