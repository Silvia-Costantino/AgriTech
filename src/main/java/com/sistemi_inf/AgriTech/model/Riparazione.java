package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "riparazioni")
public class Riparazione {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String targa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatoRiparazione stato = StatoRiparazione.ATTESA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgenza urgenza = Urgenza.MEDIA;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTarga() { return targa; }
    public void setTarga(String targa) { this.targa = targa; }
    public StatoRiparazione getStato() { return stato; }
    public void setStato(StatoRiparazione stato) { this.stato = stato; }
    public Urgenza getUrgenza() { return urgenza; }
    public void setUrgenza(Urgenza urgenza) { this.urgenza = urgenza; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

