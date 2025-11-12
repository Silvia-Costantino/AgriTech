package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Preventivo;
import com.sistemi_inf.AgriTech.model.Utente;
import com.sistemi_inf.AgriTech.service.ClientiPreventiviService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clienti")
@PreAuthorize("hasRole('SOCIO')")
public class ClientiController {
    private final ClientiPreventiviService service;
    public ClientiController(ClientiPreventiviService service) { this.service = service; }

    @GetMapping
    public List<Utente> list(@RequestParam(value = "q", required = false) String q) { return service.listClienti(q); }

    @PutMapping("/{id}")
    public Utente update(@PathVariable Long id, @RequestBody Utente payload) { return service.updateCliente(id, payload); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.deleteCliente(id); }

    @GetMapping("/{id}/preventivi")
    public List<Preventivo> byCliente(@PathVariable Long id) { return service.listPreventiviByCliente(id); }
}

