import React from "react";
import { Link } from "react-router-dom";
import BrandLockup from "@/components/BrandLockup";
import CinematicBackground from "@/components/CinematicBackground";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <CinematicBackground className="min-h-screen flex items-center justify-center px-4 py-20" grid={false}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLockup size="md" className="mb-8" />
          <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>}
        </div>
        <div className="card-glow rounded-2xl p-6 md:p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </div>
    </CinematicBackground>
  );
}