// src/main/java/com/sistemi_inf/AgriTech/service/OrdineFornitoreService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.OrdineFornitoreItemRepository;
import com.sistemi_inf.AgriTech.repository.OrdineFornitoreRepository;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import org.springframework.stereotype.Service;

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

    public OrdineFornitore create(OrdineFornitore ordine, List<OrdineFornitoreItem> items) {
        OrdineFornitore saved = ordineFornitoreRepository.save(ordine);
        for (OrdineFornitoreItem it : items) {
            it.setOrdineFornitore(saved);
            itemRepository.save(it);
            // quando ordine fornitore è evaso, in futuro incrementeremo stock del prodotto
        }
        return saved;
    }
}
