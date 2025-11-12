// src/main/java/com/sistemi_inf/AgriTech/service/OrdineService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.CarrelloRepository;
import com.sistemi_inf.AgriTech.repository.OrdineRepository;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import com.sistemi_inf.AgriTech.repository.UtenteRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrdineService {

    private final OrdineRepository ordineRepository;
    private final CarrelloRepository carrelloRepository;
    private final ProdottoRepository prodottoRepository;
    private final UtenteRepository utenteRepository;

    public OrdineService(OrdineRepository ordineRepository, CarrelloRepository carrelloRepository, 
                        ProdottoRepository prodottoRepository, UtenteRepository utenteRepository) {
        this.ordineRepository = ordineRepository;
        this.carrelloRepository = carrelloRepository;
        this.prodottoRepository = prodottoRepository;
        this.utenteRepository = utenteRepository;
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
     * Ottiene tutti gli ordini (solo per SOCIO/DIPENDENTE)
     */
    public List<Ordine> getAll() {
        return ordineRepository.findAll();
    }

    /**
     * Ottiene gli ordini del cliente corrente
     */
    public List<Ordine> getByCliente() {
        Utente cliente = getCurrentUser();
        return ordineRepository.findByCliente(cliente);
    }

    /**
     * Ottiene un ordine per ID
     */
    public Ordine getById(Long id) {
        return ordineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordine non trovato"));
    }

    /**
     * Crea un ordine da carrello
     */
    @Transactional
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

    /**
     * Aggiorna lo stato di un ordine
     */
    @Transactional
    public Ordine aggiornaStato(Long id, StatoOrdine nuovoStato) {
        Ordine ordine = ordineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordine non trovato"));
        ordine.setStato(nuovoStato);
        return ordineRepository.save(ordine);
    }

    /**
     * Annulla un ordine
     */
    @Transactional
    public Ordine annulla(Long id) {
        Ordine ordine = ordineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordine non trovato"));
        
        if (ordine.getStato() == StatoOrdine.CONSEGNATO) {
            throw new RuntimeException("Non è possibile annullare un ordine già consegnato");
        }
        
        // Ripristina lo stock dei prodotti
        for (OrdineItem item : ordine.getItems()) {
            Prodotto p = item.getProdotto();
            p.setQuantitaDisponibile(p.getQuantitaDisponibile() + item.getQuantita());
            prodottoRepository.save(p);
        }
        
        ordine.setStato(StatoOrdine.ANNULLATO);
        return ordineRepository.save(ordine);
    }

    /**
     * Conferma spedizione (per dipendenti)
     */
    @Transactional
    public Ordine confermaSpedizione(Long id) {
        Ordine ordine = ordineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordine non trovato"));
        
        if (ordine.getStato() != StatoOrdine.PRONTO_CONSEGNA) {
            throw new RuntimeException("L'ordine deve essere in stato PRONTO_CONSEGNA per confermare la spedizione");
        }
        
        ordine.setStato(StatoOrdine.CONSEGNATO);
        return ordineRepository.save(ordine);
    }
}
