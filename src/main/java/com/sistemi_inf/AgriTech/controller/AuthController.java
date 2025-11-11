// src/main/java/com/sistemi_inf/AgriTech/controller/AuthController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.dto.AuthRequest;
import com.sistemi_inf.AgriTech.dto.AuthResponse;
import com.sistemi_inf.AgriTech.dto.RegisterRequest;
import com.sistemi_inf.AgriTech.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
