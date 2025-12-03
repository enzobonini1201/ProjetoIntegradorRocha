package com.rochatransportes.controller;

import com.rochatransportes.model.Motorista;
import com.rochatransportes.service.MotoristaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/motoristas")
@CrossOrigin(origins = "http://localhost:4200")
public class MotoristaController {

    @Autowired
    private MotoristaService motoristaService;

    @GetMapping
    public ResponseEntity<List<Motorista>> getAll() {
        return ResponseEntity.ok(motoristaService.findAll());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Motorista>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(motoristaService.findAllPaginated(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Motorista>> search(
            @RequestParam(required = false) String pesquisa,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(motoristaService.search(pesquisa, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Motorista> getById(@PathVariable Long id) {
        return motoristaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Motorista> create(@Valid @RequestBody Motorista motorista) {
        Motorista saved = motoristaService.save(motorista);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Motorista> update(@PathVariable Long id, @Valid @RequestBody Motorista motorista) {
        try {
            Motorista updated = motoristaService.update(id, motorista);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            motoristaService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
