// src/main/java/com/sistemi_inf/AgriTech/controller/ProdottoController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Prodotto;
import com.sistemi_inf.AgriTech.service.ProdottoService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/prodotti")
@CrossOrigin(origins = "http://localhost:4200")
public class ProdottoController {

    private final ProdottoService prodottoService;

    public ProdottoController(ProdottoService prodottoService) {
        this.prodottoService = prodottoService;
    }

    @GetMapping
    public List<Prodotto> getAll() {
        return prodottoService.getAll();
    }

    @GetMapping("/search")
    public List<Prodotto> search(@RequestParam String marca) {
        return prodottoService.searchByMarca(marca);
    }

    /**
     * Endpoint per filtri avanzati (marca, prezzo, quantità)
     */
    @GetMapping("/filter")
    public List<Prodotto> filterAdvanced(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) BigDecimal prezzoMin,
            @RequestParam(required = false) BigDecimal prezzoMax,
            @RequestParam(required = false) Integer quantitaMin,
            @RequestParam(required = false) Integer quantitaMax) {
        return prodottoService.filterAdvanced(marca, prezzoMin, prezzoMax, quantitaMin, quantitaMax);
    }

    @PostMapping
    public Prodotto add(@RequestBody Prodotto p) {
        return prodottoService.save(p);
    }

    @PutMapping("/{id}")
    public Prodotto update(@PathVariable Long id, @RequestBody Prodotto p) {
        return prodottoService.update(id, p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        prodottoService.delete(id);
    }
}
