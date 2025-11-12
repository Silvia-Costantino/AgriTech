// src/main/java/com/sistemi_inf/AgriTech/repository/CarrelloRepository.java
package com.sistemi_inf.AgriTech.repository;

import com.sistemi_inf.AgriTech.model.Carrello;
import com.sistemi_inf.AgriTech.model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarrelloRepository extends JpaRepository<Carrello, Long> {
    Optional<Carrello> findByCliente(Utente cliente);
}
