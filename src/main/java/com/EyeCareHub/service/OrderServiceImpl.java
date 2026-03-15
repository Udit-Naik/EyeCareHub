package com.EyeCareHub.service;

import com.EyeCareHub.model.Cart;
import com.EyeCareHub.model.Order;
import com.EyeCareHub.repository.OrderRepository;
import com.EyeCareHub.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Override
    @Transactional
    public Order placeOrder(String userId, String paymentType) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order(
                userId,
                cart.getItems(),
                cart.getTotalPrice(),
                "PENDING",
                paymentType
        );

        orderRepository.save(order);
        cartService.clearCart(userId);
        return order;
    }

    @Override
    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order updateOrderStatus(String orderId, String status) {
        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(status);
            return orderRepository.save(order);
        }).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }
}
