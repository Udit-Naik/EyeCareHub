package com.EyeCareHub.controller;

import com.EyeCareHub.dto.CartItemDto;
import com.EyeCareHub.model.Cart;
import com.EyeCareHub.security.services.UserDetailsImpl;
import com.EyeCareHub.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping
    public ResponseEntity<Cart> getCart() {
        return ResponseEntity.ok(cartService.getCartByUserId(getCurrentUserId()));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CartItemDto cartItemDto) {
        return ResponseEntity.ok(cartService.addToCart(getCurrentUserId(), cartItemDto));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable String productId) {
        return ResponseEntity.ok(cartService.removeFromCart(getCurrentUserId(), productId));
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<Cart> updateQuantity(@PathVariable String productId, @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(getCurrentUserId(), productId, quantity));
    }
}
