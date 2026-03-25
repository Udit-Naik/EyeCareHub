package com.EyeCareHub.dto;

public class OrderRequest {

    private Long productId;
    private int quantity;
    private String paymentType; 

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // ✅ ADD GETTER
    public String getPaymentType() {
        return paymentType;
    }

    // ✅ ADD SETTER
    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }
}