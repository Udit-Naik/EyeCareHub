package com.EyeCareHub.service;

import com.EyeCareHub.model.Product;
import com.EyeCareHub.repository.ProductRepository;
import com.EyeCareHub.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        if (product.getCreatedAt() == null) {
            product.setCreatedAt(new java.util.Date());
        }
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    @Override
    public Product updateProduct(String id, Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setCategory(productDetails.getCategory());
            product.setBrand(productDetails.getBrand());
            product.setGender(productDetails.getGender());
            product.setPrice(productDetails.getPrice());
            product.setDiscount(productDetails.getDiscount());
            product.setRating(productDetails.getRating());
            product.setDescription(productDetails.getDescription());
            product.setImageUrl(productDetails.getImageUrl());
            product.setStock(productDetails.getStock());
            return productRepository.save(product);
        }).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> filterProductsByPrice(Double min, Double max) {
        return productRepository.findByPriceBetween(min, max);
    }
}
