import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemData {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  customValues?: Record<string, any>;
}

interface CartStore {
  items: CartItemData[];
  isOpen: boolean;
  appliedCoupon: { code: string; discountType: 'PERCENT' | 'FIXED'; value: number } | null;
  addItem: (item: CartItemData) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  applyCoupon: (coupon: { code: string; discountType: 'PERCENT' | 'FIXED'; value: number } | null) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,

      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.variantId === newItem.variantId && JSON.stringify(i.customValues) === JSON.stringify(newItem.customValues)
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += newItem.quantity;
            return { items: updated, isOpen: true };
          }
          return { items: [...state.items, newItem], isOpen: true };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        })),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

      clearCart: () => set({ items: [], appliedCoupon: null }),

      setIsOpen: (isOpen) => set({ isOpen }),

      subtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      discount: () => {
        const sub = get().subtotal();
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        if (coupon.discountType === 'PERCENT') {
          return (sub * coupon.value) / 100;
        }
        return Math.min(sub, coupon.value);
      },

      total: () => {
        return Math.max(0, get().subtotal() - get().discount());
      },
    }),
    {
      name: 'crypto-cart-storage',
    }
  )
);
