package com.greta.ecommerce.repository;

import com.greta.ecommerce.entity.Order;
import com.greta.ecommerce.entity.OrderItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
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
        String sql = "SELECT * FROM orders";
        List<Order> orders = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Order(
                        rs.getLong("id"),
                        rs.getString("email"),
                        rs.getTimestamp("date").toLocalDateTime(),
                        rs.getString("status"),
                        null
                )
        );

        // Charger les items pour chaque commande
        for (Order order : orders) {
            order.setItems(orderItemRepository.findByOrderId(order.getId()));
        }
        return orders;
    }

    public Optional<Order> findById(Long id) {
        try {
            String sql = "SELECT * FROM orders WHERE id = ?";
            Order order = jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                    new Order(
                            rs.getLong("id"),
                            rs.getString("email"),
                            rs.getTimestamp("date").toLocalDateTime(),
                            rs.getString("status"),
                            null
                    ), id);

            if (order != null) {
                order.setItems(orderItemRepository.findByOrderId(order.getId()));
            }
            return Optional.ofNullable(order);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Order> findByEmail(String email) {
        String sql = "SELECT * FROM orders WHERE email = ?";
        List<Order> orders = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Order(
                        rs.getLong("id"),
                        rs.getString("email"),
                        rs.getTimestamp("date").toLocalDateTime(),
                        rs.getString("status"),
                        null
                ), email);

        for (Order order : orders) {
            order.setItems(orderItemRepository.findByOrderId(order.getId()));
        }
        return orders;
    }

    public List<Order> findByStatus(String status) {
        String sql = "SELECT * FROM orders WHERE status = ?";
        List<Order> orders = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Order(
                        rs.getLong("id"),
                        rs.getString("email"),
                        rs.getTimestamp("date").toLocalDateTime(),
                        rs.getString("status"),
                        null
                ), status);

        for (Order order : orders) {
            order.setItems(orderItemRepository.findByOrderId(order.getId()));
        }
        return orders;
    }

    public Order save(Order order) {
        if (order.getId() == null) {
            // Insert
            String sql = "INSERT INTO orders (email, date, status) VALUES (?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, order.getEmail());
                ps.setTimestamp(2, Timestamp.valueOf(order.getDate()));
                ps.setString(3, order.getStatus());
                return ps;
            }, keyHolder);

            order.setId(keyHolder.getKey().longValue());
        } else {
            // Update
            String sql = "UPDATE orders SET email = ?, date = ?, status = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    order.getEmail(),
                    Timestamp.valueOf(order.getDate()),
                    order.getStatus(),
                    order.getId()
            );
        }

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrderId(order.getId());
                orderItemRepository.save(item);
            }
        }

        return order;
    }
}
