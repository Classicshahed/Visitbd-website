// src/context/BookingContext.jsx
// Database-Synced Wishlist, Bookings (Trip Plans), and Recently Viewed Context
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import {
  fetchUserWishlist,
  toggleUserWishlist,
  removeUserWishlistItem,
  clearUserWishlist,
  fetchBookings,
  createBooking,
  deleteBooking,
} from '../services/api';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useLocalStorage('bd_tourism_wishlist', []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('bd_tourism_recent', []);
  const [bookings, setBookings] = useState([]);
  const [compareList, setCompareList] = useState([]);

  // Sync user's wishlist and bookings from SQLite DB on login
  useEffect(() => {
    if (user?.id) {
      fetchUserWishlist(user.id)
        .then((dbList) => {
          if (Array.isArray(dbList)) setWishlist(dbList);
        })
        .catch(() => {});

      fetchBookings(user.id)
        .then((dbBookings) => {
          if (Array.isArray(dbBookings)) setBookings(dbBookings);
        })
        .catch(() => {});
    } else {
      setBookings((prev) => (prev.length > 0 ? [] : prev));
    }
  }, [user?.id]);

  // ── Wishlist ──────────────────────────────────────────────
  const addToWishlist = useCallback(
    (destination) => {
      setWishlist((prev) => {
        if (prev.some((d) => d.id === destination.id)) return prev;
        return [...prev, destination];
      });
      if (user?.id) {
        toggleUserWishlist(user.id, destination.id).catch(() => {});
      }
    },
    [setWishlist, user?.id]
  );

  const removeFromWishlist = useCallback(
    (id) => {
      setWishlist((prev) => prev.filter((d) => d.id !== id));
      if (user?.id) {
        removeUserWishlistItem(user.id, id).catch(() => {});
      }
    },
    [setWishlist, user?.id]
  );

  const toggleWishlist = useCallback(
    (destination) => {
      setWishlist((prev) => {
        const exists = prev.some((d) => d.id === destination.id);
        if (exists) return prev.filter((d) => d.id !== destination.id);
        return [...prev, destination];
      });
      if (user?.id) {
        toggleUserWishlist(user.id, destination.id).catch(() => {});
      }
    },
    [setWishlist, user?.id]
  );

  const isWishlisted = useCallback(
    (id) => {
      return wishlist.some((d) => d.id === id);
    },
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    if (user?.id) {
      clearUserWishlist(user.id).catch(() => {});
    }
  }, [setWishlist, user?.id]);

  // ── Bookings (Trip Plans) ─────────────────────────────────
  const addBooking = useCallback(
    async (bookingData) => {
      const created = await createBooking({
        ...bookingData,
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
      });
      setBookings((prev) => [created, ...prev]);
      return created;
    },
    [user]
  );

  const cancelBooking = useCallback(async (bookingId) => {
    await deleteBooking(bookingId);
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  }, []);

  // ── Recently Viewed ───────────────────────────────────────
  const addRecentView = useCallback(
    (destination) => {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((d) => d.id !== destination.id);
        return [destination, ...filtered].slice(0, 6);
      });
    },
    [setRecentlyViewed]
  );

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, [setRecentlyViewed]);

  // ── Compare ───────────────────────────────────────────────
  const addToCompare = useCallback((destination) => {
    setCompareList((prev) => {
      if (prev.some((d) => d.id === destination.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, destination];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setCompareList((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <BookingContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
        bookings,
        addBooking,
        cancelBooking,
        recentlyViewed,
        addRecentView,
        clearRecentlyViewed,
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
