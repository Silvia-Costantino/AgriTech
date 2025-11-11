// src/main/java/com/sistemi_inf/AgriTech/controller/CarrelloController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Carrello;
import com.sistemi_inf.AgriTech.service.CarrelloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrelli")
public class CarrelloController {

    private final CarrelloService carrelloService;

    public CarrelloController(CarrelloService carrelloService) {
        this.carrelloService = carrelloService;
    }

    @PostMapping("/create/{clienteId}")
    public ResponseEntity<Carrello> create(@PathVariable Long clienteId) {
        return ResponseEntity.ok(carrelloService.getOrCreateByClienteId(clienteId));
    }

    @PostMapping("/{carrelloId}/items")
    public ResponseEntity<Carrello> addItem(@PathVariable Long carrelloId, @RequestParam Long prodottoId, @RequestParam(required = false) Integer quantita) {
        return ResponseEntity.ok(carrelloService.addItem(carrelloId, prodottoId, quantita));
    }
}
