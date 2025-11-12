package com.sistemi_inf.AgriTech.repository;

import com.sistemi_inf.AgriTech.model.Preventivo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreventivoRepository extends JpaRepository<Preventivo, Long> {
    List<Preventivo> findByCliente_Id(Long clienteId);
}

