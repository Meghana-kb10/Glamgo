import React from 'react';
import { Sparkles, ShieldCheck, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigatePortal?: (portal: 'landing' | 'customer' | 'pro' | 'vendor' | 'admin') => void;
  onOpenSafetyPromise?: () => void;
  onOpenHelp?: () => void;
  className?: string;
}

const SERVICED_CITIES = [
  'Bengaluru (Indiranagar, Koramangala, HSR Layout, Whitefield, Sadashivanagar)',
  'Mumbai (Bandra West, Juhu, Colaba, Lower Parel, Powai)',
  'Delhi NCR (South Extension, Golf Course Road, Cyber Hub, Vasant Vihar)',
  'Hyderabad (Jubilee Hills, Banjara Hills, Gachibowli, Hitec City)',
  'Pune (Koregaon Park, Kalyani Nagar, Viman Nagar)',
];

export const Footer: React.FC<FooterProps> = ({
  onNavigatePortal,
  onOpenSafetyPromise,
  onOpenHelp,
  className = '',
}) => {
  return (
    <footer
      aria-label="Glamgo Marketplace Footer"
      className={`bg-bg-alt border-t border-border pt-12 pb-24 lg:pb-12 text-xs text-text-muted select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand Info & Pro Link */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white shadow-warm-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xl text-text tracking-tight">
                Glamgo
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              India&apos;s luxury at-home beauty &amp; wellness network. Background-verified master stylists delivering sealed mono-dose salon care with zero mess.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigatePortal && onNavigatePortal('pro')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[14px] bg-card border border-border text-accent font-bold text-xs hover:bg-accent hover:text-white transition-colors cursor-pointer shadow-warm-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Become a Professional Partner</span>
              </button>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" aria-label="Glamgo on Instagram" className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-border-strong transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" aria-label="Glamgo on Facebook" className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-border-strong transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" aria-label="Glamgo on Twitter" className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-border-strong transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#youtube" aria-label="Glamgo on YouTube" className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-border-strong transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Company & About */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-accent transition-colors">
                  About Glamgo
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSafetyPromise}
                  className="hover:text-accent transition-colors cursor-pointer text-left"
                >
                  Our Safety Promise
                </button>
              </li>
              <li>
                <a href="#careers" className="hover:text-accent transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#press" className="hover:text-accent transition-colors">
                  Press &amp; Media
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePortal && onNavigatePortal('vendor')}
                  className="hover:text-accent transition-colors cursor-pointer text-left"
                >
                  Product Vendor Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Help & Support */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text">
              Help &amp; Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenHelp}
                  className="hover:text-accent transition-colors cursor-pointer text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <a href="#faqs" className="hover:text-accent transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#booking-policy" className="hover:text-accent transition-colors">
                  Booking Guidelines
                </a>
              </li>
              <li>
                <a href="#hygiene" className="hover:text-accent transition-colors">
                  Hygiene Standard
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#terms" className="hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#cancellation" className="hover:text-accent transition-colors">
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-accent transition-colors">
                  Security &amp; Encryption
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Serviced Cities List */}
        <div className="py-6 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>Serving Top Metros Across India</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-text-muted">
            {SERVICED_CITIES.map((city, idx) => (
              <span key={city} className="flex items-center gap-1">
                <span>{city}</span>
                {idx < SERVICED_CITIES.length - 1 && <span className="text-border-strong">•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 Glamgo Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-success-text font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>100% Genuine Sealed Products</span>
            </span>
            <span>•</span>
            <span>Made with precision for Indian beauty lovers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
