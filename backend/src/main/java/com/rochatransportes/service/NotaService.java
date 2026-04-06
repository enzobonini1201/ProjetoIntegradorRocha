package com.rochatransportes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rochatransportes.model.Nota;
import com.rochatransportes.repository.NotaRepository;

@Service
@Transactional
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    public List<Nota> findAll() {
        return notaRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Page<Nota> findAllPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return notaRepository.findAll(pageable);
    }

    public Optional<Nota> findById(Long id) {
        return notaRepository.findById(id);
    }

    public Nota save(Nota nota) {
        // Garantir que os campos legados sejam preenchidos com os novos campos
        if (nota.getNomeColetador() != null && !nota.getNomeColetador().isEmpty()) {
            nota.setColetadoPor(nota.getNomeColetador());
        }
        if (nota.getNomeEntregador() != null && !nota.getNomeEntregador().isEmpty()) {
            nota.setEntreguePor(nota.getNomeEntregador());
        }
        return notaRepository.save(nota);
    }

    public Nota update(Long id, Nota nota) {
        if (!notaRepository.existsById(id)) {
            throw new RuntimeException("Nota não encontrada com ID: " + id);
        }
        nota.setId(id);
        // Garantir que os campos legados sejam preenchidos
        if (nota.getNomeColetador() != null && !nota.getNomeColetador().isEmpty()) {
            nota.setColetadoPor(nota.getNomeColetador());
        }
        if (nota.getNomeEntregador() != null && !nota.getNomeEntregador().isEmpty()) {
            nota.setEntreguePor(nota.getNomeEntregador());
        }
        return notaRepository.save(nota);
    }

    public void delete(Long id) {
        if (!notaRepository.existsById(id)) {
            throw new RuntimeException("Nota não encontrada com ID: " + id);
        }
        notaRepository.deleteById(id);
    }

    public List<Nota> findByCliente(String cliente) {
        return notaRepository.findByClienteContainingIgnoreCase(cliente);
    }

    public List<Nota> findByNumeroNota(Integer numeroNota) {
        return notaRepository.findByNumeroNota(numeroNota);
    }

    public List<Nota> findNotasPendentes() {
        return notaRepository.findByDataEntregaIsNullOrderByDataColetaAsc();
    }
}
