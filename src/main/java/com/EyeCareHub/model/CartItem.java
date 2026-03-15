package com.EyeCareHub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    private String productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private String imageUrl;
}
