package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.Dipendente;
import com.sistemi_inf.AgriTech.service.DipendentiService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dipendenti")
public class DipendentiController {
    private final DipendentiService service;

    public DipendentiController(DipendentiService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public List<Dipendente> list() { return service.listDipendenti(); }

    @PostMapping
    @PreAuthorize("hasRole('SOCIO')")
    public Dipendente create(@RequestBody Dipendente d) { return service.saveDipendente(d); }

    @PutMapping("/{cf}")
    @PreAuthorize("hasRole('SOCIO')")
    public Dipendente update(@PathVariable String cf, @RequestBody Dipendente d) { return service.updateDipendente(cf, d); }

    @DeleteMapping("/{cf}")
    @PreAuthorize("hasRole('SOCIO')")
    public void delete(@PathVariable String cf) { service.deleteDipendente(cf); }
}

