package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ricambi")
public class Ricambio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descrizione;

    @Column(unique = true)
    private String codice;

    @Column(nullable = false)
    private Integer quantita = 0;

    @Column(nullable = false)
    private BigDecimal prezzo = BigDecimal.ZERO;

    private Integer scortaMinima = 0;

    private java.time.LocalDate ultimaApprovvigionamento;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescrizione() { return descrizione; }
    public void setDescrizione(String descrizione) { this.descrizione = descrizione; }
    public String getCodice() { return codice; }
    public void setCodice(String codice) { this.codice = codice; }
    public Integer getQuantita() { return quantita; }
    public void setQuantita(Integer quantita) { this.quantita = quantita; }
    public BigDecimal getPrezzo() { return prezzo; }
    public void setPrezzo(BigDecimal prezzo) { this.prezzo = prezzo; }
    public Integer getScortaMinima() { return scortaMinima; }
    public void setScortaMinima(Integer scortaMinima) { this.scortaMinima = scortaMinima; }
    public java.time.LocalDate getUltimaApprovvigionamento() { return ultimaApprovvigionamento; }
    public void setUltimaApprovvigionamento(java.time.LocalDate ultimaApprovvigionamento) { this.ultimaApprovvigionamento = ultimaApprovvigionamento; }
}
