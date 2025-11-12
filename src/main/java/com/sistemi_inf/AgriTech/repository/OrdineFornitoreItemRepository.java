// src/main/java/com/sistemi_inf/AgriTech/repository/OrdineFornitoreItemRepository.java
package com.sistemi_inf.AgriTech.repository;

import com.sistemi_inf.AgriTech.model.OrdineFornitore;
import com.sistemi_inf.AgriTech.model.OrdineFornitoreItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdineFornitoreItemRepository extends JpaRepository<OrdineFornitoreItem, Long> {
    List<OrdineFornitoreItem> findByOrdineFornitore(OrdineFornitore ordineFornitore);
}
