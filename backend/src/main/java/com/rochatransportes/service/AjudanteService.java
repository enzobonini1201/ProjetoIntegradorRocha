package com.rochatransportes.service;

import com.rochatransportes.model.Ajudante;
import com.rochatransportes.repository.AjudanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AjudanteService {

    @Autowired
    private AjudanteRepository ajudanteRepository;

    public List<Ajudante> findAll() {
        return ajudanteRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }

    public Page<Ajudante> findAllPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "nome"));
        return ajudanteRepository.findAll(pageable);
    }

    public Optional<Ajudante> findById(Long id) {
        return ajudanteRepository.findById(id);
    }

    public Ajudante save(Ajudante ajudante) {
        return ajudanteRepository.save(ajudante);
    }

    public Ajudante update(Long id, Ajudante ajudante) {
        if (!ajudanteRepository.existsById(id)) {
            throw new RuntimeException("Ajudante não encontrado com ID: " + id);
        }
        ajudante.setId(id);
        return ajudanteRepository.save(ajudante);
    }

    public void delete(Long id) {
        if (!ajudanteRepository.existsById(id)) {
            throw new RuntimeException("Ajudante não encontrado com ID: " + id);
        }
        ajudanteRepository.deleteById(id);
    }

    public List<Ajudante> findByNome(String nome) {
        return ajudanteRepository.findByNomeContainingIgnoreCase(nome);
    }
}
