package com.EyeCareHub.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
@Data
@NoArgsConstructor
public class Cart {
    @Id
    private String id;
    private String userId;
    private List<CartItem> items = new ArrayList<>();
    private Double totalPrice = 0.0;

    public Cart(String userId) {
        this.userId = userId;
    }

    public void calculateTotalPrice() {
        this.totalPrice = this.items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}
