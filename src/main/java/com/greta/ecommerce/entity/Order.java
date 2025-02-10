// Order.java
package com.greta.ecommerce.entity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.util.List;

public class Order {
    private Long id;

    @NotNull(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String customerEmail;

    @NotNull(message = "La date de commande est obligatoire")
    private LocalDateTime orderDate;

    private List<OrderItem> items;

    @NotNull(message = "Le montant total est obligatoire")
    @Positive(message = "Le montant total doit être positif")
    private Double totalAmount;

    // Constructeur par défaut
    public Order() {
    }

    // Constructeur avec tous les champs
    public Order(Long id, String customerEmail, LocalDateTime orderDate, List<OrderItem> items, Double totalAmount) {
        this.id = id;
        this.customerEmail = customerEmail;
        this.orderDate = orderDate;
        this.items = items;
        this.totalAmount = totalAmount;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", customerEmail='" + customerEmail + '\'' +
                ", orderDate=" + orderDate +
                ", items=" + items +
                ", totalAmount=" + totalAmount +
                '}';
    }
}
