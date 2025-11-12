// src/main/java/com/sistemi_inf/AgriTech/service/ProdottoService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.Prodotto;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdottoService {

    private final ProdottoRepository prodottoRepository;

    public ProdottoService(ProdottoRepository prodottoRepository) {
        this.prodottoRepository = prodottoRepository;
    }

    public List<Prodotto> getAll() {
        return prodottoRepository.findAll();
    }

    public List<Prodotto> searchByMarca(String marca) {
        return prodottoRepository.findByMarcaContainingIgnoreCase(marca);
    }

    /**
     * Filtra prodotti per range di prezzo
     */
    public List<Prodotto> filterByPrezzo(BigDecimal prezzoMin, BigDecimal prezzoMax) {
        if (prezzoMin == null && prezzoMax == null) {
            return prodottoRepository.findAll();
        }
        if (prezzoMin == null) {
            prezzoMin = BigDecimal.ZERO;
        }
        if (prezzoMax == null) {
            prezzoMax = BigDecimal.valueOf(Long.MAX_VALUE);
        }
        return prodottoRepository.findByPrezzoBetween(prezzoMin, prezzoMax);
    }

    /**
     * Filtra prodotti per quantità disponibile
     */
    public List<Prodotto> filterByQuantita(Integer quantitaMin, Integer quantitaMax) {
        if (quantitaMin == null && quantitaMax == null) {
            return prodottoRepository.findAll();
        }
        if (quantitaMin == null) {
            quantitaMin = 0;
        }
        if (quantitaMax == null) {
            return prodottoRepository.findByQuantitaDisponibileGreaterThanEqual(quantitaMin);
        }
        return prodottoRepository.findByQuantitaDisponibileBetween(quantitaMin, quantitaMax);
    }

    /**
     * Filtra prodotti con più criteri combinati
     */
    public List<Prodotto> filterAdvanced(String marca, BigDecimal prezzoMin, BigDecimal prezzoMax, 
                                         Integer quantitaMin, Integer quantitaMax) {
        List<Prodotto> risultati = prodottoRepository.findAll();

        if (marca != null && !marca.trim().isEmpty()) {
            risultati = risultati.stream()
                    .filter(p -> p.getMarca() != null && 
                            p.getMarca().toLowerCase().contains(marca.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (prezzoMin != null || prezzoMax != null) {
            BigDecimal min = prezzoMin != null ? prezzoMin : BigDecimal.ZERO;
            BigDecimal max = prezzoMax != null ? prezzoMax : BigDecimal.valueOf(Long.MAX_VALUE);
            risultati = risultati.stream()
                    .filter(p -> p.getPrezzo() != null && 
                            p.getPrezzo().compareTo(min) >= 0 && 
                            p.getPrezzo().compareTo(max) <= 0)
                    .collect(Collectors.toList());
        }

        if (quantitaMin != null || quantitaMax != null) {
            int min = quantitaMin != null ? quantitaMin : 0;
            int max = quantitaMax != null ? quantitaMax : Integer.MAX_VALUE;
            risultati = risultati.stream()
                    .filter(p -> p.getQuantitaDisponibile() != null && 
                            p.getQuantitaDisponibile() >= min && 
                            p.getQuantitaDisponibile() <= max)
                    .collect(Collectors.toList());
        }

        return risultati;
    }

    public Prodotto save(Prodotto p) {
        return prodottoRepository.save(p);
    }

    public Prodotto update(Long id, Prodotto nuovo) {
        return prodottoRepository.findById(id).map(prod -> {
            prod.setNome(nuovo.getNome());
            prod.setDescrizione(nuovo.getDescrizione());
            prod.setMarca(nuovo.getMarca());
            prod.setModello(nuovo.getModello());
            prod.setPrezzo(nuovo.getPrezzo());
            prod.setQuantitaDisponibile(nuovo.getQuantitaDisponibile());
            prod.setStockMinimo(nuovo.getStockMinimo());
            return prodottoRepository.save(prod);
        }).orElseThrow(() -> new RuntimeException("Prodotto non trovato"));
    }

    public void delete(Long id) {
        prodottoRepository.deleteById(id);
    }
}
