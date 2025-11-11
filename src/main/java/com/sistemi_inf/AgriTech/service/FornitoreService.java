// src/main/java/com/sistemi_inf/AgriTech/service/FornitoreService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.Fornitore;
import com.sistemi_inf.AgriTech.repository.FornitoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FornitoreService {

    private final FornitoreRepository fornitoreRepository;

    public FornitoreService(FornitoreRepository fornitoreRepository) {
        this.fornitoreRepository = fornitoreRepository;
    }

    public Fornitore save(Fornitore f) { return fornitoreRepository.save(f); }
    public List<Fornitore> findAll() { return fornitoreRepository.findAll(); }
    public Optional<Fornitore> findById(Long id) { return fornitoreRepository.findById(id); }
}
