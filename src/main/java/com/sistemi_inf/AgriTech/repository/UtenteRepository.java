// src/main/java/com/sistemi_inf/AgriTech/repository/UtenteRepository.java
package com.sistemi_inf.AgriTech.repository;

import com.sistemi_inf.AgriTech.model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtenteRepository extends JpaRepository<Utente, Long> {
    Optional<Utente> findByEmail(String email);
}
