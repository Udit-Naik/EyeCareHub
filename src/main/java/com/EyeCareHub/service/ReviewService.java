package com.EyeCareHub.service;

import com.EyeCareHub.model.Review;
import java.util.List;

public interface ReviewService {

    Review addReview(String productId, Review review);

    List<Review> getReviewsByProduct(String productId);
    List<Review> getAllReviews();
}