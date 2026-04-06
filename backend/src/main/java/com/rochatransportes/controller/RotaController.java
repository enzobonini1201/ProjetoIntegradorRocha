package com.rochatransportes.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rochatransportes.model.Rota;
import com.rochatransportes.service.RotaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/rotas")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class RotaController {

    @Autowired
    private RotaService rotaService;

    @GetMapping
    public ResponseEntity<List<Rota>> listarTodas(@RequestParam(required = false) String pesquisa) {
        try {
            List<Rota> rotas;
            if (pesquisa != null && !pesquisa.isEmpty()) {
                // Busca por origem ou destino
                List<Rota> porOrigem = rotaService.buscarPorOrigem(pesquisa);
                List<Rota> porDestino = rotaService.buscarPorDestino(pesquisa);
                rotas = porOrigem;
                porDestino.forEach(r -> {
                    if (!rotas.contains(r)) rotas.add(r);
                });
            } else {
                rotas = rotaService.listarTodas();
            }
            return ResponseEntity.ok(rotas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Optional<Rota> rota = rotaService.buscarPorId(id);
            if (rota.isPresent()) {
                return ResponseEntity.ok(rota.get());
            }
            Map<String, String> error = new HashMap<>();
            error.put("message", "Rota não encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Rota rota) {
        try {
            Rota novaTota = rotaService.salvar(rota);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaTota);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Rota rota) {
        try {
            Rota rotaAtualizada = rotaService.atualizar(id, rota);
            return ResponseEntity.ok(rotaAtualizada);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            rotaService.deletar(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Rota deletada com sucesso");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
