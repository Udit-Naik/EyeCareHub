package com.EyeCareHub.service;

import com.EyeCareHub.model.Cart;
import com.EyeCareHub.dto.CartItemDto;

public interface CartService {
    Cart getCartByUserId(String userId);
    Cart addToCart(String userId, CartItemDto cartItemDto);
    Cart removeFromCart(String userId, String productId);
    Cart updateQuantity(String userId, String productId, Integer quantity);
    void clearCart(String userId);
}
