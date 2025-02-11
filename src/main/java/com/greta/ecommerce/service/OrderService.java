package com.greta.ecommerce.service;

import com.greta.ecommerce.entity.Order;
import com.greta.ecommerce.entity.OrderItem;
import com.greta.ecommerce.entity.Product;
import com.greta.ecommerce.exception.ResourceNotFoundException;
import com.greta.ecommerce.exception.StockException;
import com.greta.ecommerce.repository.OrderItemRepository;
import com.greta.ecommerce.repository.OrderRepository;
import com.greta.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        // Pour chaque commande, on récupère ses items
        for (Order order : orders) {
            order.setItems(orderItemRepository.findByOrderId(order.getId()));
        }
        return orders;
    }

    public Order getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setItems(orderItemRepository.findByOrderId(id));
        return order;
    }

    public List<Order> getOrdersByEmail(String email) {
        List<Order> orders = orderRepository.findByEmail(email);
        for (Order order : orders) {
            order.setItems(orderItemRepository.findByOrderId(order.getId()));
        }
        return orders;
    }

    @Transactional
    public Order createOrder(Order order) {
        // Validation des données de base
        if (order.getEmail() == null || order.getItems() == null || order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must have an email and items");
        }

        // Initialisation des données par défaut
        order.setDate(LocalDateTime.now());
        order.setStatus("PENDING");

        // Vérification des stocks
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new StockException("Insufficient stock for product: " + product.getName());
            }
        }

        // Sauvegarde de la commande
        orderRepository.save(order);

        // Mise à jour des stocks et sauvegarde des items
        for (OrderItem item : order.getItems()) {
            // Mise à jour du stock
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProductId()));
            productRepository.updateStock(product.getId(), product.getStock() - item.getQuantity());

            // Sauvegarde de l'item
            item.setOrderId(order.getId());
            orderItemRepository.save(item);
        }

        return order;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);
        orderRepository.save(order);
        return order;
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);

        // On ne peut annuler que les commandes en attente
        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalStateException("Can only cancel pending orders");
        }

        // Remise en stock des produits
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProductId()));
            productRepository.updateStock(product.getId(), product.getStock() + item.getQuantity());
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }
}
