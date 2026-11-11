import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Star, Sparkles, Trophy, ArrowRight } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import PropertyCard from "../PropertyCard";
import BookingModal from "../BookingModel";

export default function Featured() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // --- Backend Integration ---
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Targets the @GetMapping("/featured") endpoint in your PropertyController
        const res = await axiosInstance.get("/properties/featured?size=1000");
        
        // Handles Spring Data Page: res.data.content
        const data = res.data.content || res.data || [];
        setProperties(data);
      } catch (err) {
        console.error("Failed to load featured properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Luxury Header --- */}
        <header className="text-center mb-20 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 border border-amber-100"
          >
            <Trophy size={14} /> Handpicked Collection
          </motion.div>
          
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">Iconic</span> Listings
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Discover the most prestigious properties in our inventory, characterized by exceptional design and prime locations.
          </p>

          {/* Decorative Elements */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-200/20 blur-[100px] -z-10 rounded-full" />
        </header>

        {/* --- Featured Content --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-amber-500" size={48} />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Unveiling Excellence...</p>
          </div>
        ) : (
          <>
            {properties.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
              >
                <AnimatePresence>
                  {properties.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      className="relative"
                    >
                      {/* Premium Badge */}
                      <div className="absolute -top-3 -right-3 z-20 bg-white p-2 rounded-full shadow-xl border border-amber-100">
                        <Star size={20} className="text-amber-500" fill="currentColor" />
                      </div>

                      <PropertyCard 
                        item={item} 
                        onBook={() => setSelectedProperty(item)} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-32">
                <Sparkles size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 text-lg font-bold">New luxury listings arriving soon.</p>
              </div>
            )}
          </>
        )}

        {/* --- Bottom Navigation --- */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <button className="inline-flex items-center gap-2 text-slate-900 font-black hover:gap-4 transition-all duration-300">
              Explore All Categories <ArrowRight size={20} className="text-amber-500" />
            </button>
          </motion.div>
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