package com.rochatransportes.controller;

import com.rochatransportes.model.Transporte;
import com.rochatransportes.service.TransporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/transportes")
@CrossOrigin(origins = "http://localhost:4200")
public class TransporteController {
    
    @Autowired
    private TransporteService transporteService;

    @GetMapping
    public ResponseEntity<List<Transporte>> getAll() {
        return ResponseEntity.ok(transporteService.findAll());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Transporte>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(transporteService.findAllPaginated(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transporte> getById(@PathVariable Long id) {
        return transporteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Transporte> create(@Valid @RequestBody Transporte transporte) {
        Transporte saved = transporteService.save(transporte);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transporte> update(@PathVariable Long id, @Valid @RequestBody Transporte transporte) {
        try {
            Transporte updated = transporteService.update(id, transporte);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            transporteService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
