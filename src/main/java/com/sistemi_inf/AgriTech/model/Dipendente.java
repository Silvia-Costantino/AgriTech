package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dipendenti")
public class Dipendente {
    @Id
    @Column(length = 32)
    private String cf;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String cognome;

    @Column(nullable = false)
    private String mansione;

    private String telefono;
    private String iban;

    public String getCf() { return cf; }
    public void setCf(String cf) { this.cf = cf; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
    public String getMansione() { return mansione; }
    public void setMansione(String mansione) { this.mansione = mansione; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
}

