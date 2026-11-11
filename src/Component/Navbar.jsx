import { Building2, Home, LogOut, Menu, Phone, Star, X, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/home", icon: <Home size={18}/> },
    { name: "Buy", path: "/buy", icon: <Building2 size={18}/> },
    { name: "Rent", path: "/rent", icon: <Building2 size={18}/> },
    { name: "Featured", path: "/featured", icon: <Star size={18}/> },
    { name: "Contact", path: "/contact", icon: <Phone size={18}/> },
  ];

  return (
    <nav className="bg-brand-900 text-cream sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-md bg-brass text-brand-950 grid place-items-center">
              <Home size={18} />
            </span>
            <span className="font-serif text-xl font-semibold tracking-wide">ESTATE.PRO</span>
          </div>

          {/* Desktop Links */}
          <ul className="hidden lg:flex gap-1 font-medium text-sm m-0 p-0">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      active ? "bg-brand-800 text-brass" : "text-brand-100 hover:text-cream hover:bg-brand-800/60"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <button onClick={logout} className="flex items-center gap-2 border border-brand-600 text-brand-100 text-sm font-semibold px-4 py-2 rounded-md hover:bg-brass hover:border-brass hover:text-brand-950 transition-all">
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-cream" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden bg-brand-950 px-6 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-3 text-base font-semibold text-brand-100 border-b border-brand-800">
              {link.icon}
              {link.name}
            </Link>
          ))}
          <button onClick={logout} className="flex items-center gap-3 w-full text-left text-base font-semibold text-brass pt-4">
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
