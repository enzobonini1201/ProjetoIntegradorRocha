package com.rochatransportes.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rochatransportes.model.Ajudante;
import com.rochatransportes.model.Rota;
import com.rochatransportes.repository.AjudanteRepository;
import com.rochatransportes.repository.RotaRepository;

@Service
public class RotaService {

    @Autowired
    private RotaRepository rotaRepository;

    @Autowired
    private AjudanteRepository ajudanteRepository;

    public List<Rota> listarTodas() {
        return rotaRepository.findAll();
    }

    public Optional<Rota> buscarPorId(Long id) {
        Long rotaId = Objects.requireNonNull(id, "ID da rota não pode ser nulo");
        return rotaRepository.findById(rotaId);
    }

    public List<Rota> buscarPorOrigem(String origem) {
        return rotaRepository.findByOrigemContainingIgnoreCase(origem);
    }

    public List<Rota> buscarPorDestino(String destino) {
        return rotaRepository.findByDestinoContainingIgnoreCase(destino);
    }

    public List<Rota> buscarPorTipo(String tipoResponsavel) {
        return rotaRepository.findByTipoResponsavel(tipoResponsavel);
    }

    public Rota salvar(Rota rota) {
        Rota rotaNaoNula = Objects.requireNonNull(rota, "Rota não pode ser nula");
        prepararAjudantes(rotaNaoNula);
        return rotaRepository.save(rotaNaoNula);
    }

    public Rota atualizar(Long id, Rota rotaAtualizada) {
        Long rotaId = Objects.requireNonNull(id, "ID da rota não pode ser nulo");
        Optional<Rota> rotaExistente = rotaRepository.findById(rotaId);
        if (rotaExistente.isPresent()) {
            Rota rota = rotaExistente.get();
            rota.setOrigem(rotaAtualizada.getOrigem());
            rota.setDestino(rotaAtualizada.getDestino());
            rota.setTipoResponsavel(rotaAtualizada.getTipoResponsavel());
            rota.setIdResponsavel(rotaAtualizada.getIdResponsavel());
            rota.setNomeResponsavel(rotaAtualizada.getNomeResponsavel());
            rota.setIdNota(rotaAtualizada.getIdNota());
            rota.setNumeroNota(rotaAtualizada.getNumeroNota());
            rota.setClienteNota(rotaAtualizada.getClienteNota());
            rota.setIdCliente(rotaAtualizada.getIdCliente());
            rota.setNomeCliente(rotaAtualizada.getNomeCliente());
            rota.setIdVeiculo(rotaAtualizada.getIdVeiculo());
            rota.setNomeVeiculo(rotaAtualizada.getNomeVeiculo());
            rota.setPlacaVeiculo(rotaAtualizada.getPlacaVeiculo());
            rota.setDistanciaKm(rotaAtualizada.getDistanciaKm());
            rota.setTempoEstimadoMinutos(rotaAtualizada.getTempoEstimadoMinutos());
            rota.setCoordenadasOrigem(rotaAtualizada.getCoordenadasOrigem());
            rota.setCoordenadasDestino(rotaAtualizada.getCoordenadasDestino());
            prepararAjudantes(rotaAtualizada);
            rota.setAjudantes(rotaAtualizada.getAjudantes());
            return rotaRepository.save(rota);
        }
        throw new RuntimeException("Rota não encontrada com ID: " + id);
    }

    public void deletar(Long id) {
        Long rotaId = Objects.requireNonNull(id, "ID da rota não pode ser nulo");
        if (!rotaRepository.existsById(rotaId)) {
            throw new RuntimeException("Rota não encontrada com ID: " + id);
        }
        rotaRepository.deleteById(rotaId);
    }

    private void prepararAjudantes(Rota rota) {
        if (rota.getAjudantes() == null || rota.getAjudantes().isEmpty()) {
            rota.setAjudantes(new ArrayList<>());
            return;
        }

        List<Long> ids = rota.getAjudantes().stream()
                .map(Ajudante::getId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        if (ids.isEmpty()) {
            rota.setAjudantes(new ArrayList<>());
            return;
        }

        List<Ajudante> ajudantes = ajudanteRepository.findAllById(ids);
        rota.setAjudantes(ids.stream()
                .map(id -> ajudantes.stream().filter(ajudante -> id.equals(ajudante.getId())).findFirst().orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList()));
    }
}
