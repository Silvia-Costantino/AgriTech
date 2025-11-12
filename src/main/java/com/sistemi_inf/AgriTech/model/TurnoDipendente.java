package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "turni_dipendenti")
public class TurnoDipendente {
    @Id
    private String dipendenteCf;

    @ElementCollection
    private List<String> giorni = new ArrayList<>();

    private String orario;

    public String getDipendenteCf() { return dipendenteCf; }
    public void setDipendenteCf(String dipendenteCf) { this.dipendenteCf = dipendenteCf; }
    public List<String> getGiorni() { return giorni; }
    public void setGiorni(List<String> giorni) { this.giorni = giorni; }
    public String getOrario() { return orario; }
    public void setOrario(String orario) { this.orario = orario; }
}

