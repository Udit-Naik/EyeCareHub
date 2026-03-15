package com.EyeCareHub.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@Document(collection = "products")
@Data
@NoArgsConstructor
public class Product {
    @Id
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    private String category; // Eyeglasses, Sunglasses, Contact Lenses, Computer Glasses

    @NotBlank
    private String brand;

    @NotBlank
    private String gender; // Men, Women, Kids, Unisex

    @NotNull
    @Min(0)
    private Double price;

    @Min(0)
    private Double discount;

    private Double rating;

    private String description;

    private String imageUrl;

    @NotNull
    @Min(0)
    private Integer stock;

    @CreatedDate
    private Date createdAt;

    public Product(String name, String category, String brand, String gender, Double price, Double discount, Double rating, String description, String imageUrl, Integer stock) {
        this.name = name;
        this.category = category;
        this.brand = brand;
        this.gender = gender;
        this.price = price;
        this.discount = discount;
        this.rating = rating;
        this.description = description;
        this.imageUrl = imageUrl;
        this.stock = stock;
        this.createdAt = new Date();
    }
}
