package com.rochatransportes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rochatransportes.model.Rota;
import com.rochatransportes.repository.RotaRepository;

@Service
public class RotaService {

    @Autowired
    private RotaRepository rotaRepository;

    public List<Rota> listarTodas() {
        return rotaRepository.findAll();
    }

    public Optional<Rota> buscarPorId(Long id) {
        return rotaRepository.findById(id);
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
        return rotaRepository.save(rota);
    }

    public Rota atualizar(Long id, Rota rotaAtualizada) {
        Optional<Rota> rotaExistente = rotaRepository.findById(id);
        if (rotaExistente.isPresent()) {
            Rota rota = rotaExistente.get();
            rota.setOrigem(rotaAtualizada.getOrigem());
            rota.setDestino(rotaAtualizada.getDestino());
            rota.setTipoResponsavel(rotaAtualizada.getTipoResponsavel());
            rota.setIdResponsavel(rotaAtualizada.getIdResponsavel());
            rota.setNomeResponsavel(rotaAtualizada.getNomeResponsavel());
            rota.setDistanciaKm(rotaAtualizada.getDistanciaKm());
            rota.setTempoEstimadoMinutos(rotaAtualizada.getTempoEstimadoMinutos());
            rota.setCoordenadasOrigem(rotaAtualizada.getCoordenadasOrigem());
            rota.setCoordenadasDestino(rotaAtualizada.getCoordenadasDestino());
            return rotaRepository.save(rota);
        }
        throw new RuntimeException("Rota não encontrada com ID: " + id);
    }

    public void deletar(Long id) {
        if (!rotaRepository.existsById(id)) {
            throw new RuntimeException("Rota não encontrada com ID: " + id);
        }
        rotaRepository.deleteById(id);
    }
}
