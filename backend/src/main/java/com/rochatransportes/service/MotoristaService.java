package com.rochatransportes.service;

import com.rochatransportes.model.Motorista;
import com.rochatransportes.repository.MotoristaRepository;
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
public class MotoristaService {

    @Autowired
    private MotoristaRepository motoristaRepository;

    public List<Motorista> findAll() {
        return motoristaRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }

    public Page<Motorista> findAllPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "nome"));
        return motoristaRepository.findAll(pageable);
    }

    public Page<Motorista> search(String pesquisa, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "nome"));
        if (pesquisa == null || pesquisa.trim().isEmpty()) {
            return motoristaRepository.findAll(pageable);
        }
        return motoristaRepository.findByIdOrNome(pesquisa.trim(), pageable);
    }

    public Optional<Motorista> findById(Long id) {
        return motoristaRepository.findById(id);
    }

    public Motorista save(Motorista motorista) {
        return motoristaRepository.save(motorista);
    }

    public Motorista update(Long id, Motorista motorista) {
        if (!motoristaRepository.existsById(id)) {
            throw new RuntimeException("Motorista não encontrado com ID: " + id);
        }
        motorista.setId(id);
        return motoristaRepository.save(motorista);
    }

    public void delete(Long id) {
        if (!motoristaRepository.existsById(id)) {
            throw new RuntimeException("Motorista não encontrado com ID: " + id);
        }
        motoristaRepository.deleteById(id);
    }

    public List<Motorista> findByNome(String nome) {
        return motoristaRepository.findByNomeContainingIgnoreCase(nome);
    }
}
