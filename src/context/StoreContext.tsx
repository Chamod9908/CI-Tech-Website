'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // unique cart item id (productId + selected options hash)
  productId: string;
  name: string;
  price: number; // unit price including selected option adjustment
  quantity: number;
  image?: string;
  selectedOptions?: { option: string; value: string; priceAdjustment: number }[];
  specialInstructions?: string;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  wishlist: string[]; // productIds
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setTimeout(() => {
      try {
        const savedCart = localStorage.getItem('colorlab_cart');
        const savedWishlist = localStorage.getItem('colorlab_wishlist');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error loading cart/wishlist state from storage:', e);
      } finally {
        setIsLoaded(true);
      }
    }, 0);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('colorlab_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error writing cart state:', e);
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('colorlab_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error writing wishlist state:', e);
    }
  }, [wishlist, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    // Generate a unique ID based on product ID and serialized selectedOptions
    const optionsHash = item.selectedOptions
      ? item.selectedOptions.map(o => `${o.option}:${o.value}`).sort().join('|')
      : '';
    const cartItemId = `${item.productId}-${optionsHash}`;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(i => i.id === cartItemId);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += item.quantity;
        return newCart;
      }
      return [...prevCart, { ...item, id: cartItemId }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map(item => (item.id === cartItemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
