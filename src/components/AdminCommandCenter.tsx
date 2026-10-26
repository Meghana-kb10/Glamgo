import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Percent,
  Sliders,
  Sparkles,
  FileBadge,
  Instagram,
  Eye,
  Lock,
  ArrowRight
} from 'lucide-react';
import { MOCK_KYC_APPLICANTS } from '../data/mockData';
import { KycApplicant } from '../types';
import { spatialSpring, snappySpring } from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';

export const AdminCommandCenter: React.FC = () => {
  const [applicants, setApplicants] = useState<KycApplicant[]>(MOCK_KYC_APPLICANTS);
  
  // Escrow Split-Commission Sliders
  const [platformCommission, setPlatformCommission] = useState<number>(15); // 15%
  const [escrowGuaranteeFund, setEscrowGuaranteeFund] = useState<number>(3); // 3%
  const artistPayout = 100 - platformCommission - escrowGuaranteeFund; // 82%

  const handleKycDecision = (id: string, decision: 'APPROVED' | 'REJECTED', e: React.MouseEvent) => {
    if (decision === 'APPROVED') {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      triggerChampagneSparkles(
        (rect.left + rect.width / 2) / window.innerWidth,
        (rect.top + rect.height / 2) / window.innerHeight
      );
    }
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: decision } : a))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-gold/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-velvet bg-rose-blush px-2.5 py-0.5 rounded-full">
              Trust & Safety Command
            </span>
            <span className="text-xs text-obsidian-subtle font-mono">
              Root Level Authority
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian mt-1.5">
            Admin Governance & KYC Verification
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-muted">
            Inspect celebrity credentials, portfolio authenticity, and calibrate marketplace split-commission escrow parameters.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white border border-rose-gold/20 shadow-sm text-right">
          <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">
            Platform Escrow Float
          </span>
          <span className="font-mono text-base font-bold text-champagne-dark tabular-nums">
            ₹42,50,000 Nodal Balance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: KYC Artist Portfolio Approval Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-obsidian">
                Artist Portfolio & Credential Approvals
              </h2>
              <span className="text-xs text-obsidian-muted">
                3-stage background check: Government ID, Master Diploma, Raw Video Portfolios
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-rose-gold">
              {applicants.filter((a) => a.status === 'PENDING').length} Pending
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {applicants.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={spatialSpring}
                  className={`p-6 rounded-3xl bg-white border shadow-luxury transition-all ${
                    app.status === 'APPROVED'
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : app.status === 'REJECTED'
                      ? 'border-red-300 opacity-50'
                      : 'border-rose-gold/25'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Applicant Profile */}
                    <div className="flex items-center gap-4">
                      <img
                        src={app.avatar}
                        alt={app.artistName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-champagne"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-obsidian">
                            {app.artistName}
                          </h3>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-surface-cream text-obsidian">
                            {app.category}
                          </span>
                        </div>
                        <span className="text-xs text-obsidian-muted block mt-0.5">
                          {app.city} • {app.experienceYears} Years Documented Experience
                        </span>
                        <span className="text-xs text-rose-gold font-mono flex items-center gap-1 mt-1">
                          <Instagram className="w-3.5 h-3.5" />
                          <span>{app.instagramHandle}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions or Status */}
                    <div>
                      {app.status === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            transition={snappySpring}
                            onClick={(e) => handleKycDecision(app.id, 'APPROVED', e)}
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve Pro</span>
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            transition={snappySpring}
                            onClick={(e) => handleKycDecision(app.id, 'REJECTED', e)}
                            className="px-3 py-2 rounded-xl bg-surface-cream hover:bg-red-50 text-obsidian-muted hover:text-red-700 text-xs font-semibold border border-rose-gold/20"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verification Docs Strip */}
                  <div className="mt-4 pt-4 border-t border-rose-gold/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-cream/60 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-obsidian-subtle uppercase block font-semibold">
                          Government ID
                        </span>
                        <span className="font-mono font-medium text-obsidian">{app.idProof}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-cream/60 flex items-center gap-2">
                      <FileBadge className="w-4 h-4 text-champagne-dark shrink-0" />
                      <div>
                        <span className="text-[10px] text-obsidian-subtle uppercase block font-semibold">
                          Accreditation
                        </span>
                        <span className="font-medium text-obsidian line-clamp-1">{app.certificate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Thumbnail Proofs */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase text-obsidian-subtle mr-1">
                      Submitted Looks:
                    </span>
                    {app.portfolioSamples.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Proof"
                        className="w-12 h-12 rounded-lg object-cover border border-rose-gold/30 cursor-pointer hover:scale-105 transition-transform"
                      />
                    ))}
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Col: Split-Commission Escrow Sliders */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-rose-gold/25 shadow-luxury space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-rose-gold mb-1">
                <Sliders className="w-4 h-4" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Escrow Logic Control
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-obsidian">
                Dynamic Split-Commission
              </h3>
              <p className="text-xs text-obsidian-muted mt-1 leading-relaxed">
                Tune the automatic split between platform commission, escrow guarantee reserves, and immediate payout to the master artist.
              </p>
            </div>

            {/* Visual Split Distribution Bar */}
            <div className="space-y-2">
              <div className="h-5 w-full rounded-xl overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${artistPayout}%` }}
                  className="bg-obsidian flex items-center justify-center text-[10px] font-mono text-white font-bold"
                  title={`Artist: ${artistPayout}%`}
                >
                  {artistPayout}%
                </div>
                <div
                  style={{ width: `${platformCommission}%` }}
                  className="bg-rose-gold flex items-center justify-center text-[10px] font-mono text-white font-bold"
                  title={`Platform: ${platformCommission}%`}
                >
                  {platformCommission}%
                </div>
                <div
                  style={{ width: `${escrowGuaranteeFund}%` }}
                  className="bg-champagne flex items-center justify-center text-[10px] font-mono text-obsidian font-bold"
                  title={`Guarantee: ${escrowGuaranteeFund}%`}
                >
                  {escrowGuaranteeFund}%
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-obsidian-subtle">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-obsidian" />
                  <span>Artist: {artistPayout}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-gold" />
                  <span>Platform: {platformCommission}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-champagne" />
                  <span>Vault: {escrowGuaranteeFund}%</span>
                </span>
              </div>
            </div>

            {/* Slider 1: Platform Commission */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-obsidian">Platform Commission Fee</span>
                <span className="font-mono font-bold text-rose-gold">{platformCommission}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={platformCommission}
                onChange={(e) => setPlatformCommission(Number(e.target.value))}
                className="w-full accent-rose-gold cursor-pointer"
              />
              <span className="text-[10px] text-obsidian-subtle block">
                Covers payment gateway, AI shade matching, and 24/7 concierge.
              </span>
            </div>

            {/* Slider 2: Escrow Guarantee Fund */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-obsidian">Escrow Guarantee & Protection Pool</span>
                <span className="font-mono font-bold text-champagne-dark">{escrowGuaranteeFund}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={escrowGuaranteeFund}
                onChange={(e) => setEscrowGuaranteeFund(Number(e.target.value))}
                className="w-full accent-champagne cursor-pointer"
              />
              <span className="text-[10px] text-obsidian-subtle block">
                Instant refund guarantee fund for last-minute artist travel cancellations.
              </span>
            </div>

            {/* Live Example Calculation */}
            <div className="p-4 rounded-2xl bg-surface-cream text-xs space-y-2 border border-rose-gold/15">
              <span className="font-bold text-obsidian block">
                Example: On a ₹32,000 Bridal HD Booking:
              </span>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Artist Receives:</span>
                <span className="font-mono">
                  ₹{Math.round((32000 * artistPayout) / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-obsidian-muted">
                <span>Glamgo Platform Take:</span>
                <span className="font-mono">
                  ₹{Math.round((32000 * platformCommission) / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-obsidian-subtle">
                <span>Guarantee Reserve Pool:</span>
                <span className="font-mono">
                  ₹{Math.round((32000 * escrowGuaranteeFund) / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
