package com.rochatransportes.controller;

import com.rochatransportes.model.Agregado;
import com.rochatransportes.service.AgregadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/agregados")
@CrossOrigin(origins = "http://localhost:4200")
public class AgregadoController {

    @Autowired
    private AgregadoService agregadoService;

    @GetMapping
    public ResponseEntity<List<Agregado>> getAll() {
        return ResponseEntity.ok(agregadoService.findAll());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Agregado>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(agregadoService.findAllPaginated(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agregado> getById(@PathVariable Long id) {
        return agregadoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Agregado> create(@Valid @RequestBody Agregado agregado) {
        Agregado saved = agregadoService.save(agregado);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agregado> update(@PathVariable Long id, @Valid @RequestBody Agregado agregado) {
        try {
            Agregado updated = agregadoService.update(id, agregado);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            agregadoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
