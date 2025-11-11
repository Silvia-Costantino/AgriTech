// src/main/java/com/sistemi_inf/AgriTech/service/ProdottoService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.Prodotto;
import com.sistemi_inf.AgriTech.repository.ProdottoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdottoService {

    private final ProdottoRepository prodottoRepository;

    public ProdottoService(ProdottoRepository prodottoRepository) {
        this.prodottoRepository = prodottoRepository;
    }

    public Prodotto save(Prodotto p) {
        return prodottoRepository.save(p);
    }

    public List<Prodotto> findAll() { return prodottoRepository.findAll(); }

    public Optional<Prodotto> findById(Long id) { return prodottoRepository.findById(id); }

    public List<Prodotto> findByMarca(String marca) { return prodottoRepository.findByMarcaContainingIgnoreCase(marca); }
}
