package com.EyeCareHub.service;

import com.EyeCareHub.dto.CartItemDto;
import com.EyeCareHub.model.Cart;
import com.EyeCareHub.model.CartItem;
import com.EyeCareHub.model.Product;
import com.EyeCareHub.repository.CartRepository;
import com.EyeCareHub.repository.ProductRepository;
import com.EyeCareHub.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart(userId);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public Cart addToCart(String userId, CartItemDto cartItemDto) {
        Cart cart = getCartByUserId(userId);
        
        // Check if item already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(cartItemDto.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Update quantity if item exists
            existingItem.get().setQuantity(existingItem.get().getQuantity() + cartItemDto.getQuantity());
        } else {
            // Add new item using data from DTO (no need to fetch from database)
            CartItem newItem = new CartItem(
                    cartItemDto.getProductId(),
                    cartItemDto.getName(),
                    cartItemDto.getPrice(),
                    cartItemDto.getQuantity(),
                    cartItemDto.getImageUrl()
            );
            cart.getItems().add(newItem);
        }
        
        cart.calculateTotalPrice();
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeFromCart(String userId, String productId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        cart.calculateTotalPrice();
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateQuantity(String userId, String productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        Optional<CartItem> itemOpt = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            if (quantity <= 0) {
                cart.getItems().remove(item);
            } else {
                item.setQuantity(quantity);
            }
            cart.calculateTotalPrice();
            return cartRepository.save(cart);
        }
        throw new ResourceNotFoundException("Item not found in cart");
    }

    @Override
    public void clearCart(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);
    }
}
