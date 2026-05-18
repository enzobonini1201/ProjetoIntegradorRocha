package com.rochatransportes.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rochatransportes.model.Nota;
import com.rochatransportes.model.Ajudante;
import com.rochatransportes.repository.AjudanteRepository;
import com.rochatransportes.repository.NotaRepository;

@Service
@Transactional
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private AjudanteRepository ajudanteRepository;

    public List<Nota> findAll() {
        return notaRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Page<Nota> findAllPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return notaRepository.findAll(pageable);
    }

    public Optional<Nota> findById(Long id) {
        Long notaId = Objects.requireNonNull(id, "ID da nota não pode ser nulo");
        return notaRepository.findById(notaId);
    }

    public Nota save(Nota nota) {
        // Garantir que os campos legados sejam preenchidos com os novos campos
        if (nota.getNomeColetador() != null && !nota.getNomeColetador().isEmpty()) {
            nota.setColetadoPor(nota.getNomeColetador());
        }
        if (nota.getNomeEntregador() != null && !nota.getNomeEntregador().isEmpty()) {
            nota.setEntreguePor(nota.getNomeEntregador());
        }
        if (nota.getNomeCliente() != null && !nota.getNomeCliente().isBlank()) {
            nota.setCliente(nota.getCliente() == null || nota.getCliente().isBlank() ? nota.getNomeCliente() : nota.getCliente());
        }
        prepararAjudantes(nota);
        return notaRepository.save(nota);
    }

    public Nota update(Long id, Nota nota) {
        Long notaId = Objects.requireNonNull(id, "ID da nota não pode ser nulo");
        if (!notaRepository.existsById(notaId)) {
            throw new RuntimeException("Nota não encontrada com ID: " + id);
        }
        nota.setId(notaId);
        // Garantir que os campos legados sejam preenchidos
        if (nota.getNomeColetador() != null && !nota.getNomeColetador().isEmpty()) {
            nota.setColetadoPor(nota.getNomeColetador());
        }
        if (nota.getNomeEntregador() != null && !nota.getNomeEntregador().isEmpty()) {
            nota.setEntreguePor(nota.getNomeEntregador());
        }
        if (nota.getNomeCliente() != null && !nota.getNomeCliente().isBlank()) {
            nota.setCliente(nota.getCliente() == null || nota.getCliente().isBlank() ? nota.getNomeCliente() : nota.getCliente());
        }
        prepararAjudantes(nota);
        return notaRepository.save(nota);
    }

    public void delete(Long id) {
        Long notaId = Objects.requireNonNull(id, "ID da nota não pode ser nulo");
        if (!notaRepository.existsById(notaId)) {
            throw new RuntimeException("Nota não encontrada com ID: " + id);
        }
        notaRepository.deleteById(notaId);
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

    private void prepararAjudantes(Nota nota) {
        if (nota.getAjudantes() == null || nota.getAjudantes().isEmpty()) {
            nota.setAjudantes(new ArrayList<>());
            return;
        }

        List<Long> ids = nota.getAjudantes().stream()
                .map(Ajudante::getId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        if (ids.isEmpty()) {
            nota.setAjudantes(new ArrayList<>());
            return;
        }

        List<Ajudante> ajudantes = ajudanteRepository.findAllById(ids);
        nota.setAjudantes(ids.stream()
                .map(id -> ajudantes.stream().filter(ajudante -> id.equals(ajudante.getId())).findFirst().orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList()));
    }
}
