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
              ? 'border-rose-plum bg-blush/20 ring-1 ring-rose-plum/30'
              : 'border-mist bg-white hover:border-rose-plum/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-plum to-champagne-gold flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-ink">
                  Best Available Professional
                </h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-champagne-gold/20 text-ink">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-mauve-grey mt-0.5 leading-relaxed font-sans">
                Our algorithm assigns the highest-rated (4.9+) background-verified stylist closest to your venue for zero delay.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-800 font-semibold font-sans">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-collision &amp; hygiene verified</span>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                assignedType === 'best_available'
                  ? 'border-rose-plum bg-rose-plum text-white'
                  : 'border-mist bg-white'
              }`}
            >
              {assignedType === 'best_available' && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        </button>

        {/* Option 2: Specific Master Artists */}
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-mauve-grey mb-2.5">
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
                      ? 'border-rose-plum bg-blush/20 ring-1 ring-rose-plum/30'
                      : 'border-mist bg-white hover:border-rose-plum/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-12 h-12 rounded-xl object-cover border border-mist shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-sm font-bold text-ink">{artist.name}</h5>
                        {artist.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        )}
                      </div>
                      <p className="text-xs text-mauve-grey truncate max-w-[200px]">
                        {artist.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-mauve-grey">
                        <span className="flex items-center gap-0.5 text-ink font-semibold">
                          <Star className="w-3 h-3 fill-champagne-gold text-champagne-gold" />
                          {artist.rating}
                        </span>
                        <span>•</span>
                        <span>{artist.reviewCount} reviews</span>
                        <span>•</span>
                        <span className="text-rose-plum font-semibold">{artist.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-rose-plum bg-rose-plum text-white'
                          : 'border-mist bg-white'
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
