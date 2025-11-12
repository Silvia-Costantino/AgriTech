package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ferie_permessi")
public class FeriePermesso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String dipendenteCf;

    private Integer durata; // giorni

    @ElementCollection
    private List<String> giorniLavorativi = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private StatoRichiesta stato = StatoRichiesta.IN_ATTESA;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDipendenteCf() { return dipendenteCf; }
    public void setDipendenteCf(String dipendenteCf) { this.dipendenteCf = dipendenteCf; }
    public Integer getDurata() { return durata; }
    public void setDurata(Integer durata) { this.durata = durata; }
    public List<String> getGiorniLavorativi() { return giorniLavorativi; }
    public void setGiorniLavorativi(List<String> giorniLavorativi) { this.giorniLavorativi = giorniLavorativi; }
    public StatoRichiesta getStato() { return stato; }
    public void setStato(StatoRichiesta stato) { this.stato = stato; }
}

