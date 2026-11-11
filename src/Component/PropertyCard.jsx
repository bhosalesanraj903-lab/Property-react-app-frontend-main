import { Bath, BedDouble, Calendar, ChevronLeft, ChevronRight, MapPin, Square, Star } from "lucide-react";
import { useState } from "react";

/**
 * @param {Object} item - Individual property object from res.data.content
 * @param {Function} onBook - Function to handle booking logic
 */
export default function PropertyCard({ item, onBook }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Backend Image Mapping
  // Since you use Multipart uploads, images are usually in imageUrls (Array) 
  // or imageUrl (String). This handles both + a placeholder.
  const images = item?.imageUrls?.length > 0
    ? item.imageUrls
    : item?.imageUrl
      ? [item.imageUrl]
      : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"];

  // 2. Formatting Price for Indian Currency (₹)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const nextSlide = (e) => {
    e.stopPropagation(); // Prevents triggering parent clicks
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!item) return null;

  return (
    <div className="bg-cream rounded-lg overflow-hidden border border-slate-200 hover:border-brand-400 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">

      {/* --- Visual Section (Carousel) --- */}
      <div className="relative h-64 overflow-hidden group/carousel">
        <img
          src={images[currentIndex]}
          alt={item.title}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Status Badges */}
        <div className="absolute top-0 left-0 flex z-20">
          <div className="bg-brand-900 text-cream px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
            {item.type || "SALE"}
          </div>
          {item.featured && (
            <div className="bg-brass text-brand-950 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Star size={12} fill="currentColor" /> Featured
            </div>
          )}
        </div>

        {/* Carousel Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-cream/90 p-2 rounded-md shadow opacity-0 group-hover/carousel:opacity-100 transition-all z-30 hover:bg-brand-900 hover:text-cream active:scale-90"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-cream/90 p-2 rounded-md shadow opacity-0 group-hover/carousel:opacity-100 transition-all z-30 hover:bg-brand-900 hover:text-cream active:scale-90"
            >
              <ChevronRight size={18} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 transition-all duration-300 ${
                    i === currentIndex ? "bg-brass w-6" : "bg-cream/60 w-3"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- Details Section --- */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-2xl font-bold text-brand-700 mb-1">
          {formatPrice(item.price)}
        </span>
        <h3 className="font-serif text-xl font-semibold text-brand-950 line-clamp-1 mb-2">{item.title}</h3>

        <div className="flex items-center text-slate-500 text-sm mb-5">
          <MapPin size={15} className="mr-1.5 text-brass" /> {item.location}
        </div>

        {/* Icons/Specs Row */}
        <div className="flex justify-between py-3 border-y border-dashed border-slate-300 mb-5 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <span className="flex items-center gap-1.5">
            <BedDouble size={16} className="text-brand-500" /> {item.bedrooms || 0} Beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={16} className="text-brand-500" /> {item.bathrooms || 0} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <Square size={16} className="text-brand-500" /> {item.squareFeet || 0} Sqft
          </span>
        </div>

        {/* Description Line Clamp */}
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {item.description}
        </p>

        {/* Booking Action */}
        <button
          onClick={() => onBook(item)}
          className="w-full flex items-center justify-center gap-2 border border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-cream font-semibold py-3 rounded-md transition-all duration-200 active:scale-[0.98]"
        >
          <Calendar size={18} />
          Book Viewing
        </button>
      </div>
    </div>
  );
}
