package com.rochatransportes.controller;

import com.rochatransportes.dto.AlterarSenhaRequest;
import com.rochatransportes.dto.AuthResponse;
import com.rochatransportes.dto.LoginRequest;
import com.rochatransportes.dto.RegisterRequest;
import com.rochatransportes.dto.UpdateUserRequest;
import com.rochatransportes.model.Usuario;
import com.rochatransportes.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            String login = authentication.getName();
            Usuario usuario = authService.getUsuarioByLogin(login);
            
            Map<String, String> response = new HashMap<>();
            response.put("login", usuario.getLogin());
            response.put("nome", usuario.getNome());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request) {
        try {
            String login = authentication.getName();
            Usuario usuario = authService.updateUsuario(login, request);
            
            Map<String, String> response = new HashMap<>();
            response.put("login", usuario.getLogin());
            response.put("nome", usuario.getNome());
            response.put("message", "Perfil atualizado com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/senha")
    public ResponseEntity<?> alterarSenha(
            Authentication authentication,
            @Valid @RequestBody AlterarSenhaRequest request) {
        try {
            String login = authentication.getName();
            authService.alterarSenha(login, request);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Senha alterada com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }
}
