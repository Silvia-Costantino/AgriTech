// src/main/java/com/sistemi_inf/AgriTech/controller/ProdottoController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Prodotto;
import com.sistemi_inf.AgriTech.service.ProdottoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prodotti")
public class ProdottoController {

    private final ProdottoService prodottoService;

    public ProdottoController(ProdottoService prodottoService) {
        this.prodottoService = prodottoService;
    }

    @GetMapping
    public ResponseEntity<List<Prodotto>> listAll(@RequestParam(value = "marca", required = false) String marca) {
        if (marca != null && !marca.isBlank()) {
            return ResponseEntity.ok(prodottoService.findByMarca(marca));
        }
        return ResponseEntity.ok(prodottoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prodotto> get(@PathVariable Long id) {
        return prodottoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SHOWROOM','ROLE_SOCIO')")
    public ResponseEntity<Prodotto> create(@RequestBody Prodotto prodotto) {
        return ResponseEntity.ok(prodottoService.save(prodotto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOWROOM','ROLE_SOCIO')")
    public ResponseEntity<Prodotto> update(@PathVariable Long id, @RequestBody Prodotto prodotto) {
        return prodottoService.findById(id).map(existing -> {
            existing.setNome(prodotto.getNome());
            existing.setDescrizione(prodotto.getDescrizione());
            existing.setMarca(prodotto.getMarca());
            existing.setModello(prodotto.getModello());
            existing.setPrezzo(prodotto.getPrezzo());
            existing.setQuantitaDisponibile(prodotto.getQuantitaDisponibile());
            existing.setStockMinimo(prodotto.getStockMinimo());
            return ResponseEntity.ok(prodottoService.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SOCIO')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        prodottoService.findById(id).ifPresent(p -> prodottoService.save(p)); // placeholder: implement deletion if desired
        return ResponseEntity.noContent().build();
    }
}
