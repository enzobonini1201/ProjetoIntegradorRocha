package com.rochatransportes.repository;

import com.rochatransportes.model.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
    
    @Query("SELECT m FROM Motorista m WHERE " +
           "CAST(m.id AS string) = :pesquisa OR " +
           "UPPER(m.nome) LIKE UPPER(CONCAT('%', :pesquisa, '%'))")
    Page<Motorista> findByIdOrNome(@Param("pesquisa") String pesquisa, Pageable pageable);
    
    List<Motorista> findByNomeContainingIgnoreCase(String nome);
}
