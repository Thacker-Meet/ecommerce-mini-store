import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse cart items from localStorage", err);
      }
    }
  }, []);

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart functionality
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingItemIndex > -1) {
        const existingItem = prevItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        // Limit quantity to available stock
        if (newQuantity > product.stock) {
          alert(`Cannot add more items. Only ${product.stock} items in stock.`);
          return prevItems;
        }

        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        return updatedItems;
      } else {
        if (quantity > product.stock) {
          alert(`Cannot add. Only ${product.stock} items in stock.`);
          return prevItems;
        }
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productId)
    );
  };

  // Update quantity of an item directly
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product._id === productId) {
          if (quantity > item.product.stock) {
            alert(`Only ${item.product.stock} items in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total cart item count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Total cart price
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
