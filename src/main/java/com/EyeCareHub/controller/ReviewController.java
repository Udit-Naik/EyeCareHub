package com.EyeCareHub.controller;

import com.EyeCareHub.model.Review;
import com.EyeCareHub.service.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/{productId}")
    public Review addReview(@PathVariable String productId,
                            @RequestBody Review review) {
        return reviewService.addReview(productId, review);
    }

    @GetMapping("/{productId}")
    public List<Review> getReviews(@PathVariable String productId) {
        return reviewService.getReviewsByProduct(productId);
    }
    @GetMapping("/allreviews")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }
}