import React from "react";
import QRCode from "@/components/QRCode";
import { getVerificationUrl } from "@/lib/business-utils";

export default function CertificateTemplate({ certificate, preview = false }) {
  if (!certificate) return null;

  const verificationUrl = getVerificationUrl(certificate.serial_number);

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="relative bg-[#0a1628] border-2 border-cyan-500/30 rounded-lg p-6 md:p-10 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,174,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,174,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-cyan-400/40" />
        <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-cyan-400/40" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-cyan-400/40" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-cyan-400/40" />

        {/* Inner border line */}
        <div className="absolute inset-4 border border-cyan-500/15 rounded" />

        <div className="relative text-center">
          {/* Header */}
          <div className="mb-1">
            <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-cyan-400/80">
              COGNITA
            </p>
            <p className="text-[9px] md:text-[10px] tracking-[0.2em] text-white/40">
              INSTITUTE OF AI
            </p>
          </div>

          <div className="w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mx-auto my-3" />

          {/* Title */}
          <h1 className="text-sm md:text-lg font-heading font-bold text-white mb-1 tracking-wide">
            Certificate of Practical AI Competency
          </h1>

          {preview && (
            <p className="text-[9px] text-amber-400/60 mb-3 italic">PREVIEW</p>
          )}

          {/* Awarded to */}
          <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest mt-4 mb-2">
            This certificate is proudly awarded to
          </p>
          <h2 className="text-xl md:text-3xl font-heading font-bold text-white mb-1">
            {certificate.student_name}
          </h2>

          <div className="w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent mx-auto my-3" />

          {/* Completion details */}
          <p className="text-[10px] md:text-xs text-white/50 leading-relaxed max-w-md mx-auto mb-5">
            for successfully completing the 10-week Cognita AI Academy program,
            including all required weekly outputs, portfolio, and capstone defense.
          </p>

          {/* Details grid */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 max-w-md mx-auto mb-5">
            <div>
              <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-cyan-400/60 mb-1">Track</p>
              <p className="text-[10px] md:text-xs font-medium text-white/90 leading-tight">{certificate.track}</p>
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-cyan-400/60 mb-1">Batch</p>
              <p className="text-[10px] md:text-xs font-medium text-white/90 leading-tight">{certificate.batch_name}</p>
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-cyan-400/60 mb-1">Completed</p>
              <p className="text-[10px] md:text-xs font-medium text-white/90 leading-tight">{certificate.issued_date}</p>
            </div>
          </div>

          {/* Serial + QR */}
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-5">
            <div className="text-left">
              <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-cyan-400/60 mb-1">Serial Number</p>
              <p className="text-[10px] md:text-xs font-mono font-bold text-white tracking-wider">
                {certificate.serial_number}
              </p>
            </div>
            <div className="bg-white p-1.5 rounded">
              <QRCode data={verificationUrl} size={72} />
            </div>
          </div>

          {/* Founder signature */}
          <div className="border-t border-cyan-500/15 pt-4 max-w-xs mx-auto">
            <p className="text-[11px] md:text-sm font-heading font-medium text-white italic mb-1">
              Francine Marie Bautista
            </p>
            <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-cyan-400/60">
              Founder and Pioneer Trainer
            </p>
          </div>

          {/* Verification note */}
          <div className="mt-4 mx-auto max-w-sm">
            <p className="text-[8px] md:text-[9px] text-white/30 leading-relaxed italic">
              {certificate.verification_note || "This certificate was issued based on completed and reviewed outputs, not attendance."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}