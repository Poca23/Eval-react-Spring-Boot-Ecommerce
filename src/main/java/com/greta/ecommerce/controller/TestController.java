// controller/TestController.java
package com.greta.ecommerce.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "Ceci est un endpoint public";
    }

    @GetMapping("/admin")
    public String adminEndpoint() {
        return "Ceci est un endpoint admin";
    }
}
