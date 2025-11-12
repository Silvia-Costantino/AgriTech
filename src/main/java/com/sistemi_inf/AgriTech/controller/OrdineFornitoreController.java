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
    public ResponseEntity<OrdineFornitore> create(@RequestBody CreateOrdineFornitoreRequest request) {
        OrdineFornitore saved = ordineFornitoreService.create(request.getOrdine(), request.getItems());
        return ResponseEntity.ok(saved);
    }

    // DTO per la richiesta
    public static class CreateOrdineFornitoreRequest {
        private OrdineFornitore ordine;
        private List<OrdineFornitoreItem> items;

        public OrdineFornitore getOrdine() { return ordine; }
        public void setOrdine(OrdineFornitore ordine) { this.ordine = ordine; }
        public List<OrdineFornitoreItem> getItems() { return items; }
        public void setItems(List<OrdineFornitoreItem> items) { this.items = items; }
    }
}
