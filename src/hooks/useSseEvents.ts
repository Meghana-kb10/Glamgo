import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

export interface SseTelemetryEvent {
  type: string;
  data: any;
  timestamp: string;
}

type EventCallback = (event: SseTelemetryEvent) => void;
const eventListeners = new Set<EventCallback>();

export function subscribeToSse(cb: EventCallback) {
  eventListeners.add(cb);
  return () => {
    eventListeners.delete(cb);
  };
}

export function useSseEvents() {
  const toast = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isSubscribed = true;

    function connect() {
      if (!isSubscribed) return;

      try {
        const es = new EventSource('http://localhost:4000/api/v1/events/stream');
        eventSourceRef.current = es;

        es.addEventListener('connected', (e) => {
          try {
            const data = JSON.parse(e.data);
            console.log('📡 [SSE Stream Active]:', data.message);
          } catch {
            // ignore
          }
        });

        es.addEventListener('payment_webhook', (e) => {
          try {
            const data = JSON.parse(e.data);
            toast.success(
              `Payment Intent Captured: ${data.event}`,
              'Razorpay Webhook Verified'
            );
            notifySubscribers({ type: 'payment_webhook', data, timestamp: new Date().toISOString() });
          } catch {
            // ignore
          }
        });

        es.addEventListener('logistics_update', (e) => {
          try {
            const data = JSON.parse(e.data);
            toast.info(
              `AWB ${data.awb_number} is now ${data.status} (${data.carrier})`,
              '3PL Carrier Telemetry'
            );
            notifySubscribers({ type: 'logistics_update', data, timestamp: new Date().toISOString() });
          } catch {
            // ignore
          }
        });

        es.addEventListener('dispute_resolved', (e) => {
          try {
            const data = JSON.parse(e.data);
            toast.info(
              `Arbitration resolved with ${data.resolution}`,
              'Admin Governance'
            );
            notifySubscribers({ type: 'dispute_resolved', data, timestamp: new Date().toISOString() });
          } catch {
            // ignore
          }
        });

        es.onerror = () => {
          es.close();
          // Retry after 5s
          if (isSubscribed) {
            setTimeout(connect, 5000);
          }
        };
      } catch (err: any) {
        console.warn('⚠️ [SSE Connection Warning]:', err.message);
      }
    }

    function notifySubscribers(event: SseTelemetryEvent) {
      eventListeners.forEach((listener) => {
        try {
          listener(event);
        } catch (e) {
          console.error('Error in SSE subscriber callback:', e);
        }
      });
    }

    connect();

    return () => {
      isSubscribed = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [toast]);
}
