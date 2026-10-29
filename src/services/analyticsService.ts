/**
 * Glamgo Analytics & Telemetry Layer
 * Implements UI/UX §12 tracking events.
 */

export type AnalyticsEventName =
  | 'search_performed'
  | 'category_viewed'
  | 'service_viewed'
  | 'professional_viewed'
  | 'add_to_cart'
  | 'slot_selected'
  | 'coupon_applied'
  | 'booking_confirmed'
  | 'location_changed'
  | 'favorite_toggled'
  | 'professional_shared'
  | 'package_selected';

export interface AnalyticsEventPayload {
  [key: string]: any;
}

export const analytics = {
  trackEvent(event: AnalyticsEventName, payload: AnalyticsEventPayload = {}): void {
    const timestamp = new Date().toISOString();
    const eventData = {
      event,
      payload,
      timestamp,
    };

    if (typeof window !== 'undefined') {
      // Store last 50 events in sessionStorage for debugging/telemetry audits
      try {
        const history = JSON.parse(sessionStorage.getItem('glamgo_analytics_log') || '[]');
        history.unshift(eventData);
        sessionStorage.setItem('glamgo_analytics_log', JSON.stringify(history.slice(0, 50)));
      } catch {
        // Ignored
      }
    }

    // In local development, log neatly to console
    if ((import.meta as any).env?.DEV) {
      console.log(`[Analytics] ${event}:`, payload);
    }
  },
};

export const trackEvent = analytics.trackEvent;
