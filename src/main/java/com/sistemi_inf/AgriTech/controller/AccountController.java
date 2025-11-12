package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Utente;
import com.sistemi_inf.AgriTech.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final AccountService service;

    public AccountController(AccountService service) { this.service = service; }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public Utente me() { return service.me(); }

    @PutMapping("/me")
    @PreAuthorize("hasRole('CLIENTE') or hasRole('SOCIO') or hasRole('DIPENDENTE')")
    public Utente update(@RequestBody Map<String, String> body) { return service.updateContacts(body); }

    @PutMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePwd(@RequestBody Map<String, String> body) {
        service.changePassword(body.get("oldPassword"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password aggiornata"));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteMe() {
        service.deleteAccount();
        return ResponseEntity.accepted().body(Map.of("message", "Account rimosso (anonimizzato)"));
    }
}

