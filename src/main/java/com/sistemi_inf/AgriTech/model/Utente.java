// src/main/java/com/sistemi_inf/AgriTech/model/Utente.java
package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "utenti")
public class Utente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nome;
    private String cognome;
    private String telefono;

    // 🔹 Enum coerente con Ruolo.CLIENTE, Ruolo.DIPENDENTE, Ruolo.SOCIO
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Ruolo ruolo = Ruolo.CLIENTE;

    private LocalDateTime createdAt = LocalDateTime.now();

    // ─────────────────────────────────────────────
    // Getters & Setters
    // ─────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public Ruolo getRuolo() { return ruolo; }
    public void setRuolo(Ruolo ruolo) { this.ruolo = ruolo; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
