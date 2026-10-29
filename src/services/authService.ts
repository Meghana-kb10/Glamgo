/**
 * Glamgo Authentication Service
 * 
 * Implements PRD AUTH-1 to AUTH-9:
 * - Phone + OTP (6 digits) authentication
 * - Rate limiting (max 5 failed verification attempts per phone, 30s resend cooldown, max 3 resends)
 * - Google Sign-In stub with credential documentation
 * - New user profile setup & location preference
 * - Mock database integration for customer, artist, vendor, and admin users
 */

import { mockDb } from './mockDatabase';
import { UserRole } from '../context/AuthContext';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  roles: UserRole[];
  avatarUrl?: string | null;
  preferredGender?: 'female' | 'male' | 'none';
  city?: string;
  pincode?: string;
  isNewUser?: boolean;
}

export interface SendOtpResult {
  success: boolean;
  channel: 'sms' | 'whatsapp';
  cooldownSeconds: number;
  message?: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  isNewUser?: boolean;
  attemptsLeft?: number;
  error?: string;
}

export interface ProfileSetupData {
  fullName: string;
  email?: string;
  preferredGender?: 'female' | 'male' | 'none';
  city?: string;
  pincode?: string;
}

// Development auth flag: active only in local Vite dev server or when explicitly enabled
export const isDevAuthEnabled: boolean =
  Boolean((import.meta as any).env?.DEV || (import.meta as any).env?.VITE_ENABLE_DEV_AUTH === 'true');

// Development default OTP for reviewer testing (only active when dev auth is enabled)
export const DEV_OTP = isDevAuthEnabled ? '123456' : null;

// In-memory rate limiting & OTP session state (never persist OTP in localStorage)
interface OtpSession {
  phone: string;
  channel: 'sms' | 'whatsapp';
  attempts: number;
  resendCount: number;
  lastSentAt: number;
  isLockedUntil?: number;
}

const otpSessions = new Map<string, OtpSession>();

const MAX_ATTEMPTS = 5;
const MAX_RESENDS = 3;
const COOLDOWN_SECONDS = 30;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return raw.startsWith('+') ? raw : `+${digits}`;
}

export const authService = {
  /**
   * Request an OTP to a 10-digit mobile number via SMS or WhatsApp
   */
  async sendOtp(phone: string, channel: 'sms' | 'whatsapp' = 'sms'): Promise<SendOtpResult> {
    // Artificial realistic network delay (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    const normalized = normalizePhone(phone);
    const now = Date.now();
    let session = otpSessions.get(normalized);

    // Check if phone is locked out due to too many failed attempts
    if (session?.isLockedUntil && now < session.isLockedUntil) {
      const waitMins = Math.ceil((session.isLockedUntil - now) / 60000);
      return {
        success: false,
        channel,
        cooldownSeconds: 0,
        error: `Too many failed attempts. Please wait ${waitMins} minute(s) before requesting a new OTP.`,
      };
    }

    if (session) {
      // Check 30s resend cooldown
      const elapsedSecs = Math.floor((now - session.lastSentAt) / 1000);
      if (elapsedSecs < COOLDOWN_SECONDS) {
        return {
          success: false,
          channel,
          cooldownSeconds: COOLDOWN_SECONDS - elapsedSecs,
          error: `Please wait ${COOLDOWN_SECONDS - elapsedSecs}s before requesting a new OTP.`,
        };
      }

      // Check max resend limit
      if (session.resendCount >= MAX_RESENDS) {
        return {
          success: false,
          channel,
          cooldownSeconds: 0,
          error: 'Maximum resend limit reached for this session. Please try again later.',
        };
      }

      session.channel = channel;
      session.resendCount += 1;
      session.lastSentAt = now;
      session.attempts = 0; // reset attempts on new code dispatch
    } else {
      session = {
        phone: normalized,
        channel,
        attempts: 0,
        resendCount: 0,
        lastSentAt: now,
      };
      otpSessions.set(normalized, session);
    }

    // In a live system, this connects to MSG91 / Twilio / Firebase Phone Auth API
    return {
      success: true,
      channel,
      cooldownSeconds: COOLDOWN_SECONDS,
      message: isDevAuthEnabled
        ? `OTP sent via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} to ${normalized}. Enter ${DEV_OTP} to verify.`
        : `Verification code dispatched to ${normalized}.`,
    };
  },

  /**
   * Verify 6-digit OTP code with attempt limiting and user resolution
   */
  async verifyOtp(phone: string, code: string): Promise<VerifyOtpResult> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const normalized = normalizePhone(phone);
    const now = Date.now();
    let session = otpSessions.get(normalized);

    // Ensure session exists
    if (!session) {
      session = {
        phone: normalized,
        channel: 'sms',
        attempts: 0,
        resendCount: 0,
        lastSentAt: now,
      };
      otpSessions.set(normalized, session);
    }

    // Check lockout
    if (session.isLockedUntil && now < session.isLockedUntil) {
      const waitMins = Math.ceil((session.isLockedUntil - now) / 60000);
      return {
        success: false,
        error: `Account temporarily locked. Please wait ${waitMins} minute(s) before trying again.`,
      };
    }

    // Verify OTP code against dev mock
    const isMockValid = Boolean(isDevAuthEnabled && DEV_OTP && code === DEV_OTP);
    if (!isMockValid) {
      session.attempts += 1;
      const attemptsLeft = Math.max(0, MAX_ATTEMPTS - session.attempts);

      if (session.attempts >= MAX_ATTEMPTS) {
        session.isLockedUntil = now + LOCKOUT_DURATION_MS;
        return {
          success: false,
          attemptsLeft: 0,
          error: 'Maximum attempts exceeded. This number is locked for 5 minutes.',
        };
      }

      return {
        success: false,
        attemptsLeft,
        error: isDevAuthEnabled
          ? `Incorrect verification code (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining). Use ${DEV_OTP} for review.`
          : `Invalid verification code (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining).`,
      };
    }

    // Successful OTP verification: reset session counters
    session.attempts = 0;
    session.isLockedUntil = undefined;

    // Check if user already exists in mock database
    const existingUser = mockDb.users.find(
      (u) => normalizePhone(u.phone || '') === normalized
    );

    const token = `jwt_otp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    if (existingUser) {
      const authUser: AuthUser = {
        id: existingUser.id,
        fullName: existingUser.full_name,
        email: existingUser.email,
        phone: existingUser.phone || null,
        roles: existingUser.roles,
        avatarUrl: existingUser.avatar_url,
        isNewUser: false,
      };
      return {
        success: true,
        user: authUser,
        token,
        isNewUser: false,
      };
    }

    // New customer user: return temporary draft user
    const tempId = `usr-cust-${Date.now().toString(36)}`;
    const newAuthUser: AuthUser = {
      id: tempId,
      fullName: '',
      email: null,
      phone: normalized,
      roles: ['CUSTOMER'],
      avatarUrl: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80`,
      isNewUser: true,
    };

    return {
      success: true,
      user: newAuthUser,
      token,
      isNewUser: true,
    };
  },

  /**
   * Complete new user profile setup (Name required, Email optional, Gender preference, Location)
   */
  async completeProfile(userId: string, data: ProfileSetupData): Promise<{ success: boolean; user: AuthUser }> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Persist to mock database
    const createdUser = mockDb.createUser({
      fullName: data.fullName,
      email: data.email?.trim() || `user_${Date.now()}@glamgo.app`,
      passwordHash: '$2b$10$SK6zVEPoKyh26/NUWsehJ.f0S5PUZGQKPHcHomszW7HEjliwtAuYu',
      role: 'CUSTOMER',
    });

    // Update with real ID and details
    const updatedUser: AuthUser = {
      id: createdUser.id,
      fullName: data.fullName.trim(),
      email: data.email?.trim() || null,
      phone: createdUser.phone || null,
      roles: ['CUSTOMER'],
      avatarUrl: createdUser.avatar_url,
      preferredGender: data.preferredGender || 'none',
      city: data.city || 'Mumbai',
      pincode: data.pincode || '400050',
      isNewUser: false,
    };

    return {
      success: true,
      user: updatedUser,
    };
  },

  /**
   * Google Sign-In Mock & Provider Stub
   * Production requirement: Set `VITE_GOOGLE_CLIENT_ID` and register OAuth origins in Google Cloud Console.
   */
  async googleSignIn(): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Simulated verified Google account
    const googleUser: AuthUser = {
      id: 'usr-google-001',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+919876543210',
      roles: ['CUSTOMER'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isNewUser: false,
      city: 'Bengaluru',
      pincode: '560038',
    };

    const token = `jwt_google_${Date.now()}`;

    return {
      success: true,
      user: googleUser,
      token,
    };
  },

  /**
   * Cleanly terminate session and purge customer transient state (PRD Phase 3.5)
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      localStorage.removeItem('glamgo_booking_draft');
      localStorage.removeItem('glamgo_saved_addresses');
      localStorage.removeItem('glamgo_cart_service');
      localStorage.removeItem('glamgo_cart_products');
      localStorage.removeItem('glamgo_auth_token');
      localStorage.removeItem('glamgo_auth_user');
    } catch {
      // Ignored
    }
  },
};
