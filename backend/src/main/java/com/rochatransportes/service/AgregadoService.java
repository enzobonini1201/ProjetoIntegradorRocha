package com.rochatransportes.service;

import com.rochatransportes.model.Agregado;
import com.rochatransportes.repository.AgregadoRepository;
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
public class AgregadoService {

    @Autowired
    private AgregadoRepository agregadoRepository;

    public List<Agregado> findAll() {
        return agregadoRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }

    public Page<Agregado> findAllPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "nome"));
        return agregadoRepository.findAll(pageable);
    }

    public Optional<Agregado> findById(Long id) {
        return agregadoRepository.findById(id);
    }

    public Agregado save(Agregado agregado) {
        return agregadoRepository.save(agregado);
    }

    public Agregado update(Long id, Agregado agregado) {
        if (!agregadoRepository.existsById(id)) {
            throw new RuntimeException("Agregado não encontrado com ID: " + id);
        }
        agregado.setId(id);
        return agregadoRepository.save(agregado);
    }

    public void delete(Long id) {
        if (!agregadoRepository.existsById(id)) {
            throw new RuntimeException("Agregado não encontrado com ID: " + id);
        }
        agregadoRepository.deleteById(id);
    }

    public List<Agregado> findByNome(String nome) {
        return agregadoRepository.findByNomeContainingIgnoreCase(nome);
    }
}
