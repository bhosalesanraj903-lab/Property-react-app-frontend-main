import { AnimatePresence, motion } from 'framer-motion';
import {
  Bath,
  Bed,
  Mail,
  MapPin,
  Maximize,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Coastal from '../../assets/Images/Coastal.png';
import Contemporary from '../../assets/Images/Contemporary.png';
import Mountain from '../../assets/Images/Mountain.png';
import Rustic from '../../assets/Images/Rustic.png';
import Ultra from '../../assets/Images/Ultra.png';
import Warm from '../../assets/Images/Warm.png';

import axiosInstance from '../../services/axiosInstance';

// Import your login components
import Login from '../Auth/Login';

const heroImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1974&h=700',Coastal,Contemporary,Mountain
];

// Fallback photos for listings saved without an image
const fallbackImages = [Coastal, Contemporary, Mountain, Warm, Ultra, Rustic];

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);

// Map a property from the backend to the fields the landing cards use
const toCard = (p, i) => ({
  id: p.id,
  img: p.imageUrls?.[0] || fallbackImages[i % fallbackImages.length],
  price: formatPrice(p.price),
  title: p.title,
  location: p.location,
  beds: p.bedrooms || 0,
  baths: p.bathrooms || 0,
  sqft: p.squareFeet || 0,
});

const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'villa', label: 'Villa' },
];

const bedOptions = [
  { value: '1', label: '1+ Bed' },
  { value: '2', label: '2+ Beds' },
  { value: '3', label: '3+ Beds' },
  { value: '4', label: '4+ Beds' },
];

const priceOptions = [
  { value: '0-250000', label: '$0 - $250K' },
  { value: '250000-500000', label: '$250K - $500K' },
  { value: '500000-750000', label: '$500K - $750K' },
  { value: '750000-1000000', label: '$750K - $1M' },
  { value: '1000000-max', label: '$1M+' },
];

const selectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '0.75rem',
    borderColor: '#e6e0d6',
    boxShadow: 'none',
    '&:hover': { borderColor: '#8fbca6' },
    minHeight: '52px',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
  }),
  placeholder: (provided) => ({ ...provided, color: '#a59d90' }),
  singleValue: (provided) => ({ ...provided, color: '#1d1a17' }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f1f7f4' : 'white',
    color: '#1d1a17',
  }),
  menu: (provided) => ({ ...provided, borderRadius: '0.75rem', zIndex: 99 }),
};

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Search state
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState(null);
  const [beds, setBeds] = useState(null);
  const [priceRange, setPriceRange] = useState(null);

  // Featured listings come from the backend, so they match the admin panel
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await axiosInstance.get("/properties/featured?size=1000");
        let list = res.data?.content || [];
        // No featured listings yet: show the newest ones instead
        if (list.length === 0) {
          const all = await axiosInstance.get("/properties?size=6");
          list = all.data?.content || [];
        }
        setFeaturedProperties(list.map(toCard));
      } catch (err) {
        console.error("Error loading featured properties:", err);
      }
    };
    loadFeatured();
  }, []);

  useEffect(() => {
    // const token = localStorage.getItem('accessToken');
    // if (token) setIsLoggedIn(true);
    
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.success('Logged out successfully.');
    navigate('/');
  };

  // Restrict feature logic
  const handleRestrictedAction = (e) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to perform this task", {
        duration: 3000,
        position: 'top-center',
      });
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (handleRestrictedAction()) {
      toast.success(`Searching ${location} for ${propertyType?.label}...`);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-cream/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-semibold text-brand-900 tracking-wide">
            ESTATE.PRO
          </Link>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-brand-800 hover:text-brand-600 transition">
                Logout
              </button>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="px-4 py-2 text-sm font-semibold text-brand-800 hover:text-brand-600 transition">
                Sign In
              </button>
            )}
            <button onClick={handleRestrictedAction} className="hidden md:block px-5 py-2 rounded-md bg-brand-900 text-cream text-sm font-semibold hover:bg-brand-700 transition">
              List Property
            </button>
          </div>
        </div>
      </nav>

      {/* Hero: split layout */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:col-span-5">
            <motion.div variants={fadeInUp} className="h-1 w-16 bg-brass mb-8" />
            <motion.h1 variants={fadeInUp} className="font-serif text-5xl lg:text-7xl font-semibold leading-[1.05] text-brand-950">
              Discover Your <span className="italic text-brass">Dream</span> Home
            </motion.h1>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-3">
              <button onClick={handleRestrictedAction} className="px-7 py-3.5 rounded-md bg-brand-900 text-cream font-semibold hover:bg-brand-700 transition">
                List Property
              </button>
              {!isLoggedIn && (
                <button onClick={() => setShowLoginModal(true)} className="px-7 py-3.5 rounded-md border border-brand-900 text-brand-900 font-semibold hover:bg-brand-50 transition">
                  Sign In
                </button>
              )}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-7 relative">
            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-brass rounded-xl hidden sm:block" />
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <Carousel
                showThumbs={false}
                showStatus={false}
                showArrows={false}
                infiniteLoop={true}
                autoPlay={true}
                interval={5000}
                transitionTime={800}
              >
                {heroImages.map((img, index) => (
                  <div key={index}>
                    <img src={img} className="w-full h-[360px] lg:h-[520px] object-cover" alt={`Luxury Home ${index + 1}`} />
                  </div>
                ))}
              </Carousel>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-6 bg-sand">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 border-b border-slate-300 pb-6">
            <h2 className="font-serif text-4xl font-semibold text-brand-950 m-0">Featured Properties</h2>
            <span className="hidden sm:block h-1 w-24 bg-brass" />
          </div>
          <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                onClick={handleRestrictedAction}
                className="group bg-cream rounded-lg overflow-hidden border border-slate-200 hover:border-brand-400 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="h-60 overflow-hidden relative">
                  <img src={property.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={property.title} />
                  <div className="absolute bottom-0 left-0 bg-brand-900 text-cream px-4 py-2 text-sm font-bold">{property.price}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-brand-950 mb-2">{property.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-5"><MapPin size={15} className="text-brass" /> {property.location}</div>
                  <div className="flex justify-between pt-4 border-t border-dashed border-slate-300 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <span className="flex items-center gap-1.5"><Bed size={14} className="text-brand-500" /> {property.beds} BD</span>
                    <span className="flex items-center gap-1.5"><Bath size={14} className="text-brand-500" /> {property.baths} BA</span>
                    <span className="flex items-center gap-1.5"><Maximize size={14} className="text-brand-500" /> {property.sqft} SQFT</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Poster */}
      <section className="py-20 px-6 bg-brand-900 text-cream">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-serif text-4xl font-semibold mb-3">Ready to find your next home?</h2>
            <p className="text-lg text-brand-200 m-0">Unlock exclusive deals and expert support by signing in today.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={handleRestrictedAction}
            className="shrink-0 bg-brass text-brand-950 font-bold px-10 py-4 rounded-md text-lg"
          >
            {isLoggedIn ? "Contact an Agent" : "Sign in to contact"}
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-cream">
        <div className="h-1 bg-brass" />
        <div className="max-w-7xl mx-auto py-14 px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div><h4 className="font-serif text-2xl mb-3">ESTATE.PRO</h4><p className="text-brand-300 text-sm">Your trusted real estate partner.</p></div>
          <div><h4 className="text-xs font-bold uppercase tracking-widest text-brass mb-4">Quick Links</h4><ul className="text-brand-200 space-y-2 p-0 list-none text-sm"><li>Buy</li><li>Sell</li></ul></div>
          <div><h4 className="text-xs font-bold uppercase tracking-widest text-brass mb-4">Support</h4><ul className="text-brand-200 space-y-2 p-0 list-none text-sm"><li>FAQs</li><li>Privacy</li></ul></div>
          <div><h4 className="text-xs font-bold uppercase tracking-widest text-brass mb-4">Contact</h4><ul className="text-brand-200 space-y-2 p-0 list-none text-sm"><li className="flex items-center gap-2"><Mail size={16}/> support@example.org</li></ul></div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-brand-950/70 backdrop-blur-sm flex justify-center items-center z-[100]" onClick={() => setShowLoginModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="relative bg-cream rounded-xl shadow-2xl max-w-md w-full overflow-hidden border-t-4 border-brass">
              <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-[110]"><X size={24} /></button>
              <Login />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
