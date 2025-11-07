package com.sistemi_inf.AgriTech.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordini")
public class Ordine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataCreazione = LocalDateTime.now();

    private Double totale = 0.0;

    @Enumerated(EnumType.STRING)
    private StatoOrdine stato = StatoOrdine.IN_ATTESA;

    private String indirizzoSpedizione;
    private String metodoPagamento;
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    @JsonIgnore // evita serializzazione circolare
    private Utente utente;

    @OneToMany(mappedBy = "ordine", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrdineProdotto> prodotti = new ArrayList<>();

    public Ordine() {}

    // Aggiunge un prodotto e aggiorna automaticamente il totale
    public void addProdotto(OrdineProdotto ordineProdotto) {
        prodotti.add(ordineProdotto);
        ordineProdotto.setOrdine(this);
        // Aggiorna il totale con il prezzo corretto del prodotto
        if (ordineProdotto.getPrezzo() != null && ordineProdotto.getQuantita() > 0) {
            this.totale += ordineProdotto.getPrezzo() * ordineProdotto.getQuantita();
        }
    }

    public void removeProdotto(OrdineProdotto ordineProdotto) {
        if (prodotti.remove(ordineProdotto)) {
            ordineProdotto.setOrdine(null);
            if (ordineProdotto.getPrezzo() != null && ordineProdotto.getQuantita() > 0) {
                this.totale -= ordineProdotto.getPrezzo() * ordineProdotto.getQuantita();
            }
        }
    }

    // === GETTER E SETTER ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataCreazione() { return dataCreazione; }
    public void setDataCreazione(LocalDateTime dataCreazione) { this.dataCreazione = dataCreazione; }

    public Double getTotale() { return totale; }
    public void setTotale(Double totale) { this.totale = totale; }

    public StatoOrdine getStato() { return stato; }
    public void setStato(StatoOrdine stato) { this.stato = stato; }

    public String getIndirizzoSpedizione() { return indirizzoSpedizione; }
    public void setIndirizzoSpedizione(String indirizzoSpedizione) { this.indirizzoSpedizione = indirizzoSpedizione; }

    public String getMetodoPagamento() { return metodoPagamento; }
    public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Utente getUtente() { return utente; }
    public void setUtente(Utente utente) { this.utente = utente; }

    public List<OrdineProdotto> getProdotti() { return prodotti; }

    public void setProdotti(List<OrdineProdotto> prodotti) {
        this.prodotti.clear();
        if (prodotti != null) {
            for (OrdineProdotto op : prodotti) {
                addProdotto(op);
            }
        }
    }
}
