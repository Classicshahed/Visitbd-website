// src/context/BookingContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('bd_tourism_wishlist', []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('bd_tourism_recent', []);
  const [compareList, setCompareList] = useState([]);

  // ── Wishlist ──────────────────────────────────────────────
  const addToWishlist = useCallback((destination) => {
    setWishlist((prev) => {
      if (prev.some((d) => d.id === destination.id)) return prev;
      return [...prev, destination];
    });
  }, [setWishlist]);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((d) => d.id !== id));
  }, [setWishlist]);

  const toggleWishlist = useCallback((destination) => {
    setWishlist((prev) => {
      const exists = prev.some((d) => d.id === destination.id);
      if (exists) return prev.filter((d) => d.id !== destination.id);
      return [...prev, destination];
    });
  }, [setWishlist]);

  const isWishlisted = useCallback((id) => {
    return wishlist.some((d) => d.id === id);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, [setWishlist]);

  // ── Recently Viewed ───────────────────────────────────────
  const addRecentView = useCallback((destination) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((d) => d.id !== destination.id);
      return [destination, ...filtered].slice(0, 6); // keep last 6
    });
  }, [setRecentlyViewed]);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, [setRecentlyViewed]);

  // ── Compare ───────────────────────────────────────────────
  const addToCompare = useCallback((destination) => {
    setCompareList((prev) => {
      if (prev.some((d) => d.id === destination.id)) return prev;
      if (prev.length >= 3) return prev; // max 3 for compare
      return [...prev, destination];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setCompareList((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <BookingContext.Provider
      value={{
        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
        wishlistCount: wishlist.length,
        // Recently Viewed
        recentlyViewed,
        addRecentView,
        clearRecentlyViewed,
        // Compare
        compareList,
        addToCompare,
        removeFromCompare,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

export default BookingContext;
