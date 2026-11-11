import { useEffect, useState } from "react";
import BookingModal from "../BookingModel";
import PropertyCard from "../PropertyCard";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, SlidersHorizontal, Home as HomeIcon } from "lucide-react";

export default function Buy() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Backend Integration ---
  useEffect(() => {
    const fetchBuyProperties = async () => {
      try {
        setLoading(true);
        // Fetching properties specifically of type "BUY" from your backend
        const res = await axiosInstance.get("/properties/type/BUY?size=1000");
        
        // Handling Spring Page object structure
        const data = res.data.content || res.data || [];
        setProperties(data);
      } catch (err) {
        console.error("Failed to load buy properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyProperties();
  }, []);

  // Filter properties based on search input
  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Header & Search Section --- */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-[0.2em] mb-4">
              <HomeIcon size={16} /> Exclusive Listings
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
              Invest in your <br /> 
              <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Future Home</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Search by city or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm outline-none"
              />
            </div> */}
            {/* <button className="bg-white border border-slate-200 p-4 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2 font-bold text-slate-700">
              <SlidersHorizontal size={20} />
              Filters
            </button> */}
          </div>
        </header>

        {/* --- Content Grid --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Listings...</p>
          </div>
        ) : (
          <>
            {filteredProperties.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                <AnimatePresence>
                  {filteredProperties.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <PropertyCard 
                        item={item} 
                        onBook={() => setSelectedProperty(item)} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-200 py-32 text-center">
                <p className="text-slate-400 text-lg font-medium">No properties match your search criteria.</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-indigo-600 font-black hover:underline"
                >
                  Clear All Filters
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