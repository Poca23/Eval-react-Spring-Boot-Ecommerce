package com.greta.ecommerce.repository;

import com.greta.ecommerce.entity.Order;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class OrderRepository {
    private final JdbcTemplate jdbcTemplate;
    private final OrderItemRepository orderItemRepository;

    public OrderRepository(JdbcTemplate jdbcTemplate, OrderItemRepository orderItemRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.orderItemRepository = orderItemRepository;
    }

    public List<Order> findAll() {
        return jdbcTemplate.query(
                "SELECT * FROM orders",
                (rs, rowNum) -> {
                    Order order = new Order(
                            rs.getLong("id"),
                            rs.getString("customer_email"),
                            rs.getTimestamp("order_date").toLocalDateTime(),
                            null,
                            rs.getDouble("total_amount")
                    );
                    order.setItems(orderItemRepository.findByOrderId(order.getId()));
                    return order;
                }
        );
    }

    public Optional<Order> findById(Long id) {
        try {
            Order order = jdbcTemplate.queryForObject(
                    "SELECT * FROM orders WHERE id = ?",
                    (rs, rowNum) -> {
                        Order o = new Order(
                                rs.getLong("id"),
                                rs.getString("customer_email"),
                                rs.getTimestamp("order_date").toLocalDateTime(),
                                null,
                                rs.getDouble("total_amount")
                        );
                        o.setItems(orderItemRepository.findByOrderId(o.getId()));
                        return o;
                    },
                    id
            );
            return Optional.ofNullable(order);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Order> findByEmail(String email) {
        return jdbcTemplate.query(
                "SELECT * FROM orders WHERE customer_email = ?",
                (rs, rowNum) -> {
                    Order order = new Order(
                            rs.getLong("id"),
                            rs.getString("customer_email"),
                            rs.getTimestamp("order_date").toLocalDateTime(),
                            null,
                            rs.getDouble("total_amount")
                    );
                    order.setItems(orderItemRepository.findByOrderId(order.getId()));
                    return order;
                },
                email
        );
    }

    @Transactional
    public Order save(Order order) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO orders (customer_email, order_date, total_amount) VALUES (?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, order.getCustomerEmail());
            ps.setTimestamp(2, Timestamp.valueOf(order.getOrderDate()));
            ps.setDouble(3, order.getTotalAmount());
            return ps;
        }, keyHolder);

        Long orderId = Objects.requireNonNull(keyHolder.getKey()).longValue();
        order.setId(orderId);

        // Sauvegarde des items
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrderId(orderId));
            orderItemRepository.saveAll(order.getItems());
        }

        return order;
    }
}
