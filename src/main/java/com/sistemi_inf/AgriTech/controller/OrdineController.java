// src/main/java/com/sistemi_inf/AgriTech/controller/OrdineController.java
package com.sistemi_inf.AgriTech.controller;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.service.OrdineService;
import com.sistemi_inf.AgriTech.service.OrdineFornitoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordini")
public class OrdineController {

    private final OrdineService ordineService;
    private final OrdineFornitoreService ordineFornitoreService;

    public OrdineController(OrdineService ordineService, OrdineFornitoreService ordineFornitoreService) {
        this.ordineService = ordineService;
        this.ordineFornitoreService = ordineFornitoreService;
    }

    /**
     * Ottiene il ruolo dell'utente corrente
     */
    private String getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse(null);
    }

    /**
     * GET /api/ordini - Ottiene tutti gli ordini (clienti e fornitori) in base al ruolo
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOrdini() {
        String ruolo = getCurrentUserRole();
        Map<String, Object> response = new HashMap<>();

        if ("CLIENTE".equals(ruolo)) {
            // Clienti vedono solo i propri ordini
            List<Ordine> ordiniCliente = ordineService.getByCliente();
            response.put("ordiniCliente", ordiniCliente.stream()
                    .map(this::mapOrdineToDTO)
                    .collect(Collectors.toList()));
            response.put("ordiniFornitore", List.of());
        } else if ("SOCIO".equals(ruolo) || "DIPENDENTE".equals(ruolo)) {
            // Soci e Dipendenti vedono tutti gli ordini
            List<Ordine> ordiniCliente = ordineService.getAll();
            List<OrdineFornitore> ordiniFornitore = ordineFornitoreService.getAll();
            response.put("ordiniCliente", ordiniCliente.stream()
                    .map(this::mapOrdineToDTO)
                    .collect(Collectors.toList()));
            response.put("ordiniFornitore", ordiniFornitore.stream()
                    .map(this::mapOrdineFornitoreToDTO)
                    .collect(Collectors.toList()));
        } else {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/ordini/from-carrello/{carrelloId} - Crea ordine da carrello
     */
    @PostMapping("/from-carrello/{carrelloId}")
    public ResponseEntity<Ordine> createFromCart(@PathVariable Long carrelloId) {
        return ResponseEntity.ok(ordineService.creaOrdineDaCarrello(carrelloId));
    }

    /**
     * POST /api/ordini/nuovo - Crea un nuovo ordine (DIPENDENTE/SOCIO)
     */
    @PostMapping("/nuovo")
    public ResponseEntity<Map<String, Object>> creaNuovoOrdine(@RequestBody Map<String, Object> request) {
        String ruolo = getCurrentUserRole();
        if (!"DIPENDENTE".equals(ruolo) && !"SOCIO".equals(ruolo)) {
            return ResponseEntity.status(403).build();
        }
        // Per ora supportiamo solo ordini da carrello
        // In futuro si può implementare creazione ordine manuale
        return ResponseEntity.status(501).build();
    }

    /**
     * PUT /api/ordini/{id}/stato - Aggiorna lo stato di un ordine cliente (SOCIO)
     */
    @PutMapping("/{id}/stato")
    public ResponseEntity<Map<String, Object>> aggiornaStatoOrdine(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String ruolo = getCurrentUserRole();
        if (!"SOCIO".equals(ruolo)) {
            return ResponseEntity.status(403).build();
        }

        StatoOrdine nuovoStato = StatoOrdine.valueOf(request.get("stato"));
        Ordine ordine = ordineService.aggiornaStato(id, nuovoStato);
        return ResponseEntity.ok(mapOrdineToDTO(ordine));
    }

    /**
     * DELETE /api/ordini/{id} - Annulla un ordine cliente (SOCIO)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> annullaOrdine(@PathVariable Long id) {
        String ruolo = getCurrentUserRole();
        if (!"SOCIO".equals(ruolo)) {
            return ResponseEntity.status(403).build();
        }

        Ordine ordine = ordineService.annulla(id);
        return ResponseEntity.ok(mapOrdineToDTO(ordine));
    }

    /**
     * POST /api/ordini/{id}/conferma-spedizione - Conferma spedizione (DIPENDENTE/SOCIO)
     */
    @PostMapping("/{id}/conferma-spedizione")
    public ResponseEntity<Map<String, Object>> confermaSpedizione(@PathVariable Long id) {
        String ruolo = getCurrentUserRole();
        if (!"DIPENDENTE".equals(ruolo) && !"SOCIO".equals(ruolo)) {
            return ResponseEntity.status(403).build();
        }

        Ordine ordine = ordineService.confermaSpedizione(id);
        return ResponseEntity.ok(mapOrdineToDTO(ordine));
    }

    /**
     * PUT /api/ordini/fornitore/{id}/stato - Aggiorna stato ordine fornitore (SOCIO)
     */
    @PutMapping("/fornitore/{id}/stato")
    public ResponseEntity<Map<String, Object>> aggiornaStatoOrdineFornitore(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String ruolo = getCurrentUserRole();
        if (!"SOCIO".equals(ruolo)) {
            return ResponseEntity.status(403).build();
        }

        StatoOrdineFornitore nuovoStato = StatoOrdineFornitore.valueOf(request.get("stato"));
        OrdineFornitore ordine = ordineFornitoreService.aggiornaStato(id, nuovoStato);
        return ResponseEntity.ok(mapOrdineFornitoreToDTO(ordine));
    }

    /**
     * DELETE /api/ordini/fornitore/{id} - Annulla ordine fornitore (SOCIO)
     */
    @DeleteMapping("/fornitore/{id}")
    public ResponseEntity<Map<String, Object>> annullaOrdineFornitore(@PathVariable Long id) {
        String ruolo = getCurrentUserRole();
        if (!"SOCIO".equals(ruolo)) {
            return ResponseEntity.status(403).build();
        }

        OrdineFornitore ordine = ordineFornitoreService.annulla(id);
        return ResponseEntity.ok(mapOrdineFornitoreToDTO(ordine));
    }

    /**
     * Mappa Ordine a DTO per la risposta
     */
    private Map<String, Object> mapOrdineToDTO(Ordine ordine) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", ordine.getId());
        dto.put("tipo", "CLIENTE");
        dto.put("cliente", ordine.getCliente() != null ? 
                ordine.getCliente().getNome() + " " + ordine.getCliente().getCognome() : "N/A");
        dto.put("data", ordine.getDataOrdine());
        dto.put("stato", ordine.getStato().name());
        dto.put("importo", ordine.getTotale());
        return dto;
    }

    /**
     * Mappa OrdineFornitore a DTO per la risposta
     */
    private Map<String, Object> mapOrdineFornitoreToDTO(OrdineFornitore ordine) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", ordine.getId());
        dto.put("tipo", "FORNITORE");
        dto.put("fornitore", ordine.getFornitore() != null ? 
                ordine.getFornitore().getNome() : "N/A");
        dto.put("data", ordine.getDataOrdine());
        dto.put("stato", mapStatoFornitoreToStatoOrdine(ordine.getStato()));
        dto.put("importo", ordine.getTotale());
        return dto;
    }

    /**
     * Mappa StatoOrdineFornitore a formato compatibile con StatoOrdine
     */
    private String mapStatoFornitoreToStatoOrdine(StatoOrdineFornitore stato) {
        switch (stato) {
            case IN_ATTESA:
                return "IN_ELABORAZIONE";
            case EVASO:
                return "CONSEGNATO";
            case ANNULLATO:
                return "ANNULLATO";
            default:
                return stato.name();
        }
    }
}
