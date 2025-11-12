package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "preventivi")
public class Preventivo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Utente cliente;

    private String modello; // descrizione/modello
    private BigDecimal prezzo; // prezzo base
    private BigDecimal sconto; // importo sconto
    private LocalDate validita; // data di scadenza validità

    @Enumerated(EnumType.STRING)
    private StatoPreventivo stato = StatoPreventivo.APERTO;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Utente getCliente() { return cliente; }
    public void setCliente(Utente cliente) { this.cliente = cliente; }
    public String getModello() { return modello; }
    public void setModello(String modello) { this.modello = modello; }
    public BigDecimal getPrezzo() { return prezzo; }
    public void setPrezzo(BigDecimal prezzo) { this.prezzo = prezzo; }
    public BigDecimal getSconto() { return sconto; }
    public void setSconto(BigDecimal sconto) { this.sconto = sconto; }
    public LocalDate getValidita() { return validita; }
    public void setValidita(LocalDate validita) { this.validita = validita; }
    public StatoPreventivo getStato() { return stato; }
    public void setStato(StatoPreventivo stato) { this.stato = stato; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

