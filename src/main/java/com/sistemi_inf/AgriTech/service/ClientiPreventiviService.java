package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.PreventivoRepository;
import com.sistemi_inf.AgriTech.repository.UtenteRepository;
import com.sistemi_inf.AgriTech.repository.OrdineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ClientiPreventiviService {
    private final UtenteRepository utenteRepository;
    private final PreventivoRepository preventivoRepository;
    private final OrdineRepository ordineRepository;

    public ClientiPreventiviService(UtenteRepository utenteRepository,
                                    PreventivoRepository preventivoRepository,
                                    OrdineRepository ordineRepository) {
        this.utenteRepository = utenteRepository;
        this.preventivoRepository = preventivoRepository;
        this.ordineRepository = ordineRepository;
    }

    // CLIENTI
    public List<Utente> listClienti(String q) {
        List<Utente> all = utenteRepository.findAll().stream()
                .filter(u -> u.getRuolo() == Ruolo.CLIENTE)
                .toList();
        if (q == null || q.isBlank()) return all;
        String qq = q.toLowerCase();
        return all.stream().filter(u ->
                (u.getNome()!=null && u.getNome().toLowerCase().contains(qq)) ||
                (u.getCognome()!=null && u.getCognome().toLowerCase().contains(qq)) ||
                (u.getEmail()!=null && u.getEmail().toLowerCase().contains(qq))
        ).toList();
    }

    public Utente updateCliente(Long id, Utente payload) {
        Utente u = utenteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cliente non trovato"));
        if (payload.getNome()!=null) u.setNome(payload.getNome());
        if (payload.getCognome()!=null) u.setCognome(payload.getCognome());
        if (payload.getTelefono()!=null) u.setTelefono(payload.getTelefono());
        if (payload.getIndirizzo()!=null) u.setIndirizzo(payload.getIndirizzo());
        // email modificabile con cautela (mantiene unique)
        if (payload.getEmail()!=null) u.setEmail(payload.getEmail());
        return utenteRepository.save(u);
    }

    public void deleteCliente(Long id) { utenteRepository.deleteById(id); }

    // PREVENTIVI
    public List<Preventivo> listPreventivi() { return preventivoRepository.findAll(); }
    public List<Preventivo> listPreventiviByCliente(Long clienteId) { return preventivoRepository.findByCliente_Id(clienteId); }

    public Preventivo creaPreventivo(Long clienteId, String modello, BigDecimal prezzo, BigDecimal sconto, LocalDate validita) {
        Utente cliente = utenteRepository.findById(clienteId).orElseThrow(() -> new IllegalArgumentException("Cliente non trovato"));
        Preventivo p = new Preventivo();
        p.setCliente(cliente);
        p.setModello(modello);
        p.setPrezzo(prezzo);
        p.setSconto(sconto!=null?sconto:BigDecimal.ZERO);
        p.setValidita(validita);
        p.setStato(StatoPreventivo.APERTO);
        return preventivoRepository.save(p);
    }

    public Preventivo setStato(Long id, StatoPreventivo stato) {
        Preventivo p = preventivoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Preventivo non trovato"));
        p.setStato(stato);
        return preventivoRepository.save(p);
    }

    @Transactional
    public Ordine convertiInOrdine(Long preventivoId) {
        Preventivo p = preventivoRepository.findById(preventivoId).orElseThrow(() -> new IllegalArgumentException("Preventivo non trovato"));
        if (p.getStato() == StatoPreventivo.RIFIUTATO) throw new IllegalStateException("Impossibile convertire un preventivo rifiutato");
        BigDecimal totale = (p.getPrezzo()!=null?p.getPrezzo():BigDecimal.ZERO).subtract(p.getSconto()!=null?p.getSconto():BigDecimal.ZERO);
        if (totale.compareTo(BigDecimal.ZERO) < 0) totale = BigDecimal.ZERO;

        Ordine o = new Ordine();
        o.setCliente(p.getCliente());
        o.setTotale(totale);
        // nessun item specifico: ordine sintetico da preventivo
        Ordine saved = ordineRepository.save(o);
        p.setStato(StatoPreventivo.CONVERTITO);
        preventivoRepository.save(p);
        return saved;
    }
}
