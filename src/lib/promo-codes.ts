// Promotion codes (shared client/server)
export const PROMO_CODES: Record<string, number> = {
  theswains2026: 200,
};

export function getNightlyRateWithPromo(
  baseRate: number,
  promotionCode?: string | null
): number {
  if (promotionCode?.trim()) {
    const code = promotionCode.trim().toLowerCase();
    const promoRate = PROMO_CODES[code];
    if (promoRate != null) return promoRate;
  }
  return baseRate;
}

export function isValidPromoCode(code?: string | null): boolean {
  if (!code?.trim()) return false;
  return PROMO_CODES[code.trim().toLowerCase()] != null;
}
