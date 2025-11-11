// src/main/java/com/sistemi_inf/AgriTech/model/Fornitore.java
package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fornitori")
public class Fornitore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String partitaIva;
    private String email;
    private String telefono;
    private String indirizzo;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getPartitaIva() { return partitaIva; }
    public void setPartitaIva(String partitaIva) { this.partitaIva = partitaIva; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getIndirizzo() { return indirizzo; }
    public void setIndirizzo(String indirizzo) { this.indirizzo = indirizzo; }
}
