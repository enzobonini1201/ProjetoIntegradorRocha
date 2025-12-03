package com.rochatransportes.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/hash")
    public Map<String, String> gerarHash(@RequestBody Map<String, String> request) {
        String senha = request.get("senha");
        String hash = passwordEncoder.encode(senha);
        
        Map<String, String> response = new HashMap<>();
        response.put("senha", senha);
        response.put("hash", hash);
        return response;
    }

    @PostMapping("/verify")
    public Map<String, Object> verificarHash(@RequestBody Map<String, String> request) {
        String senha = request.get("senha");
        String hash = request.get("hash");
        boolean matches = passwordEncoder.matches(senha, hash);
        
        Map<String, Object> response = new HashMap<>();
        response.put("senha", senha);
        response.put("hash", hash);
        response.put("matches", matches);
        return response;
    }
}
