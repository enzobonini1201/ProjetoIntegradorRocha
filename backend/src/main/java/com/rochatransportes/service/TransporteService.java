package com.rochatransportes.service;

import com.rochatransportes.model.Transporte;
import com.rochatransportes.repository.TransporteRepository;
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
public class TransporteService {

    @Autowired
    private TransporteRepository transporteRepository;

    public List<Transporte> findAll() {
        return transporteRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }

    public Page<Transporte> findAllPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "nome"));
        return transporteRepository.findAll(pageable);
    }

    public Optional<Transporte> findById(Long id) {
        return transporteRepository.findById(id);
    }

    public Transporte save(Transporte transporte) {
        // Garantir que o campo legado responsavelTrans seja preenchido
        // com o nomeResponsavel para manter compatibilidade
        if (transporte.getNomeResponsavel() != null && !transporte.getNomeResponsavel().isEmpty()) {
            transporte.setResponsavel(transporte.getNomeResponsavel());
        }
        return transporteRepository.save(transporte);
    }

    public Transporte update(Long id, Transporte transporte) {
        if (!transporteRepository.existsById(id)) {
            throw new RuntimeException("Transporte não encontrado com ID: " + id);
        }
        transporte.setId(id);
        // Garantir que o campo legado responsavelTrans seja preenchido
        if (transporte.getNomeResponsavel() != null && !transporte.getNomeResponsavel().isEmpty()) {
            transporte.setResponsavel(transporte.getNomeResponsavel());
        }
        return transporteRepository.save(transporte);
    }

    public void delete(Long id) {
        if (!transporteRepository.existsById(id)) {
            throw new RuntimeException("Transporte não encontrado com ID: " + id);
        }
        transporteRepository.deleteById(id);
    }

    public List<Transporte> findByPlaca(String placa) {
        return transporteRepository.findByPlacaContainingIgnoreCase(placa);
    }

    public List<Transporte> findByResponsavel(String responsavel) {
        return transporteRepository.findByResponsavelContainingIgnoreCase(responsavel);
    }
}
