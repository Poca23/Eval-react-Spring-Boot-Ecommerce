package com.greta.ecommerce.repository;

import com.greta.ecommerce.entity.Product;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class ProductRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Product> findAll() {
        return jdbcTemplate.query(
                "SELECT * FROM product",
                (rs, rowNum) ->
                        new Product(
                                rs.getLong("id"),
                                rs.getString("name"),
                                rs.getString("description"),
                                rs.getDouble("price"),
                                rs.getInt("stock"),
                                rs.getString("image_url")
                        )
        );
    }

    public Optional<Product> findById(Long id) {
        try {
            Product product = jdbcTemplate.queryForObject(
                    "SELECT * FROM product WHERE id = ?",
                    (rs, rowNum) ->
                            new Product(
                                    rs.getLong("id"),
                                    rs.getString("name"),
                                    rs.getString("description"),
                                    rs.getDouble("price"),
                                    rs.getInt("stock"),
                                    rs.getString("image_url")
                            ),
                    id
            );
            return Optional.ofNullable(product);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Product save(Product product) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO product (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, product.getName());
            ps.setString(2, product.getDescription());
            ps.setDouble(3, product.getPrice());
            ps.setInt(4, product.getStock());
            ps.setString(5, product.getImageUrl());
            return ps;
        }, keyHolder);

        Long id = Objects.requireNonNull(keyHolder.getKey()).longValue();
        product.setId(id);
        return product;
    }

    public Product update(Product product) {
        jdbcTemplate.update(
                "UPDATE product SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?",
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getId()
        );
        return product;
    }

    public void delete(Long id) {
        jdbcTemplate.update("DELETE FROM product WHERE id = ?", id);
    }

    public boolean updateStock(Long id, int quantity) {
        try {
            int updatedRows = jdbcTemplate.update(
                    "UPDATE product SET stock = stock - ? WHERE id = ? AND stock >= ?",
                    quantity, id, quantity
            );
            return updatedRows > 0;
        } catch (DataAccessException e) {
            return false;
        }
    }
}
