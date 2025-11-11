// src/main/java/com/sistemi_inf/AgriTech/model/OrdineFornitore.java
package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ordini_fornitore")
public class OrdineFornitore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Fornitore fornitore;

    private LocalDate dataOrdine = LocalDate.now();

    @Enumerated(EnumType.STRING)
    private StatoOrdineFornitore stato = StatoOrdineFornitore.IN_ATTESA;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Fornitore getFornitore() { return fornitore; }
    public void setFornitore(Fornitore fornitore) { this.fornitore = fornitore; }
    public LocalDate getDataOrdine() { return dataOrdine; }
    public void setDataOrdine(LocalDate dataOrdine) { this.dataOrdine = dataOrdine; }
    public StatoOrdineFornitore getStato() { return stato; }
    public void setStato(StatoOrdineFornitore stato) { this.stato = stato; }
}
