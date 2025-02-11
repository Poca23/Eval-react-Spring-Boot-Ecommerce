package com.greta.ecommerce.repository;

import com.greta.ecommerce.entity.OrderItem;

import java.util.List;

public interface OrderItemRepository {
    List<OrderItem> findByOrderId(Long orderId);
    OrderItem save(OrderItem orderItem);
    void saveAll(List<OrderItem> items);
}