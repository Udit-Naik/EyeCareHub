package com.EyeCareHub.service;

import com.EyeCareHub.model.Product;
import com.EyeCareHub.model.Review;
import com.EyeCareHub.repository.ProductRepository;
import com.EyeCareHub.repository.ReviewRepository;
import com.EyeCareHub.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Review addReview(String productId, Review review) {

        // check product exists
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        review.setProductId(productId);

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByProduct(String productId) {

        return reviewRepository.findByProductId(productId);
    }
    @Override
public List<Review> getAllReviews() {
    return reviewRepository.findAll();
}
}