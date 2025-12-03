package com.rochatransportes.repository;

import com.rochatransportes.model.Ajudante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface AjudanteRepository extends JpaRepository<Ajudante, Long> {
    List<Ajudante> findByNomeContainingIgnoreCase(String nome);
    Page<Ajudante> findAll(Pageable pageable);
}
