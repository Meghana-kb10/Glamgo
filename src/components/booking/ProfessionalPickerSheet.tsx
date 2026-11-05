import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Star, ShieldCheck, UserCheck } from 'lucide-react';
import { Artist } from '../../types';
import { MOCK_ARTISTS } from '../../data/mockData';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';

interface ProfessionalPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArtist: Artist | null;
  assignedType: 'best_available' | 'custom';
  onSelectBestAvailable: () => void;
  onSelectArtist: (artist: Artist) => void;
}

export const ProfessionalPickerSheet: React.FC<ProfessionalPickerSheetProps> = ({
  isOpen,
  onClose,
  selectedArtist,
  assignedType,
  onSelectBestAvailable,
  onSelectArtist,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Your Beauty Artist">
      <div className="space-y-3 pb-4">
        {/* Option 1: Best Available Professional (Recommended) */}
        <button
          type="button"
          onClick={() => {
            onSelectBestAvailable();
            onClose();
          }}
          className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
            assignedType === 'best_available'
              ? 'border-accent bg-accent-soft/40 ring-1 ring-accent/30'
              : 'border-border bg-card hover:border-accent/40 shadow-warm-xs'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shrink-0 shadow-warm-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-text">
                  Best Available Professional
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-soft text-accent">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed font-sans">
                Our algorithm assigns the highest-rated (4.9+) background-verified stylist closest to your venue for zero delay.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-success font-semibold font-sans">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-collision & hygiene verified</span>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                assignedType === 'best_available'
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-card'
              }`}
            >
              {assignedType === 'best_available' && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        </button>

        {/* Option 2: Specific Master Artists */}
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
            Or Choose a Master Artist
          </p>

          <div className="space-y-2.5">
            {MOCK_ARTISTS.map((artist) => {
              const isSelected = assignedType === 'custom' && selectedArtist?.id === artist.id;

              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => {
                    onSelectArtist(artist);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-accent bg-accent-soft/40 ring-1 ring-accent/30'
                      : 'border-border bg-card hover:border-accent/40 shadow-warm-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-sm font-bold text-text">{artist.name}</h5>
                        {artist.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-success" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted truncate max-w-[200px]">
                        {artist.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-text-muted">
                        <span className="flex items-center gap-0.5 text-text font-semibold">
                          <Star className="w-3 h-3 fill-star text-star" />
                          {artist.rating}
                        </span>
                        <span>•</span>
                        <span>{artist.reviewCount} reviews</span>
                        <span>•</span>
                        <span className="text-accent font-semibold">{artist.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-card'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
