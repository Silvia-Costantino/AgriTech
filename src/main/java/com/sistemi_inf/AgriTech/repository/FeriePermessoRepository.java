package com.sistemi_inf.AgriTech.repository;

import com.sistemi_inf.AgriTech.model.FeriePermesso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeriePermessoRepository extends JpaRepository<FeriePermesso, Long> {
    List<FeriePermesso> findByDipendenteCf(String cf);
}

