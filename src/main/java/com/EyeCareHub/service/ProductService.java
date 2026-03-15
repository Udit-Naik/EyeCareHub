package com.EyeCareHub.service;

import com.EyeCareHub.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    Product createProduct(Product product);
    List<Product> getAllProducts();
    Optional<Product> getProductById(String id);
    Product updateProduct(String id, Product product);
    void deleteProduct(String id);
    List<Product> getProductsByCategory(String category);
    List<Product> searchProductsByName(String name);
    List<Product> filterProductsByPrice(Double min, Double max);
}
