package com.greta.ecommerce.repository;

import com.greta.ecommerce.entity.Order;

import java.util.List;
import java.util.Optional;

public interface OrderRepository {
    List<Order> findAll();

    Optional<Order> findById(Long id);

    List<Order> findByEmail(String email);

    Order save(Order order);
}