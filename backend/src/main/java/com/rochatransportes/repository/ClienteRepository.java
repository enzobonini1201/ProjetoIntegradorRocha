package com.rochatransportes.repository;

import com.rochatransportes.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByRazaoSocialContainingIgnoreCase(String razaoSocial);
    Page<Cliente> findAll(Pageable pageable);
}
