// src/main/java/com/sistemi_inf/AgriTech/repository/OrdineRepository.java
package com.sistemi_inf.AgriTech.repository;

import com.sistemi_inf.AgriTech.model.Ordine;
import com.sistemi_inf.AgriTech.model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdineRepository extends JpaRepository<Ordine, Long> {
    List<Ordine> findByCliente(Utente cliente);
}
