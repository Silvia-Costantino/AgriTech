package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Carrello {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Utente utente;

    @OneToMany(mappedBy = "carrello", cascade = CascadeType.ALL)
    private List<CarrelloProdotto> prodotti;

    // Getters e Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Utente getUtente() {
        return utente;
    }
    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public List<CarrelloProdotto> getProdotti() {
        return prodotti;
    }
    public void setProdotti(List<CarrelloProdotto> prodotti) {
        this.prodotti = prodotti;
    }
}

