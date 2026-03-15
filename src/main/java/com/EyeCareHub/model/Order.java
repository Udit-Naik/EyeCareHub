package com.EyeCareHub.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "orders")
@Data
@NoArgsConstructor
public class Order {
    @Id
    private String id;
    private String userId;
    private List<CartItem> items;
    private Double totalPrice;
    private String status; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    private String paymentType; // COD, Card
    
    @CreatedDate
    private Date createdAt;

    public Order(String userId, List<CartItem> items, Double totalPrice, String status, String paymentType) {
        this.userId = userId;
        this.items = items;
        this.totalPrice = totalPrice;
        this.status = status;
        this.paymentType = paymentType;
        this.createdAt = new Date();
    }
}
