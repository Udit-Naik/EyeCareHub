package com.EyeCareHub.service;

import com.EyeCareHub.model.Order;
import java.util.List;

public interface OrderService {
    Order placeOrder(String userId, String paymentType);
    List<Order> getUserOrders(String userId);
    List<Order> getAllOrders();
    Order updateOrderStatus(String orderId, String status);
}
