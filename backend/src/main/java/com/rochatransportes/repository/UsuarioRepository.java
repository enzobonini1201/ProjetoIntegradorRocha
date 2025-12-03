package com.rochatransportes.repository;

import com.rochatransportes.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    Optional<Usuario> findByLogin(String login);
    boolean existsByLogin(String login);
    Optional<Usuario> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
}
