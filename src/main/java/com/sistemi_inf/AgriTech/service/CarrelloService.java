package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.CarrelloRepository;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import com.sistemi_inf.AgriTech.repository.UtenteRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * Ottiene l'utente corrente dal contesto di sicurezza
     */
    private Utente getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Utente non autenticato");
        }
        String email = auth.getName();
        return utenteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
    }

    /**
     * Ottiene o crea il carrello per l'utente corrente
     */
    @Transactional
    public Carrello getOrCreateCarrello() {
        Utente cliente = getCurrentUser();
        Optional<Carrello> existing = carrelloRepository.findByCliente(cliente);
        if (existing.isPresent()) {
            return existing.get();
        }
        Carrello c = new Carrello();
        c.setCliente(cliente);
        return carrelloRepository.save(c);
    }

    /**
     * Aggiunge un prodotto al carrello. Se già presente, incrementa la quantità
     */
    @Transactional
    public Carrello addItem(Long prodottoId, Integer quantita) {
        Carrello c = getOrCreateCarrello();
        Prodotto p = prodottoRepository.findById(prodottoId)
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato"));
        
        int qty = quantita == null ? 1 : quantita;
        
        // Verifica se il prodotto è già nel carrello
        Optional<CarrelloItem> existingItem = c.getItems().stream()
                .filter(item -> item.getProdotto().getId().equals(prodottoId))
                .findFirst();
        
        if (existingItem.isPresent()) {
            // Incrementa la quantità
            CarrelloItem item = existingItem.get();
            int nuovaQuantita = item.getQuantita() + qty;
            if (p.getQuantitaDisponibile() < nuovaQuantita) {
                throw new RuntimeException("Quantità non disponibile. Disponibili: " + p.getQuantitaDisponibile());
            }
            item.setQuantita(nuovaQuantita);
        } else {
            // Aggiunge nuovo item
            if (p.getQuantitaDisponibile() < qty) {
                throw new RuntimeException("Quantità non disponibile. Disponibili: " + p.getQuantitaDisponibile());
            }
            CarrelloItem item = new CarrelloItem();
            item.setProdotto(p);
            item.setQuantita(qty);
            c.getItems().add(item);
        }
        
        return carrelloRepository.save(c);
    }

    /**
     * Aggiorna la quantità di un prodotto nel carrello
     */
    @Transactional
    public Carrello updateQuantita(Long prodottoId, Integer nuovaQuantita) {
        Carrello c = getOrCreateCarrello();
        Prodotto p = prodottoRepository.findById(prodottoId)
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato"));
        
        if (nuovaQuantita <= 0) {
            throw new RuntimeException("La quantità deve essere maggiore di 0");
        }
        
        if (p.getQuantitaDisponibile() < nuovaQuantita) {
            throw new RuntimeException("Quantità non disponibile. Disponibili: " + p.getQuantitaDisponibile());
        }
        
        CarrelloItem item = c.getItems().stream()
                .filter(i -> i.getProdotto().getId().equals(prodottoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato nel carrello"));
        
        item.setQuantita(nuovaQuantita);
        return carrelloRepository.save(c);
    }

    /**
     * Rimuove un prodotto dal carrello
     */
    @Transactional
    public Carrello rimuoviItem(Long prodottoId) {
        Carrello c = getOrCreateCarrello();
        boolean removed = c.getItems().removeIf(item -> item.getProdotto().getId().equals(prodottoId));
        if (!removed) {
            throw new RuntimeException("Prodotto non trovato nel carrello");
        }
        return carrelloRepository.save(c);
    }

    /**
     * Svuota completamente il carrello
     */
    @Transactional
    public Carrello svuotaCarrello() {
        Carrello c = getOrCreateCarrello();
        c.getItems().clear();
        return carrelloRepository.save(c);
    }

    // Metodi legacy per retrocompatibilità
    public Carrello getOrCreateByClienteId(Long clienteId) {
        Optional<Utente> u = utenteRepository.findById(clienteId);
        if (u.isEmpty()) throw new RuntimeException("Cliente non trovato");
        Optional<Carrello> existing = carrelloRepository.findByCliente(u.get());
        if (existing.isPresent()) {
            return existing.get();
        }
        Carrello c = new Carrello();
        c.setCliente(u.get());
        return carrelloRepository.save(c);
    }
}
