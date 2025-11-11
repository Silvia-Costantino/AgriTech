// src/main/java/com/sistemi_inf/AgriTech/service/OrdineService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.CarrelloRepository;
import com.sistemi_inf.AgriTech.repository.OrdineRepository;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class OrdineService {

    private final OrdineRepository ordineRepository;
    private final CarrelloRepository carrelloRepository;
    private final ProdottoRepository prodottoRepository;

    public OrdineService(OrdineRepository ordineRepository, CarrelloRepository carrelloRepository, ProdottoRepository prodottoRepository) {
        this.ordineRepository = ordineRepository;
        this.carrelloRepository = carrelloRepository;
        this.prodottoRepository = prodottoRepository;
    }

    public Ordine creaOrdineDaCarrello(Long carrelloId) {
        Carrello c = carrelloRepository.findById(carrelloId).orElseThrow(() -> new RuntimeException("Carrello non trovato"));
        Ordine ordine = new Ordine();
        ordine.setCliente(c.getCliente());
        BigDecimal totale = BigDecimal.ZERO;
        for (CarrelloItem ci : c.getItems()) {
            if (ci.getProdotto().getQuantitaDisponibile() < ci.getQuantita()) {
                throw new RuntimeException("Stock insufficiente per prodotto: " + ci.getProdotto().getNome());
            }
            OrdineItem oi = new OrdineItem();
            oi.setProdotto(ci.getProdotto());
            oi.setQuantita(ci.getQuantita());
            oi.setPrezzoUnitario(ci.getProdotto().getPrezzo());
            ordine.getItems().add(oi);
            totale = totale.add(ci.getProdotto().getPrezzo().multiply(BigDecimal.valueOf(ci.getQuantita())));
            // decrement stock
            Prodotto p = ci.getProdotto();
            p.setQuantitaDisponibile(Math.max(0, p.getQuantitaDisponibile() - ci.getQuantita()));
            prodottoRepository.save(p);
        }
        ordine.setTotale(totale);
        Ordine saved = ordineRepository.save(ordine);
        // clear carrello
        c.getItems().clear();
        carrelloRepository.save(c);
        return saved;
    }
}
