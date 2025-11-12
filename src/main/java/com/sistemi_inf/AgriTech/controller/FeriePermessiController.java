package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.FeriePermesso;
import com.sistemi_inf.AgriTech.model.StatoRichiesta;
import com.sistemi_inf.AgriTech.service.DipendentiService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ferie-permessi")
public class FeriePermessiController {
    private final DipendentiService service;

    public FeriePermessiController(DipendentiService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public List<FeriePermesso> list() { return service.listFeriePermessi(); }

    @GetMapping("/{cf}")
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public List<FeriePermesso> byCf(@PathVariable String cf) { return service.listFeriePermessiByCf(cf); }

    @PutMapping("/{cf}")
    @PreAuthorize("hasRole('SOCIO')")
    public void setStato(@PathVariable String cf, @RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<String> giorni = (List<String>) body.get("giorni");
        String statoStr = body.get("stato") != null ? body.get("stato").toString() : null;
        StatoRichiesta stato = statoStr != null ? StatoRichiesta.valueOf(statoStr) : null;
        if (stato == null) throw new IllegalArgumentException("Stato non valido");
        service.setFerieStato(cf, giorni, stato);
    }
}

