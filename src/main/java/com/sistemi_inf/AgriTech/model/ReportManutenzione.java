package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_manutenzioni")
public class ReportManutenzione {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Riparazione riparazione;

    @Column(nullable = false)
    private LocalDateTime data = LocalDateTime.now();

    @Column(length = 2000)
    private String note;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Riparazione getRiparazione() { return riparazione; }
    public void setRiparazione(Riparazione riparazione) { this.riparazione = riparazione; }
    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}

