package com.rochatransportes.repository;

import com.rochatransportes.model.Transporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface TransporteRepository extends JpaRepository<Transporte, Long> {
    List<Transporte> findByPlacaContainingIgnoreCase(String placa);
    List<Transporte> findByResponsavelContainingIgnoreCase(String responsavel);
    Page<Transporte> findAll(Pageable pageable);
}
