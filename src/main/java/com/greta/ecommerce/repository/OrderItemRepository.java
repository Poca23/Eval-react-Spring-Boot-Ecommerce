package com.greta.ecommerce.repository;

import com.greta.ecommerce.entity.OrderItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;

@Repository
public class OrderItemRepository {
    private final JdbcTemplate jdbcTemplate;

    public OrderItemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<OrderItem> findByOrderId(Long orderId) {
        return jdbcTemplate.query(
                "SELECT * FROM order_items WHERE order_id = ?",
                (rs, rowNum) ->
                        new OrderItem(
                                rs.getLong("id"),
                                rs.getLong("order_id"),
                                rs.getLong("product_id"),
                                rs.getInt("quantity"),
                                rs.getDouble("price")
                        ),
                orderId
        );
    }

    public void save(OrderItem orderItem) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setLong(1, orderItem.getOrderId());
            ps.setLong(2, orderItem.getProductId());
            ps.setInt(3, orderItem.getQuantity());
            ps.setDouble(4, orderItem.getPrice());
            return ps;
        }, keyHolder);

        orderItem.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
    }

    public void saveAll(List<OrderItem> items) {
        items.forEach(this::save);
    }
}
