/**
 * Glamgo Address Management Service
 * Implements PRD BOOK-3 and UI/UX §5.11 saved address management.
 */

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Hotel / Venue' | 'Other';
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

const ADDRESS_STORAGE_KEY = 'glamgo_saved_addresses';

const INITIAL_DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-001',
    label: 'Home',
    street: 'Flat 402, Sea Face Apartments, Carter Road',
    area: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    landmark: 'Opposite Joggers Park',
    isDefault: true,
  },
  {
    id: 'addr-002',
    label: 'Work',
    street: 'Tower 2, Floor 14, One BKC Complex',
    area: 'Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    landmark: 'Near Sofitel Hotel',
    isDefault: false,
  },
];

export const addressService = {
  /**
   * Get all saved addresses from localStorage or default seeds
   */
  getSavedAddresses(): SavedAddress[] {
    try {
      const stored = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial seeds
    }
    return INITIAL_DEFAULT_ADDRESSES;
  },

  /**
   * Add a new saved address
   */
  saveAddress(newAddr: Omit<SavedAddress, 'id'>): SavedAddress {
    const addresses = this.getSavedAddresses();
    const created: SavedAddress = {
      ...newAddr,
      id: `addr-${Date.now().toString(36)}`,
    };

    if (created.isDefault) {
      addresses.forEach((a) => (a.isDefault = false));
    }

    const updated = [created, ...addresses];
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist address to localStorage', e);
    }
    return created;
  },

  /**
   * Delete a saved address by ID
   */
  deleteAddress(id: string): SavedAddress[] {
    const addresses = this.getSavedAddresses().filter((a) => a.id !== id);
    if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
    } catch (e) {
      console.warn('Could not persist address deletion', e);
    }
    return addresses;
  },

  /**
   * Set default address
   */
  setDefault(id: string): SavedAddress[] {
    const addresses = this.getSavedAddresses();
    addresses.forEach((a) => {
      a.isDefault = a.id === id;
    });
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
    } catch (e) {
      console.warn('Could not persist default address change', e);
    }
    return addresses;
  },
};
