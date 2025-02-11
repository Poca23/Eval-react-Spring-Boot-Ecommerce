package com.greta.ecommerce.repository;

import com.greta.ecommerce.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    List<Product> findAll();

    Optional<Product> findById(Long id);

    Product save(Product product);

    void update(Product product);

    void delete(Long id);

    boolean updateStock(Long id, int quantity);
}
