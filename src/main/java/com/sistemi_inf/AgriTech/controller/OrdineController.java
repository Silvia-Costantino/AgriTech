// src/main/java/com/sistemi_inf/AgriTech/controller/OrdineController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Ordine;
import com.sistemi_inf.AgriTech.service.OrdineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordini")
public class OrdineController {

    private final OrdineService ordineService;

    public OrdineController(OrdineService ordineService) {
        this.ordineService = ordineService;
    }

    @PostMapping("/from-carrello/{carrelloId}")
    public ResponseEntity<Ordine> createFromCart(@PathVariable Long carrelloId) {
        return ResponseEntity.ok(ordineService.creaOrdineDaCarrello(carrelloId));
    }
}
