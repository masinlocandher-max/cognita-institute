import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLockup from "@/components/BrandLockup";

const NAV_LINKS = [
  { label: "About", path: "/about" },
  { label: "Program", path: "/program" },
  { label: "Tracks", path: "/tracks" },
  { label: "Partners", path: "/partner" },
  { label: "Teach", path: "/teach" },
  { label: "FAQ", path: "/faq" },
  { label: "Verify", path: "/verify" },
  { label: "Contact", path: "/contact" },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/10 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0">
          <BrandLockup size="sm" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === l.path
                  ? "text-cyan-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/apply" className="btn-glow px-5 py-2 text-sm font-semibold rounded-lg">
            Apply Now
          </Link>
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-cyan-500/10 bg-background/95 backdrop-blur-xl">
          <div className="px-5 py-4 space-y-3">
            {NAV_LINKS.map(l => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border/50 space-y-2">
              <Link to="/apply" onClick={() => setOpen(false)} className="btn-glow block w-full text-center px-5 py-2.5 text-sm font-semibold rounded-lg">
                Apply Now
              </Link>
              <Link to="/login" onClick={() => setOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-muted-foreground">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}