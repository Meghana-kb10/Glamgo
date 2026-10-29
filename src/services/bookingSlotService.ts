/**
 * Glamgo Booking Slot & Professional Assignment Service
 * Implements PRD BOOK-2, BOOK-3 and UI/UX §5.11 Step 2.
 */

import { MOCK_ARTISTS } from '../data/mockData';
import { Artist } from '../types';
import { generateDynamicDates, DynamicDateItem } from '../utils/storage';

export interface TimeSlot {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  isAvailable: boolean;
  isFastTrack?: boolean;
}

export const TIME_SLOT_GROUPS: { period: 'Morning' | 'Afternoon' | 'Evening'; times: string[] }[] = [
  {
    period: 'Morning',
    times: ['08:30 AM', '10:00 AM', '11:30 AM'],
  },
  {
    period: 'Afternoon',
    times: ['01:00 PM', '02:30 PM', '04:00 PM'],
  },
  {
    period: 'Evening',
    times: ['05:30 PM', '07:00 PM', '08:30 PM'],
  },
];

export const bookingSlotService = {
  /**
   * Dynamic 14-day date strip starting from today
   */
  getUpcomingDates(days = 14): DynamicDateItem[] {
    return generateDynamicDates(days);
  },

  /**
   * Retrieve grouped time slots for a given date with real-time availability states
   * Implements PRD BOOK-2 and Phase 3.5: Disables slots earlier than now + 2 hours on "today".
   */
  async getSlotsForDate(dateString: string, artistId?: string): Promise<TimeSlot[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Check if requested date is today
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isToday = dateString === todayStr;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const minBufferMinutes = 120; // 2 hours minimum booking buffer

    const parseSlotMinutes = (timeStr: string): number => {
      const [rawTime, modifier] = timeStr.split(' ');
      const [hStr, mStr] = rawTime.split(':');
      let hours = parseInt(hStr, 10);
      const minutes = parseInt(mStr, 10);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    // Deterministic mock availability based on date hash
    const dateNum = dateString.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);

    const allSlots: TimeSlot[] = [];

    TIME_SLOT_GROUPS.forEach((group) => {
      group.times.forEach((time, idx) => {
        // Every 4th slot marked as booked/unavailable to satisfy BOOK-2 greyed-out state
        let isBooked = (dateNum + idx * 7) % 4 === 0;

        // On "today", disable slots that start earlier than now + 2 hours
        if (isToday) {
          const slotStartMin = parseSlotMinutes(time);
          if (slotStartMin < currentMinutes + minBufferMinutes) {
            isBooked = true;
          }
        }

        const isFastTrack = group.period === 'Morning' && idx === 0;

        allSlots.push({
          id: `${dateString}-${time.replace(/\s+/g, '')}`,
          time,
          period: group.period,
          isAvailable: !isBooked,
          isFastTrack,
        });
      });
    });

    return allSlots;
  },

  /**
   * Generates a standardized, centralized booking reference ID (PRD BOOK-1).
   * Centralized in the service layer; never generated in UI components.
   */
  generateBookingReference(): string {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `GLAM-${year}-${randomDigits}`;
  },

  /**
   * Retrieve list of verified professionals available for the chosen date and slot
   */
  async getAvailableProfessionals(dateString: string, timeSlot: string): Promise<Artist[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return MOCK_ARTISTS;
  },

  /**
   * Auto-assign best available professional matching service category & rating
   */
  getBestAvailableProfessional(artistList: Artist[] = MOCK_ARTISTS): Artist {
    return (
      artistList.find((a) => a.rating >= 4.95 && a.isVerified) ||
      artistList[0]
    );
  },
};
