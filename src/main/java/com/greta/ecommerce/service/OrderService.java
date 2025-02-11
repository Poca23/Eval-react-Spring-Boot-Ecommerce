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

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository; // Pour gérer les stocks

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
        // Vérification des stocks avant de créer la commande
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new StockException("Insufficient stock for product: " + product.getName());
            }
        }

        // Création de la commande
        Order savedOrder = orderRepository.save(order);

        // Mise à jour des stocks et sauvegarde des items
        for (OrderItem item : order.getItems()) {
            item.setOrderId(savedOrder.getId());
            productRepository.updateStock(item.getProductId(), -item.getQuantity());
        }
        orderItemRepository.saveAll(order.getItems());

        return savedOrder;
    }
}
