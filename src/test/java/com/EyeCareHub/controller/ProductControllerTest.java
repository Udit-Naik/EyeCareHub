package com.EyeCareHub.controller;

import com.EyeCareHub.model.Product;
import com.EyeCareHub.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    public void getAllProducts_returnsList() throws Exception {
        Product p = new Product("Test Glasses","Eyeglasses","Acme","Unisex",99.0,0.0,4.5,"Nice","/img.jpg",10);
        when(productService.getAllProducts()).thenReturn(Collections.singletonList(p));

        mockMvc.perform(get("/api/products").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Glasses"));
    }

    @Test
    public void getProductById_returnsProduct() throws Exception {
        Product p = new Product("Single","Eyeglasses","Acme","Unisex",50.0,0.0,4.0,"Desc","/img.jpg",5);
        p.setId("abc123");
        when(productService.getProductById("abc123")).thenReturn(java.util.Optional.of(p));

        mockMvc.perform(get("/api/products/abc123").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("abc123"))
                .andExpect(jsonPath("$.name").value("Single"));
    }
}
