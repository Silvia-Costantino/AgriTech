// src/main/java/com/sistemi_inf/AgriTech/service/OrdineFornitoreService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.OrdineFornitoreItemRepository;
import com.sistemi_inf.AgriTech.repository.OrdineFornitoreRepository;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrdineFornitoreService {

    private final OrdineFornitoreRepository ordineFornitoreRepository;
    private final OrdineFornitoreItemRepository itemRepository;
    private final ProdottoRepository prodottoRepository;

    public OrdineFornitoreService(OrdineFornitoreRepository ordineFornitoreRepository, OrdineFornitoreItemRepository itemRepository, ProdottoRepository prodottoRepository) {
        this.ordineFornitoreRepository = ordineFornitoreRepository;
        this.itemRepository = itemRepository;
        this.prodottoRepository = prodottoRepository;
    }

    /**
     * Ottiene tutti gli ordini fornitore
     */
    public List<OrdineFornitore> getAll() {
        return ordineFornitoreRepository.findAll();
    }

    /**
     * Ottiene un ordine fornitore per ID
     */
    public OrdineFornitore getById(Long id) {
        return ordineFornitoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordine fornitore non trovato"));
    }

    /**
     * Crea un nuovo ordine fornitore
     */
    @Transactional
    public OrdineFornitore create(OrdineFornitore ordine, List<OrdineFornitoreItem> items) {
        java.math.BigDecimal totale = java.math.BigDecimal.ZERO;
        for (OrdineFornitoreItem it : items) {
            if (it.getProdotto() != null && it.getProdotto().getPrezzo() != null) {
                totale = totale.add(it.getProdotto().getPrezzo()
                        .multiply(java.math.BigDecimal.valueOf(it.getQuantita())));
            }
        }
        ordine.setTotale(totale);
        
        OrdineFornitore saved = ordineFornitoreRepository.save(ordine);
        for (OrdineFornitoreItem it : items) {
            it.setOrdineFornitore(saved);
            itemRepository.save(it);
            // quando ordine fornitore è evaso, in futuro incrementeremo stock del prodotto
        }
        return saved;
    }

    /**
     * Aggiorna lo stato di un ordine fornitore
     */
    @Transactional
    public OrdineFornitore aggiornaStato(Long id, StatoOrdineFornitore nuovoStato) {
        OrdineFornitore ordine = ordineFornitoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordine fornitore non trovato"));
        ordine.setStato(nuovoStato);
        
        // Se l'ordine è stato evaso, incrementa lo stock dei prodotti
        if (nuovoStato == StatoOrdineFornitore.EVASO) {
            List<OrdineFornitoreItem> items = itemRepository.findByOrdineFornitore(ordine);
            for (OrdineFornitoreItem item : items) {
                if (item.getProdotto() != null) {
                    Prodotto p = item.getProdotto();
                    p.setQuantitaDisponibile(p.getQuantitaDisponibile() + item.getQuantita());
                    prodottoRepository.save(p);
                }
            }
        }
        
        return ordineFornitoreRepository.save(ordine);
    }

    /**
     * Annulla un ordine fornitore
     */
    @Transactional
    public OrdineFornitore annulla(Long id) {
        OrdineFornitore ordine = ordineFornitoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordine fornitore non trovato"));
        
        if (ordine.getStato() == StatoOrdineFornitore.EVASO) {
            throw new RuntimeException("Non è possibile annullare un ordine già evaso");
        }
        
        ordine.setStato(StatoOrdineFornitore.ANNULLATO);
        return ordineFornitoreRepository.save(ordine);
    }
}
