import { differenceInDays, parseISO } from 'date-fns';

import { PROMO_CODES } from './promo-codes';

export function getConfig() {
  return {
    nightlyRate: Number(process.env.NIGHTLY_RATE) || 450,
    cleaningFee: Number(process.env.CLEANING_FEE) || 150,
    serviceFeePercentage: Number(process.env.SERVICE_FEE_PERCENTAGE) || 0.12,
    depositPercentage: Number(process.env.DEPOSIT_PERCENTAGE) || 0.30,
    propertyName: process.env.PROPERTY_NAME || '216 Colonial Lane',
    propertyAddress: process.env.PROPERTY_ADDRESS || '216 Colonial Lane, Palm Beach, FL 33480',
    adminEmail: process.env.ADMIN_EMAIL || '',
  };
}

export interface PricingBreakdown {
  nights: number;
  nightlyRate: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  depositAmount: number;
  balanceOwed: number;
}

export function getNightlyRate(promotionCode?: string | null): number {
  const config = getConfig();
  if (promotionCode?.trim()) {
    const code = promotionCode.trim().toLowerCase();
    const promoRate = PROMO_CODES[code];
    if (promoRate != null) return promoRate;
  }
  return config.nightlyRate;
}

export function calculatePricing(
  checkIn: string,
  checkOut: string,
  promotionCode?: string | null
): PricingBreakdown {
  const config = getConfig();
  const nightlyRate = getNightlyRate(promotionCode);

  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);
  const nights = differenceInDays(checkOutDate, checkInDate);

  if (nights <= 0) {
    throw new Error('Check-out date must be after check-in date');
  }

  const subtotal = nights * nightlyRate;
  const cleaningFee = config.cleaningFee;
  const serviceFee = Math.round(subtotal * config.serviceFeePercentage);
  const totalPrice = subtotal + cleaningFee + serviceFee;
  const depositAmount = Math.round(totalPrice * config.depositPercentage * 100) / 100;
  const balanceOwed = Math.round((totalPrice - depositAmount) * 100) / 100;
  
  return {
    nights,
    nightlyRate,
    subtotal,
    cleaningFee,
    serviceFee,
    totalPrice,
    depositAmount,
    balanceOwed,
  };
}
