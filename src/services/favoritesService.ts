/**
 * Glamgo Favorites Persistence Service
 * Persists bookmarked artists and services in localStorage.
 */

import { trackEvent } from './analyticsService';

const FAVORITES_STORAGE_KEY = 'glamgo_favorites';

export interface FavoritesState {
  artists: string[]; // artist IDs
  services: string[]; // service package IDs
  products: string[]; // product IDs
}

export const favoritesService = {
  getFavorites(): FavoritesState {
    if (typeof window === 'undefined') {
      return { artists: [], services: [], products: [] };
    }
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignored
    }
    return { artists: ['pro-001'], services: ['srv-001'], products: [] };
  },

  isArtistFavorite(artistId: string): boolean {
    return this.getFavorites().artists.includes(artistId);
  },

  isServiceFavorite(serviceId: string): boolean {
    return this.getFavorites().services.includes(serviceId);
  },

  toggleArtistFavorite(artistId: string): boolean {
    const favs = this.getFavorites();
    const exists = favs.artists.includes(artistId);
    const updated = exists
      ? favs.artists.filter((id) => id !== artistId)
      : [...favs.artists, artistId];

    this.save({ ...favs, artists: updated });
    trackEvent('favorite_toggled', { entityType: 'artist', id: artistId, isFavorite: !exists });
    return !exists;
  },

  toggleServiceFavorite(serviceId: string): boolean {
    const favs = this.getFavorites();
    const exists = favs.services.includes(serviceId);
    const updated = exists
      ? favs.services.filter((id) => id !== serviceId)
      : [...favs.services, serviceId];

    this.save({ ...favs, services: updated });
    trackEvent('favorite_toggled', { entityType: 'service', id: serviceId, isFavorite: !exists });
    return !exists;
  },

  save(favs: FavoritesState): void {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
    } catch (e) {
      console.warn('Could not persist favorites', e);
    }
  },
};
