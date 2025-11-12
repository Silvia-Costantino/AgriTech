package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "riparazione_ricambi")
public class RiparazioneRicambio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Riparazione riparazione;

    @ManyToOne(optional = false)
    private Ricambio ricambio;

    @Column(nullable = false)
    private Integer quantita;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Riparazione getRiparazione() { return riparazione; }
    public void setRiparazione(Riparazione riparazione) { this.riparazione = riparazione; }
    public Ricambio getRicambio() { return ricambio; }
    public void setRicambio(Ricambio ricambio) { this.ricambio = ricambio; }
    public Integer getQuantita() { return quantita; }
    public void setQuantita(Integer quantita) { this.quantita = quantita; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

