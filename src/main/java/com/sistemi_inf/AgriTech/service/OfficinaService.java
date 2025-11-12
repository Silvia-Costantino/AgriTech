package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OfficinaService {
    private final RiparazioneRepository riparazioneRepository;
    private final RicambioRepository ricambioRepository;
    private final RiparazioneRicambioRepository riparazioneRicambioRepository;
    private final ReportManutenzioneRepository reportRepository;

    public OfficinaService(RiparazioneRepository riparazioneRepository,
                           RicambioRepository ricambioRepository,
                           RiparazioneRicambioRepository riparazioneRicambioRepository,
                           ReportManutenzioneRepository reportRepository) {
        this.riparazioneRepository = riparazioneRepository;
        this.ricambioRepository = ricambioRepository;
        this.riparazioneRicambioRepository = riparazioneRicambioRepository;
        this.reportRepository = reportRepository;
    }

    // RIPARAZIONI
    public List<Riparazione> listRiparazioni() { return riparazioneRepository.findAll(); }

    public Riparazione createRiparazione(String targa, StatoRiparazione stato, Urgenza urgenza) {
        Riparazione r = new Riparazione();
        r.setTarga(targa);
        if (stato != null) r.setStato(stato);
        if (urgenza != null) r.setUrgenza(urgenza);
        return riparazioneRepository.save(r);
    }

    public Riparazione updateRiparazione(Long id, StatoRiparazione stato, Urgenza urgenza) {
        Riparazione r = riparazioneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Riparazione non trovata"));
        if (stato != null) r.setStato(stato);
        if (urgenza != null) r.setUrgenza(urgenza);
        return riparazioneRepository.save(r);
    }

    @Transactional
    public RiparazioneRicambio richiestaRicambio(Long riparazioneId, Long ricambioId, Integer quantita) {
        Riparazione rip = riparazioneRepository.findById(riparazioneId)
                .orElseThrow(() -> new IllegalArgumentException("Riparazione non trovata"));
        Ricambio ric = ricambioRepository.findById(ricambioId)
                .orElseThrow(() -> new IllegalArgumentException("Ricambio non trovato"));
        if (quantita == null || quantita <= 0) throw new IllegalArgumentException("Quantità non valida");
        if (ric.getQuantita() < quantita) throw new IllegalArgumentException("Ricambio non disponibile a magazzino");

        // scarica magazzino
        ric.setQuantita(ric.getQuantita() - quantita);
        ricambioRepository.save(ric);

        RiparazioneRicambio rr = new RiparazioneRicambio();
        rr.setRiparazione(rip);
        rr.setRicambio(ric);
        rr.setQuantita(quantita);
        return riparazioneRicambioRepository.save(rr);
    }

    @Transactional
    public ReportManutenzione completaRiparazione(Long riparazioneId, String note) {
        Riparazione rip = riparazioneRepository.findById(riparazioneId)
                .orElseThrow(() -> new IllegalArgumentException("Riparazione non trovata"));
        rip.setStato(StatoRiparazione.COMPLETATA);
        riparazioneRepository.save(rip);

        ReportManutenzione report = new ReportManutenzione();
        report.setRiparazione(rip);
        report.setNote(note);
        return reportRepository.save(report);
    }

    // RICAMBI
    public List<Ricambio> listRicambi() { return ricambioRepository.findAll(); }
    public Ricambio createRicambio(Ricambio r) { return ricambioRepository.save(r); }
    public Ricambio updateRicambio(Long id, Ricambio payload) {
        Ricambio r = ricambioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ricambio non trovato"));
        if (payload.getDescrizione() != null) r.setDescrizione(payload.getDescrizione());
        if (payload.getCodice() != null) r.setCodice(payload.getCodice());
        if (payload.getPrezzo() != null) r.setPrezzo(payload.getPrezzo());
        if (payload.getQuantita() != null) r.setQuantita(payload.getQuantita());
        if (payload.getScortaMinima() != null) r.setScortaMinima(payload.getScortaMinima());
        if (payload.getUltimaApprovvigionamento() != null) r.setUltimaApprovvigionamento(payload.getUltimaApprovvigionamento());
        return ricambioRepository.save(r);
    }
}
