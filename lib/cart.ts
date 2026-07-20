export type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  category: "Native plant" | "Local product";
  unitPrice: number;
  quantity: number;
  image?: string;
  href: string;
};

export const CART_STORAGE_KEY = "prachurja_cart_v1";

export function cartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item) => item?.id && item?.quantity > 0) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("prachurja:cart-updated"));
}
