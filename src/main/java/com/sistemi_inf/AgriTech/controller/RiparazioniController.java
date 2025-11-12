package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.service.OfficinaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/riparazioni")
public class RiparazioniController {
    private final OfficinaService officinaService;

    public RiparazioniController(OfficinaService officinaService) { this.officinaService = officinaService; }

    @GetMapping
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public List<Riparazione> list() { return officinaService.listRiparazioni(); }

    @GetMapping("/completate")
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public List<Riparazione> completate() {
        return officinaService.listRiparazioni().stream()
                .filter(r -> r.getStato() == StatoRiparazione.COMPLETATA)
                .toList();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public Riparazione create(@RequestBody Map<String, String> body) {
        String targa = body.get("targa");
        StatoRiparazione stato = body.get("stato") != null ? StatoRiparazione.valueOf(body.get("stato")) : null;
        Urgenza urgenza = body.get("urgenza") != null ? Urgenza.valueOf(body.get("urgenza")) : null;
        return officinaService.createRiparazione(targa, stato, urgenza);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public Riparazione update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        StatoRiparazione stato = body.get("stato") != null ? StatoRiparazione.valueOf(body.get("stato")) : null;
        Urgenza urgenza = body.get("urgenza") != null ? Urgenza.valueOf(body.get("urgenza")) : null;
        return officinaService.updateRiparazione(id, stato, urgenza);
    }

    @PostMapping("/{id}/ricambi")
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public ResponseEntity<?> richiestaRicambio(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long ricambioId = body.get("ricambioId") != null ? Long.valueOf(body.get("ricambioId").toString()) : null;
        Integer quantita = body.get("quantita") != null ? Integer.valueOf(body.get("quantita").toString()) : null;
        RiparazioneRicambio rr = officinaService.richiestaRicambio(id, ricambioId, quantita);
        return ResponseEntity.ok(Map.of(
                "id", rr.getId(),
                "riparazioneId", rr.getRiparazione().getId(),
                "ricambioId", rr.getRicambio().getId(),
                "quantita", rr.getQuantita()
        ));
    }

    @PostMapping("/{id}/completa")
    @PreAuthorize("hasAnyRole('SOCIO','DIPENDENTE')")
    public ResponseEntity<?> completa(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String note = body != null ? body.get("note") : null;
        ReportManutenzione report = officinaService.completaRiparazione(id, note);
        return ResponseEntity.ok(Map.of(
                "reportId", report.getId(),
                "message", "Manutenzione completata"
        ));
    }
}
