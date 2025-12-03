package com.rochatransportes.repository;

import com.rochatransportes.model.Agregado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface AgregadoRepository extends JpaRepository<Agregado, Long> {
    List<Agregado> findByNomeContainingIgnoreCase(String nome);
    Page<Agregado> findAll(Pageable pageable);
}
