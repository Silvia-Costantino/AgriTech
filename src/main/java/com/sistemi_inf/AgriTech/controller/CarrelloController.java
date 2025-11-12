// src/main/java/com/sistemi_inf/AgriTech/controller/CarrelloController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Carrello;
import com.sistemi_inf.AgriTech.service.CarrelloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrello")
public class CarrelloController {

    private final CarrelloService carrelloService;

    public CarrelloController(CarrelloService carrelloService) {
        this.carrelloService = carrelloService;
    }

    /**
     * Ottiene il carrello dell'utente corrente
     */
    @GetMapping
    public ResponseEntity<Carrello> getCarrello() {
        return ResponseEntity.ok(carrelloService.getOrCreateCarrello());
    }

    /**
     * Aggiunge un prodotto al carrello
     */
    @PostMapping("/aggiungi")
    public ResponseEntity<Carrello> aggiungiProdotto(@RequestBody AddProdottoRequest request) {
        return ResponseEntity.ok(carrelloService.addItem(request.getProdottoId(), request.getQuantita()));
    }

    /**
     * Aggiorna la quantità di un prodotto nel carrello
     */
    @PutMapping("/aggiorna")
    public ResponseEntity<Carrello> aggiornaQuantita(@RequestBody UpdateQuantitaRequest request) {
        return ResponseEntity.ok(carrelloService.updateQuantita(request.getProdottoId(), request.getQuantita()));
    }

    /**
     * Rimuove un prodotto dal carrello
     */
    @DeleteMapping("/rimuovi/{prodottoId}")
    public ResponseEntity<Carrello> rimuoviProdotto(@PathVariable Long prodottoId) {
        return ResponseEntity.ok(carrelloService.rimuoviItem(prodottoId));
    }

    /**
     * Svuota completamente il carrello
     */
    @DeleteMapping("/svuota")
    public ResponseEntity<Carrello> svuotaCarrello() {
        return ResponseEntity.ok(carrelloService.svuotaCarrello());
    }

    // DTO per le richieste
    public static class AddProdottoRequest {
        private Long prodottoId;
        private Integer quantita;

        public Long getProdottoId() { return prodottoId; }
        public void setProdottoId(Long prodottoId) { this.prodottoId = prodottoId; }
        public Integer getQuantita() { return quantita; }
        public void setQuantita(Integer quantita) { this.quantita = quantita; }
    }

    public static class UpdateQuantitaRequest {
        private Long prodottoId;
        private Integer quantita;

        public Long getProdottoId() { return prodottoId; }
        public void setProdottoId(Long prodottoId) { this.prodottoId = prodottoId; }
        public Integer getQuantita() { return quantita; }
        public void setQuantita(Integer quantita) { this.quantita = quantita; }
    }
}
