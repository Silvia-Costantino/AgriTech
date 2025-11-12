package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Ricambio;
import com.sistemi_inf.AgriTech.service.OfficinaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ricambi")
public class RicambiController {
    private final OfficinaService officinaService;

    public RicambiController(OfficinaService officinaService) { this.officinaService = officinaService; }

    @GetMapping
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public List<Ricambio> list() { return officinaService.listRicambi(); }

    @PostMapping
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public Ricambio create(@RequestBody Ricambio r) { return officinaService.createRicambio(r); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public Ricambio update(@PathVariable Long id, @RequestBody Ricambio r) { return officinaService.updateRicambio(id, r); }
}

