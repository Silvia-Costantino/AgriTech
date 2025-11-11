// src/main/java/com/sistemi_inf/AgriTech/controller/OrdineFornitoreController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.OrdineFornitore;
import com.sistemi_inf.AgriTech.model.OrdineFornitoreItem;
import com.sistemi_inf.AgriTech.service.OrdineFornitoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordini-fornitore")
public class OrdineFornitoreController {

    private final OrdineFornitoreService ordineFornitoreService;

    public OrdineFornitoreController(OrdineFornitoreService ordineFornitoreService) {
        this.ordineFornitoreService = ordineFornitoreService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SHOWROOM','ROLE_SOCIO')")
    public ResponseEntity<OrdineFornitore> create(@RequestBody OrdineFornitore ordine, @RequestBody List<OrdineFornitoreItem> items) {
        OrdineFornitore saved = ordineFornitoreService.create(ordine, items);
        return ResponseEntity.ok(saved);
    }
}
