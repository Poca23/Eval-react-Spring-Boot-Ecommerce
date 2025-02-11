package com.greta.ecommerce.repository;

import com.greta.ecommerce.entity.OrderItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderItemRepository {
    private final JdbcTemplate jdbcTemplate;

    public OrderItemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<OrderItem> findByOrderId(Long orderId) {
        String sql = "SELECT * FROM order_item WHERE order_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new OrderItem(
                        rs.getLong("id"),
                        rs.getLong("order_id"),
                        rs.getLong("product_id"),
                        rs.getInt("quantity")
                ), orderId);
    }

    public void save(OrderItem orderItem) {
        String sql = "INSERT INTO order_item (order_id, product_id, quantity) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql,
                orderItem.getOrderId(),
                orderItem.getProductId(),
                orderItem.getQuantity()
        );
    }

    public void saveAll(List<OrderItem> items) {
        for (OrderItem item : items) {
            save(item);
        }
    }
}
