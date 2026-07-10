import React from "react";
import { Link } from "react-router-dom";
import BrandLockup from "@/components/BrandLockup";

export default function PublicFooter() {
  return (
    <footer className="border-t border-cyan-500/10 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <BrandLockup size="sm" className="mb-4" />
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mt-4">
              Most AI academies sell certificates. Cognita builds competence.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Academy</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">About</Link>
              <Link to="/program" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Program</Link>
              <Link to="/tracks" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Tracks</Link>
              <Link to="/faq" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Access</h4>
            <div className="space-y-2">
              <Link to="/apply" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Apply</Link>
              <Link to="/waitlist" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Join Waitlist</Link>
              <Link to="/partner" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Partner with Us</Link>
              <Link to="/verify" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Verify Certificate</Link>
              <Link to="/login" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Sign In</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Legal</h4>
            <div className="space-y-2">
              <Link to="/privacy" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Terms of Use</Link>
              <Link to="/contact" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Contact & Support</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Cognita Institute of Artificial Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}