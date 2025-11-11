// src/main/java/com/sistemi_inf/AgriTech/repository/OrdineRepository.java
package com.sistemi_inf.AgriTech.repository;

import com.sistemi_inf.AgriTech.model.Ordine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdineRepository extends JpaRepository<Ordine, Long> {
}
