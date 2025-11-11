// src/main/java/com/sistemi_inf/AgriTech/service/CarrelloService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.CarrelloRepository;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import com.sistemi_inf.AgriTech.repository.UtenteRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CarrelloService {

    private final CarrelloRepository carrelloRepository;
    private final UtenteRepository utenteRepository;
    private final ProdottoRepository prodottoRepository;

    public CarrelloService(CarrelloRepository carrelloRepository, UtenteRepository utenteRepository, ProdottoRepository prodottoRepository) {
        this.carrelloRepository = carrelloRepository;
        this.utenteRepository = utenteRepository;
        this.prodottoRepository = prodottoRepository;
    }

    public Carrello getOrCreateByClienteId(Long clienteId) {
        Optional<Utente> u = utenteRepository.findById(clienteId);
        if (u.isEmpty()) throw new RuntimeException("Cliente non trovato");
        // For simplicity create a new carrello if none exists
        Carrello c = new Carrello();
        c.setCliente(u.get());
        return carrelloRepository.save(c);
    }

    public Carrello addItem(Long carrelloId, Long prodottoId, Integer quantita) {
        Carrello c = carrelloRepository.findById(carrelloId).orElseThrow(() -> new RuntimeException("Carrello non trovato"));
        Prodotto p = prodottoRepository.findById(prodottoId).orElseThrow(() -> new RuntimeException("Prodotto non trovato"));
        if (p.getQuantitaDisponibile() < (quantita == null ? 1 : quantita)) {
            throw new RuntimeException("Quantità non disponibile");
        }
        CarrelloItem item = new CarrelloItem();
        item.setProdotto(p);
        item.setQuantita(quantita == null ? 1 : quantita);
        c.getItems().add(item);
        return carrelloRepository.save(c);
    }
}
