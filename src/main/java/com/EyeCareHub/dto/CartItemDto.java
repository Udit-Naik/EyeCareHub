package com.EyeCareHub.dto;

import lombok.Data;

@Data
public class CartItemDto {
    private String productId;
    private String name;
    private Double price; // ❌ ignored
    private Integer quantity;
    private String imageUrl;
}