package com.sistemi_inf.AgriTech.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "prodotti")
public class Prodotto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descrizione;
    private String marca;
    private String modello;

    @Column(nullable = false)
    private BigDecimal prezzo;

    private Integer quantitaDisponibile = 0;

    private Integer stockMinimo = 0;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescrizione() { return descrizione; }
    public void setDescrizione(String descrizione) { this.descrizione = descrizione; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getModello() { return modello; }
    public void setModello(String modello) { this.modello = modello; }
    public BigDecimal getPrezzo() { return prezzo; }
    public void setPrezzo(BigDecimal prezzo) { this.prezzo = prezzo; }
    public Integer getQuantitaDisponibile() { return quantitaDisponibile; }
    public void setQuantitaDisponibile(Integer quantitaDisponibile) { this.quantitaDisponibile = quantitaDisponibile; }
    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }
}
