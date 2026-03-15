package com.EyeCareHub.controller;

import com.EyeCareHub.model.Order;
import com.EyeCareHub.security.services.UserDetailsImpl;
import com.EyeCareHub.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestParam String paymentType) {
        return ResponseEntity.ok(orderService.placeOrder(getCurrentUserId(), paymentType));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders() {
        return ResponseEntity.ok(orderService.getUserOrders(getCurrentUserId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
