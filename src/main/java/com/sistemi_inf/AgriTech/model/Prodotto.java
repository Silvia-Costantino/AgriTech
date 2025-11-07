//package com.ecommerce.cartoleria.model;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.*;
//
//@Entity
//public class Prodotto {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String nome; // Es: Matita 2B, Penna BIC Blu
//    private String categoria; // MATITE, PENNE o CANCELLERIA
//    private String colore;
//    private String caratteristica; // durezza per le matite, cancellabile o non per le penne
//    private double prezzo;
//    private int quantitaDisponibile;
//    private String immagine;
//
//    @Transient
//    @JsonProperty("immagineUrl")
//    public String getImmagineUrl() {
//        return "/assets/images/prodotti/" + immagine;
//    }
//    public Prodotto(String nome, String categoria, String colore, String caratteristica, double prezzo, int quantitaDisponibile, String immagine) {
//        this.nome = nome;
//        this.categoria = categoria;
//        this.colore = colore;
//        this.caratteristica = caratteristica;
//        this.prezzo = prezzo;
//        this.quantitaDisponibile = quantitaDisponibile;
//        this.immagine = immagine;
//    }
//
//    public Prodotto() { }
//
//    // Getters e Setters
//    public Long getId() {
//        return id;
//    }
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getNome() {
//        return nome;
//    }
//    public void setNome(String nome) {
//        this.nome = nome;
//    }
//
//    public String getCategoria() {
//        return categoria;
//    }
//    public void setCategoria(String categoria) {
//        this.categoria = categoria;
//    }
//
//    public String getColore() {
//        return colore;
//    }
//    public void setColore(String colore) {
//        this.colore = colore;
//    }
//
//    public String getCaratteristica() {
//        return caratteristica;
//    }
//    public void setCaratteristica(String caratteristica) {
//        this.caratteristica = caratteristica;
//    }
//
//    public double getPrezzo() {
//        return prezzo;
//    }
//    public void setPrezzo(double prezzo) {
//        this.prezzo = prezzo;
//    }
//
//    public int getQuantitaDisponibile() {
//        return quantitaDisponibile;
//    }
//    public void setQuantitaDisponibile(int quantitaDisponibile) {
//        this.quantitaDisponibile = quantitaDisponibile;
//    }
//
//    public String getImmagine() {
//        return immagine;
//    }
//    public void setImmagine(String immagine) {
//        this.immagine = immagine;
//    }
//}

package com.sistemi_inf.AgriTech.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
public class Prodotto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome; // Es: Matita 2B, Penna BIC Blu
    private String categoria; // MATITE, PENNE o CANCELLERIA
    private String colore;
    private String caratteristica; // durezza per le matite, cancellabile o non per le penne
    private double prezzo;
    private int quantitaDisponibile;
    private String immagine;

    @Transient
    @JsonProperty("immagineUrl")
    public String getImmagineUrl() {
        return "/assets/images/prodotti/" + immagine;
    }

    public Prodotto() {}

    public Prodotto(String nome, String categoria, String colore, String caratteristica, double prezzo, int quantitaDisponibile, String immagine) {
        this.nome = nome;
        this.categoria = categoria;
        this.colore = colore;
        this.caratteristica = caratteristica;
        this.prezzo = prezzo;
        this.quantitaDisponibile = quantitaDisponibile;
        this.immagine = immagine;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getColore() { return colore; }
    public void setColore(String colore) { this.colore = colore; }

    public String getCaratteristica() { return caratteristica; }
    public void setCaratteristica(String caratteristica) { this.caratteristica = caratteristica; }

    public double getPrezzo() { return prezzo; }
    public void setPrezzo(double prezzo) { this.prezzo = prezzo; }

    public int getQuantitaDisponibile() { return quantitaDisponibile; }
    public void setQuantitaDisponibile(int quantitaDisponibile) { this.quantitaDisponibile = quantitaDisponibile; }

    public String getImmagine() { return immagine; }
    public void setImmagine(String immagine) { this.immagine = immagine; }
}
