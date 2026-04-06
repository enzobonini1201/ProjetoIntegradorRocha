package com.rochatransportes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rochatransportes.model.Rota;

@Repository
public interface RotaRepository extends JpaRepository<Rota, Long> {
    List<Rota> findByOrigemContainingIgnoreCase(String origem);
    List<Rota> findByDestinoContainingIgnoreCase(String destino);
    List<Rota> findByTipoResponsavel(String tipoResponsavel);
}
