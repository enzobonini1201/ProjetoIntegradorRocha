package com.rochatransportes.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
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

import com.rochatransportes.dto.ResumoCidadeDTO;
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

    /**
     * Agrupa as notas por cidade de destino usando um MAPA (HashMap).
     *
     * Chave (key)  -> nome da cidade (ex.: "CAMPINAS")
     * Valor (value) -> ResumoCidadeDTO com os contadores daquela cidade
     *
     * Percorre a lista de notas UMA única vez. Para cada nota:
     *  1. monta a chave (cidade em maiúsculas e sem espaços sobrando);
     *  2. procura a cidade no mapa (get);
     *  3. se ainda não existir, cria o resumo e coloca no mapa (put);
     *  4. soma os contadores.
     */
    public List<ResumoCidadeDTO> resumoPorCidade() {
        Map<String, ResumoCidadeDTO> mapa = new HashMap<>();

        for (Nota nota : notaRepository.findAll()) {
            String chave = normalizarCidade(nota.getCidadeDestino());

            ResumoCidadeDTO resumo = mapa.get(chave);
            if (resumo == null) {
                resumo = new ResumoCidadeDTO(chave);
                mapa.put(chave, resumo);
            }

            resumo.somarTotal();
            if (nota.isPendente()) {
                resumo.somarPendente();
                if (nota.getDataColeta() != null && nota.isVencida()) {
                    resumo.somarVencida();
                }
            } else {
                resumo.somarEntregue();
            }
        }

        // O HashMap não tem ordem; para exibir, ordena pela cidade com mais notas
        List<ResumoCidadeDTO> resultado = new ArrayList<>(mapa.values());
        resultado.sort(Comparator.comparingInt(ResumoCidadeDTO::getTotal).reversed()
                .thenComparing(ResumoCidadeDTO::getCidade));
        return resultado;
    }

    // "  Campinas " e "CAMPINAS" viram a mesma chave
    private String normalizarCidade(String cidade) {
        if (cidade == null || cidade.isBlank()) {
            return "SEM CIDADE";
        }
        return cidade.trim().toUpperCase();
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
