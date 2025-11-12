// src/main/java/com/sistemi_inf/AgriTech/service/ProdottoService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.Prodotto;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
