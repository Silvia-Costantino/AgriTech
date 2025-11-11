// src/main/java/com/sistemi_inf/AgriTech/model/CarrelloItem.java
package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "carrello_items")
public class CarrelloItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prodotto_id")
    private Prodotto prodotto;

    private Integer quantita = 1;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Prodotto getProdotto() { return prodotto; }
    public void setProdotto(Prodotto prodotto) { this.prodotto = prodotto; }
    public Integer getQuantita() { return quantita; }
    public void setQuantita(Integer quantita) { this.quantita = quantita; }
}
