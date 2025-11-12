package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DipendentiService {
    private final DipendenteRepository dipendenteRepository;
    private final TurnoDipendenteRepository turnoRepository;
    private final FeriePermessoRepository ferieRepository;

    public DipendentiService(DipendenteRepository dipendenteRepository,
                             TurnoDipendenteRepository turnoRepository,
                             FeriePermessoRepository ferieRepository) {
        this.dipendenteRepository = dipendenteRepository;
        this.turnoRepository = turnoRepository;
        this.ferieRepository = ferieRepository;
    }

    // Anagrafica
    public List<Dipendente> listDipendenti() { return dipendenteRepository.findAll(); }
    public Dipendente saveDipendente(Dipendente d) { return dipendenteRepository.save(d); }
    public Dipendente updateDipendente(String cf, Dipendente payload) {
        Dipendente d = dipendenteRepository.findById(cf)
                .orElseThrow(() -> new IllegalArgumentException("Dipendente non trovato"));
        if (payload.getNome() != null) d.setNome(payload.getNome());
        if (payload.getCognome() != null) d.setCognome(payload.getCognome());
        if (payload.getMansione() != null) d.setMansione(payload.getMansione());
        if (payload.getTelefono() != null) d.setTelefono(payload.getTelefono());
        if (payload.getIban() != null) d.setIban(payload.getIban());
        return dipendenteRepository.save(d);
    }
    public void deleteDipendente(String cf) { dipendenteRepository.deleteById(cf); }

    // Turni
    public List<TurnoDipendente> listTurni() { return turnoRepository.findAll(); }
    public Optional<TurnoDipendente> getTurno(String cf) { return turnoRepository.findById(cf); }
    public TurnoDipendente updateTurno(String cf, List<String> giorni, String orario) {
        TurnoDipendente t = turnoRepository.findById(cf).orElseGet(() -> {
            TurnoDipendente nt = new TurnoDipendente();
            nt.setDipendenteCf(cf);
            return nt;
        });
        if (giorni != null) t.setGiorni(giorni);
        if (orario != null) t.setOrario(orario);
        return turnoRepository.save(t);
    }

    // Ferie/Permessi
    public List<FeriePermesso> listFeriePermessi() { return ferieRepository.findAll(); }
    public List<FeriePermesso> listFeriePermessiByCf(String cf) { return ferieRepository.findByDipendenteCf(cf); }

    @Transactional
    public void setFerieStato(String cf, List<String> giorni, StatoRichiesta stato) {
        List<FeriePermesso> items = ferieRepository.findByDipendenteCf(cf);
        for (FeriePermesso fp : items) {
            if (sameDays(fp.getGiorniLavorativi(), giorni)) {
                fp.setStato(stato);
                ferieRepository.save(fp);
            }
        }
    }

    private boolean sameDays(List<String> a, List<String> b) {
        if (a == null || b == null) return false;
        if (a.size() != b.size()) return false;
        return new HashSet<>(a).equals(new HashSet<>(b));
    }
}

