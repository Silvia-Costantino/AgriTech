// src/main/java/com/sistemi_inf/AgriTech/model/Ordine.java
package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordini")
public class Ordine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Utente cliente;

    private LocalDateTime dataOrdine = LocalDateTime.now();

    private BigDecimal totale = BigDecimal.ZERO;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "ordine_id")
    private List<OrdineItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private StatoOrdine stato = StatoOrdine.IN_ELABORAZIONE;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Utente getCliente() { return cliente; }
    public void setCliente(Utente cliente) { this.cliente = cliente; }
    public LocalDateTime getDataOrdine() { return dataOrdine; }
    public void setDataOrdine(LocalDateTime dataOrdine) { this.dataOrdine = dataOrdine; }
    public BigDecimal getTotale() { return totale; }
    public void setTotale(BigDecimal totale) { this.totale = totale; }
    public List<OrdineItem> getItems() { return items; }
    public void setItems(List<OrdineItem> items) { this.items = items; }
    public StatoOrdine getStato() { return stato; }
    public void setStato(StatoOrdine stato) { this.stato = stato; }
}
