package com.rochatransportes.controller;

import com.rochatransportes.model.Ajudante;
import com.rochatransportes.service.AjudanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/ajudantes")
@CrossOrigin(origins = "http://localhost:4200")
public class AjudanteController {

    @Autowired
    private AjudanteService ajudanteService;

    @GetMapping
    public ResponseEntity<List<Ajudante>> getAll() {
        return ResponseEntity.ok(ajudanteService.findAll());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Ajudante>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ajudanteService.findAllPaginated(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ajudante> getById(@PathVariable Long id) {
        return ajudanteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ajudante> create(@Valid @RequestBody Ajudante ajudante) {
        Ajudante saved = ajudanteService.save(ajudante);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ajudante> update(@PathVariable Long id, @Valid @RequestBody Ajudante ajudante) {
        try {
            Ajudante updated = ajudanteService.update(id, ajudante);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            ajudanteService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
