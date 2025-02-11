package com.greta.ecommerce.entity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;

import java.time.LocalDateTime;
import java.util.List;

public class Order {
    private Long id;

    @NotNull(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;
    private LocalDateTime date; // Géré par le service
    private String status; // Géré par le service
    private List<OrderItem> items;

    // Constructeur par défaut
    public Order() {
    }

    // Constructeur avec tous les champs
    public Order(Long id, String email, LocalDateTime date, String status, List<OrderItem> items) {
        this.id = id;
        this.email = email;
        this.date = date;
        this.status = status;
        this.items = items;
    }

    public Order(long id, String customerEmail, LocalDateTime orderDate, String status, double totalAmount) {
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", date=" + date +
                ", status='" + status + '\'' +
                ", items=" + items +
                '}';
    }
}