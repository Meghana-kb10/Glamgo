import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  MapPin,
  Settings,
  HelpCircle,
  FileText,
  ShieldCheck,
  Ban,
  Check,
  Plus,
  Trash2,
  Phone,
  Mail,
  Home as HomeIcon,
  Briefcase,
  ChevronRight,
  LogOut,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { spatialSpring } from '../../constants/motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addressService, SavedAddress } from '../../services/addressService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'addresses' | 'settings' | 'help' | 'terms' | 'privacy' | 'cancellation';
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'settings' | 'help' | 'terms' | 'privacy' | 'cancellation'>(initialTab);

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() =>
    addressService.getSavedAddresses()
  );
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newPincode, setNewPincode] = useState('400050');
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Hotel / Venue' | 'Other'>('Home');

  // Account Settings State
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [smsArrivalAlerts, setSmsArrivalAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Hindi'>('English');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toast.success('Your profile information has been saved successfully.', 'Profile Updated');
    }, 400);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newArea.trim() || !newPincode.trim()) {
      toast.error('Please fill in street, area and pincode.', 'Validation Error');
      return;
    }
    const created = addressService.saveAddress({
      label: newLabel,
      street: newStreet.trim(),
      area: newArea.trim(),
      landmark: newLandmark.trim() || undefined,
      city: newCity.trim(),
      state: 'Maharashtra',
      pincode: newPincode.trim(),
      isDefault: savedAddresses.length === 0,
    });
    setSavedAddresses(addressService.getSavedAddresses());
    setIsAddAddressOpen(false);
    setNewStreet('');
    setNewArea('');
    setNewLandmark('');
    toast.success('New address added to your address book.', 'Address Saved');
  };

  const handleDeleteAddress = (id: string) => {
    addressService.deleteAddress(id);
    setSavedAddresses(addressService.getSavedAddresses());
    toast.info('Address removed.', 'Address Deleted');
  };

  const handleSetDefaultAddress = (id: string) => {
    addressService.setDefault(id);
    setSavedAddresses(addressService.getSavedAddresses());
    toast.success('Default address updated.', 'Default Address');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-profile-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-text/60 backdrop-blur-md"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 text-text">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={spatialSpring}
          className="relative w-full max-w-4xl bg-bg rounded-3xl shadow-warm-lg border border-border overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border p-4 flex flex-col justify-between shrink-0">
            <div>
              {/* Profile Overview Card */}
              <div className="p-3.5 rounded-2xl bg-bg-alt border border-border flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent text-white font-heading font-bold text-lg flex items-center justify-center shrink-0 shadow-warm-xs">
                  {fullName.charAt(0) || 'G'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-heading text-sm font-bold text-text truncate">
                    {fullName || 'Guest'}
                  </h4>
                  <span className="text-[10px] font-semibold text-accent uppercase tracking-wider block">
                    Your Glamgo account
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-fill text-accent-pressed font-bold'
                      : 'text-text-muted hover:text-text hover:bg-fill/50'
                  }`}
                >
                  <User className="w-4 h-4 text-accent" />
                  <span>Personal Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-fill text-accent-pressed font-bold'
                      : 'text-text-muted hover:text-text hover:bg-fill/50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Saved Addresses ({savedAddresses.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-fill text-accent-pressed font-bold'
                      : 'text-text-muted hover:text-text hover:bg-fill/50'
                  }`}
                >
                  <Settings className="w-4 h-4 text-accent" />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('help')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'help'
                      ? 'bg-fill text-accent-pressed font-bold'
                      : 'text-text-muted hover:text-text hover:bg-fill/50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-accent" />
                  <span>Help & Support</span>
                </button>

                <div className="pt-2 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted/70 px-3">
                    Legal & Policies
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('terms')}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'terms'
                      ? 'bg-fill text-accent-pressed font-bold'
                      : 'text-text-muted hover:text-text hover:bg-fill/50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  <span>Terms & Conditions</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'privacy'
                      ? 'bg-fill text-accent-pressed font-bold'
                      : 'text-text-muted hover:text-text hover:bg-fill/50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Privacy Policy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cancellation')}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'cancellation'
                      ? 'bg-fill text-accent-pressed font-bold'
                      : 'text-text-muted hover:text-text hover:bg-fill/50'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5 text-accent" />
                  <span>Cancellation Policy</span>
                </button>
              </nav>
            </div>

            {/* Logout button */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                  toast.info('You have been logged out safely.', 'Session Terminated');
                }}
                className="mt-4 px-3 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>

          {/* Right Main Content Pane */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar with Title and Close */}
            <div className="px-6 py-4 bg-card border-b border-border flex items-center justify-between shrink-0">
              <h3 id="customer-profile-title" className="font-heading text-lg font-bold text-text">
                {activeTab === 'profile' && 'Personal Profile & Contact'}
                {activeTab === 'addresses' && 'Manage Saved Addresses'}
                {activeTab === 'settings' && 'Account & Notification Preferences'}
                {activeTab === 'help' && 'Glamgo Concierge & Help Desk'}
                {activeTab === 'terms' && 'Terms & Conditions of Service'}
                {activeTab === 'privacy' && 'Customer Privacy & Data Protection'}
                {activeTab === 'cancellation' && 'Fair Cancellation & Reschedule Policy'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-full hover:bg-fill text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* TAB 1: PROFILE DETAILS */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                  <Input
                    label="Full Legal Name"
                    value={fullName || 'Guest'}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Input
                    label="Mobile Phone Number (10 Digits)"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isSavingProfile}
                    >
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              )}

              {/* TAB 2: SAVED ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-muted">
                      Your saved venue addresses are used for quick 1-click booking and doorstep dispatch.
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsAddAddressOpen(true)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Add Address
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {savedAddresses.map((addr) => {
                      const Icon = addr.label === 'Work' ? Briefcase : HomeIcon;
                      return (
                        <div
                          key={addr.id}
                          className="p-4 rounded-2xl bg-card border border-border shadow-warm-xs flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-fill text-accent flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-text">{addr.label}</span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-text mt-1 font-medium">
                                {addr.street}, {addr.area}
                              </p>
                              <p className="text-[11px] text-text-muted font-sans">
                                {addr.city} - {addr.pincode}
                                {addr.landmark && ` • Landmark: ${addr.landmark}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              aria-label="Delete address"
                              className="p-1 text-text-muted hover:text-error cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Address Form Modal */}
                  {isAddAddressOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-bg-alt border border-border space-y-3"
                    >
                      <h4 className="font-heading text-sm font-bold text-text">New Venue Address</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="House / Flat / Building *"
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                          placeholder="e.g. Flat 402, Royale Crest"
                          required
                        />
                        <Input
                          label="Street / Area *"
                          value={newArea}
                          onChange={(e) => setNewArea(e.target.value)}
                          placeholder="e.g. Bandra West"
                          required
                        />
                        <Input
                          label="Landmark (Optional)"
                          value={newLandmark}
                          onChange={(e) => setNewLandmark(e.target.value)}
                          placeholder="Near Pali Market"
                        />
                        <Input
                          label="Pincode *"
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                          placeholder="400050"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={handleAddAddress}
                        >
                          Save Address
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddAddressOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB 3: ACCOUNT SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-5 max-w-lg">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Notification Preferences
                    </h4>

                    <label className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-text">WhatsApp Booking Updates</p>
                        <p className="text-[11px] text-text-muted">Receive live OTPs, stylist dispatch notifications and invoices</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={whatsappNotifications}
                        onChange={(e) => setWhatsappNotifications(e.target.checked)}
                        className="w-4 h-4 text-accent accent-accent cursor-pointer"
                      />
                    </label>

                    <label className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-text">SMS Arrival Alerts</p>
                        <p className="text-[11px] text-text-muted">Get an SMS when your master pro is 15 minutes away from your venue</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={smsArrivalAlerts}
                        onChange={(e) => setSmsArrivalAlerts(e.target.checked)}
                        className="w-4 h-4 text-accent accent-accent cursor-pointer"
                      />
                    </label>

                    <label className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-text">Curated Offers & Privileges</p>
                        <p className="text-[11px] text-text-muted">Exclusive previews for bridal seasons and member discounts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={marketingEmails}
                        onChange={(e) => setMarketingEmails(e.target.checked)}
                        className="w-4 h-4 text-accent accent-accent cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      App Language
                    </h4>
                    <div className="flex gap-2">
                      {(['English', 'Hindi'] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setPreferredLanguage(lang)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            preferredLanguage === lang
                              ? 'bg-accent text-white border-accent'
                              : 'bg-card text-text border-border hover:bg-fill'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: HELP & SUPPORT */}
              {activeTab === 'help' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-bg-alt border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-text">Glamgo Haute Concierge</h4>
                      <p className="text-xs text-text-muted mt-0.5">Direct 24/7 client support for reservations, custom bridal suites, and safety.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="mailto:support@glamgo.in"
                        className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-pressed transition-colors flex items-center gap-1.5 shadow-warm-xs"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Concierge</span>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Frequently Asked Questions
                    </h4>

                    <div className="space-y-2 text-xs">
                      <details className="p-3.5 rounded-xl bg-card border border-border">
                        <summary className="font-bold text-text cursor-pointer">
                          How does the Glamgo Hygiene Guarantee work?
                        </summary>
                        <p className="mt-2 text-text-muted leading-relaxed font-sans">
                          Every master artist carries hospital-grade sanitized instruments and factory-sealed mono-dose cosmetic kits opened exclusively in front of you.
                        </p>
                      </details>

                      <details className="p-3.5 rounded-xl bg-card border border-border">
                        <summary className="font-bold text-text cursor-pointer">
                          Can I reschedule my appointment?
                        </summary>
                        <p className="mt-2 text-text-muted leading-relaxed font-sans">
                          Yes! You can reschedule your booking at zero cost anytime up to 4 hours prior to your slot directly from the My Bookings hub.
                        </p>
                      </details>

                      <details className="p-3.5 rounded-xl bg-card border border-border">
                        <summary className="font-bold text-text cursor-pointer">
                          When is payment released to the stylist?
                        </summary>
                        <p className="mt-2 text-text-muted leading-relaxed font-sans">
                          All payments are held securely in RBI-compliant escrow and only released to the professional upon successful treatment completion and OTP check-in.
                        </p>
                      </details>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TERMS & CONDITIONS */}
              {activeTab === 'terms' && (
                <div className="space-y-3 text-xs text-text-muted leading-relaxed font-sans">
                  <h4 className="font-heading text-base font-bold text-text">Glamgo Customer Terms of Service</h4>
                  <p>Welcome to Glamgo. By accessing our website, reserving beauty and wellness services, or purchasing backstage cosmetics, you agree to these Terms.</p>
                  <p><strong>1. Service Appointments:</strong> All reservations are subject to professional availability and verification. Customers agree to provide a well-lit space and safe environment for treatment.</p>
                  <p><strong>2. Payment & Escrow:</strong> Customer funds are held in secure escrow until the service is delivered and verified by the customer check-in OTP.</p>
                  <p><strong>3. Customer Conduct:</strong> Professional beauty artists have the right to refuse service in the presence of inappropriate conduct, abuse, or hazardous conditions.</p>
                </div>
              )}

              {/* TAB 6: PRIVACY POLICY */}
              {activeTab === 'privacy' && (
                <div className="space-y-3 text-xs text-text-muted leading-relaxed font-sans">
                  <h4 className="font-heading text-base font-bold text-text">Privacy & Personal Data Protection</h4>
                  <p>Glamgo respects your privacy and complies with applicable Indian data protection laws.</p>
                  <p><strong>1. Information Collection:</strong> We collect only the contact information, location coordinates, and booking history required to dispatch professionals and deliver products.</p>
                  <p><strong>2. Payment Security:</strong> We do not store raw card details or banking passwords. All transactions are processed through PCI-DSS Level 1 compliant payment gateways.</p>
                  <p><strong>3. Data Retention:</strong> You may request full deletion of your profile and past service records at any time by contacting our privacy compliance officer at privacy@glamgo.in.</p>
                </div>
              )}

              {/* TAB 7: CANCELLATION POLICY */}
              {activeTab === 'cancellation' && (
                <div className="space-y-3 text-xs text-text-muted leading-relaxed font-sans">
                  <h4 className="font-heading text-base font-bold text-text">Fair Cancellation & Rescheduling Policy</h4>
                  <p>We respect both our clients' schedules and our independent artists' livelihoods.</p>
                  <div className="p-4 rounded-2xl bg-bg-alt border border-border space-y-2">
                    <p><strong>Notice $\ge$ 4 Hours:</strong> 100% full refund to original payment source with zero penalty.</p>
                    <p><strong>Notice &lt; 4 Hours:</strong> 70% refund to customer; 30% artist compensation fee applies to cover stylist transit and reserved slot time.</p>
                    <p><strong>Rescheduling:</strong> Free of charge up to 4 hours before the appointment window.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
