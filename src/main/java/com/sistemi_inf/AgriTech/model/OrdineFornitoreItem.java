// src/main/java/com/sistemi_inf/AgriTech/model/OrdineFornitoreItem.java
package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ordine_fornitore_items")
public class OrdineFornitoreItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private OrdineFornitore ordineFornitore;

    @ManyToOne
    private Prodotto prodotto;

    private Integer quantita;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public OrdineFornitore getOrdineFornitore() { return ordineFornitore; }
    public void setOrdineFornitore(OrdineFornitore ordineFornitore) { this.ordineFornitore = ordineFornitore; }
    public Prodotto getProdotto() { return prodotto; }
    public void setProdotto(Prodotto prodotto) { this.prodotto = prodotto; }
    public Integer getQuantita() { return quantita; }
    public void setQuantita(Integer quantita) { this.quantita = quantita; }
}
