export interface WholesaleTier {
  minQuantity: number;
  discountPercentage: number;
}

export const DEFAULT_WHOLESALE_TIERS: WholesaleTier[] = [
  { minQuantity: 1, discountPercentage: 0 },
  { minQuantity: 5, discountPercentage: 10 },
  { minQuantity: 20, discountPercentage: 20 },
  { minQuantity: 50, discountPercentage: 30 },
];

export function calculateWholesalePrice(
  unitPrice: number,
  quantity: number,
  resellerDiscountTier: number = 15,
  tiers: WholesaleTier[] = DEFAULT_WHOLESALE_TIERS
): { unitPrice: number; total: number; effectiveDiscount: number } {
  let volumeDiscount = 0;
  for (const tier of tiers) {
    if (quantity >= tier.minQuantity) {
      volumeDiscount = Math.max(volumeDiscount, tier.discountPercentage);
    }
  }

  const effectiveDiscount = Math.max(resellerDiscountTier, volumeDiscount);
  const discountedUnit = unitPrice * (1 - effectiveDiscount / 100);
  const total = discountedUnit * quantity;

  return {
    unitPrice: discountedUnit,
    total,
    effectiveDiscount,
  };
}
