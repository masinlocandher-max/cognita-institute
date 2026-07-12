import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLockup from "@/components/BrandLockup";

const NAV_LINKS = [
  { label: "Programs", path: "/program" },
  { label: "Admissions", path: "/apply" },
  { label: "Organization", path: "/organization" },
  { label: "Institutions", path: "/partner" },
  { label: "Teach", path: "/teach" },
  { label: "FAQ", path: "/faq" },
  { label: "Records", path: "/verify" },
  { label: "Contact", path: "/contact" },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#050914]/76 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#050914]/64">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-[68px] flex items-center justify-between">
        <Link to="/" className="flex-shrink-0" aria-label="Cognita Institute home">
          <BrandLockup size="sm" />
        </Link>

        <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-white/[0.08] text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="apple-button-secondary px-4 py-2 text-sm font-medium"
          >
            Student Portal
          </Link>
          <Link
            to="/apply"
            className="apple-button-primary px-5 py-2 text-sm font-semibold"
          >
            Admissions
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.07] bg-[#050914]/96 backdrop-blur-2xl">
          <div className="px-5 py-5 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-3 py-3 text-sm font-medium ${
                  location.pathname === link.path
                    ? "bg-white/[0.06] text-white"
                    : "text-slate-400 hover:bg-white/[0.035] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-3 border-t border-white/[0.07] grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="apple-button-secondary px-4 py-3 text-center text-sm font-medium"
              >
                Student Portal
              </Link>
              <Link
                to="/apply"
                onClick={() => setOpen(false)}
                className="apple-button-primary px-4 py-3 text-center text-sm font-semibold"
              >
                Admissions
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
