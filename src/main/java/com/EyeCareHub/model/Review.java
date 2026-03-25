package com.EyeCareHub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String productId;   // ✅ store product ID (NOT object)
    private String username;
    private int rating;
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters & Setters

    public String getId() { return id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}