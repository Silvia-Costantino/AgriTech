// src/main/java/com/sistemi_inf/AgriTech/model/Carrello.java
package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carrelli")
public class Carrello {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "cliente_id")
    private Utente cliente;

    private LocalDateTime creatoIl = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "carrello_id")
    private List<CarrelloItem> items = new ArrayList<>();

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Utente getCliente() { return cliente; }
    public void setCliente(Utente cliente) { this.cliente = cliente; }
    public LocalDateTime getCreatoIl() { return creatoIl; }
    public void setCreatoIl(LocalDateTime creatoIl) { this.creatoIl = creatoIl; }
    public List<CarrelloItem> getItems() { return items; }
    public void setItems(List<CarrelloItem> items) { this.items = items; }
}
