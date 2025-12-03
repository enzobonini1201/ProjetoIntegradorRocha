package com.rochatransportes.repository;

import com.rochatransportes.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findByClienteContainingIgnoreCase(String cliente);
    List<Nota> findByNumeroNota(Integer numeroNota);
    Page<Nota> findAll(Pageable pageable);
    List<Nota> findByDataEntregaIsNullOrderByDataColetaAsc();
}
