package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.TurnoDipendente;
import com.sistemi_inf.AgriTech.service.DipendentiService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turni")
public class TurniController {
    private final DipendentiService service;

    public TurniController(DipendentiService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public List<TurnoDipendente> list() { return service.listTurni(); }

    @GetMapping("/{cf}")
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public TurnoDipendente get(@PathVariable String cf) { return service.getTurno(cf).orElse(null); }

    @PutMapping("/{cf}")
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public TurnoDipendente update(@PathVariable String cf, @RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<String> giorni = (List<String>) body.get("giorni");
        String orario = body.get("orario") != null ? body.get("orario").toString() : null;
        return service.updateTurno(cf, giorni, orario);
    }
}

