// src/main/java/com/sistemi_inf/AgriTech/repository/ProdottoRepository.java
package com.sistemi_inf.AgriTech.repository;

import com.sistemi_inf.AgriTech.model.Prodotto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProdottoRepository extends JpaRepository<Prodotto, Long> {
    List<Prodotto> findByMarcaContainingIgnoreCase(String marca);
}
