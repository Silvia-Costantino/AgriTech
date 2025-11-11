// src/main/java/com/sistemi_inf/AgriTech/controller/FornitoreController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Fornitore;
import com.sistemi_inf.AgriTech.service.FornitoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fornitori")
public class FornitoreController {

    private final FornitoreService fornitoreService;

    public FornitoreController(FornitoreService fornitoreService) {
        this.fornitoreService = fornitoreService;
    }

    @GetMapping
    public ResponseEntity<List<Fornitore>> list() {
        return ResponseEntity.ok(fornitoreService.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SHOWROOM','ROLE_SOCIO')")
    public ResponseEntity<Fornitore> create(@RequestBody Fornitore f) {
        return ResponseEntity.ok(fornitoreService.save(f));
    }
}
