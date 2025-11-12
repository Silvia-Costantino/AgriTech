package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Ordine;
import com.sistemi_inf.AgriTech.model.Preventivo;
import com.sistemi_inf.AgriTech.model.StatoPreventivo;
import com.sistemi_inf.AgriTech.service.ClientiPreventiviService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/preventivi")
@PreAuthorize("hasRole('SOCIO')")
public class PreventiviController {
    private final ClientiPreventiviService service;
    public PreventiviController(ClientiPreventiviService service) { this.service = service; }

    @GetMapping
    public List<Preventivo> list() { return service.listPreventivi(); }

    @PostMapping
    public Preventivo create(@RequestBody Map<String, String> body) {
        Long clienteId = Long.valueOf(body.get("clienteId"));
        String modello = body.get("modello");
        BigDecimal prezzo = body.get("prezzo") != null ? new BigDecimal(body.get("prezzo")) : BigDecimal.ZERO;
        BigDecimal sconto = body.get("sconto") != null ? new BigDecimal(body.get("sconto")) : BigDecimal.ZERO;
        LocalDate validita = body.get("validita") != null ? LocalDate.parse(body.get("validita")) : LocalDate.now().plusDays(30);
        return service.creaPreventivo(clienteId, modello, prezzo, sconto, validita);
    }

    @PutMapping("/{id}/approva")
    public Preventivo approva(@PathVariable Long id) { return service.setStato(id, StatoPreventivo.APPROVATO); }

    @PutMapping("/{id}/rifiuta")
    public Preventivo rifiuta(@PathVariable Long id) { return service.setStato(id, StatoPreventivo.RIFIUTATO); }

    @PostMapping("/{id}/converti")
    public Map<String, Object> converti(@PathVariable Long id) {
        Ordine o = service.convertiInOrdine(id);
        return Map.of("ordineId", o.getId(), "message", "Preventivo convertito in ordine");
    }
}

