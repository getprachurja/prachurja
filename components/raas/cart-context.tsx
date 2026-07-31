"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { NurseryCartItem, NurseryPlant } from "@/lib/nursery";

const STORAGE_KEY = "prachurja_nursery_cart_v2";
const LEGACY_STORAGE_KEY = "prachurja_cart_v1";

type StoredCart = { version: 2; items: NurseryCartItem[] };
type CartContextValue = {
  items: NurseryCartItem[];
  count: number;
  total: number;
  hydrated: boolean;
  addPlant: (plant: NurseryPlant, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const EMPTY_CART: NurseryCartItem[] = [];
const listeners = new Set<() => void>();
let memoryCart = EMPTY_CART;
let initialized = false;

function validItem(value: unknown): value is NurseryCartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<NurseryCartItem>;
  return Boolean(
    item.id &&
    item.commonName &&
    item.botanicalName &&
    Number.isFinite(item.unitPrice) &&
    Number.isInteger(item.quantity) &&
    (item.quantity ?? 0) > 0,
  );
}

function readStoredCart(): NurseryCartItem[] {
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current) {
      const payload = JSON.parse(current) as Partial<StoredCart>;
      return payload.version === 2 && Array.isArray(payload.items)
        ? payload.items.filter(validItem)
        : [];
    }
    const legacy = JSON.parse(window.localStorage.getItem(LEGACY_STORAGE_KEY) ?? "[]") as Array<Record<string, unknown>>;
    return Array.isArray(legacy)
      ? legacy.flatMap((item) => {
          if (!String(item.id ?? "").startsWith("plant-") || !item.name || !item.subtitle) return [];
          return [{
            id: String(item.id).replace(/^plant-/, ""),
            commonName: String(item.name),
            botanicalName: String(item.subtitle),
            unitPrice: Number(item.unitPrice),
            quantity: Math.max(1, Number(item.quantity) || 1),
            imageUrl: String(item.image ?? ""),
          }];
        })
      : [];
  } catch {
    return [];
  }
}

function getCartSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    memoryCart = readStoredCart();
    initialized = true;
  }
  return memoryCart;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}

function persistCart(items: NurseryCartItem[]) {
  memoryCart = items;
  initialized = true;
  if (typeof window !== "undefined") {
    const payload: StoredCart = { version: 2, items };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  listeners.forEach((listener) => listener());
}

function subscribeToCart(listener: () => void) {
  listeners.add(listener);
  queueMicrotask(listener);
  const sync = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    memoryCart = readStoredCart();
    initialized = true;
    listeners.forEach((current) => current());
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}

function subscribeToHydration(listener: () => void) {
  queueMicrotask(listener);
  return () => undefined;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  const addPlant = useCallback((plant: NurseryPlant, quantity = 1) => {
    const safeQuantity = Math.min(999, Math.max(1, Math.round(quantity)));
    persistCart((() => {
      const current = getCartSnapshot();
      const existing = current.find((item) => item.id === plant.id);
      if (existing) {
        return current.map((item) =>
          item.id === plant.id
            ? { ...item, quantity: Math.min(999, item.quantity + safeQuantity) }
            : item,
        );
      }
      return [...current, {
        id: plant.id,
        commonName: plant.commonName,
        botanicalName: plant.botanicalName,
        unitPrice: plant.price,
        quantity: safeQuantity,
        imageUrl: plant.imageUrl,
      }];
    })());
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    const current = getCartSnapshot();
    if (quantity <= 0) {
      persistCart(current.filter((item) => item.id !== id));
      return;
    }
    persistCart(current.map((item) =>
      item.id === id ? { ...item, quantity: Math.min(999, Math.round(quantity)) } : item,
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    persistCart(getCartSnapshot().filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => persistCart([]), []);
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    hydrated,
    addPlant,
    setQuantity,
    removeItem,
    clear,
  }), [addPlant, clear, hydrated, items, removeItem, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
