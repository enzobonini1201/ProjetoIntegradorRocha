package com.rochatransportes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rochatransportes.dto.AlterarSenhaRequest;
import com.rochatransportes.dto.AuthResponse;
import com.rochatransportes.dto.LoginRequest;
import com.rochatransportes.dto.RegisterRequest;
import com.rochatransportes.dto.UpdateUserRequest;
import com.rochatransportes.model.Usuario;
import com.rochatransportes.repository.UsuarioRepository;
import com.rochatransportes.security.JwtTokenProvider;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        // Remover formatação do login (pode ser CPF com ou sem formatação)
        String loginLimpo = request.getLogin().replaceAll("[^0-9a-zA-Z]", "");
        
        System.out.println("=== DEBUG LOGIN ===");
        System.out.println("Login recebido: " + request.getLogin());
        System.out.println("Login limpo: " + loginLimpo);
        
        // Buscar usuário pelo login
        Usuario usuario = usuarioRepository.findByLogin(loginLimpo)
                .orElseThrow(() -> {
                    System.out.println("Usuario NAO encontrado com login: " + loginLimpo);
                    return new RuntimeException("Usuário não encontrado ou senha incorreta");
                });

        System.out.println("Usuario encontrado: " + usuario.getLogin());
        System.out.println("Senha no banco (inicio): " + usuario.getSenha().substring(0, 10));
        
        // Verificar senha usando BCrypt
        boolean senhaCorreta = passwordEncoder.matches(request.getSenha(), usuario.getSenha());
        System.out.println("Senha fornecida: " + request.getSenha());
        System.out.println("Senha corresponde: " + senhaCorreta);
        
        if (!senhaCorreta) {
            throw new RuntimeException("Usuário não encontrado ou senha incorreta");
        }

        // Gerar token
        System.out.println("Gerando token para: " + usuario.getLogin());
        String token = tokenProvider.generateToken(usuario.getLogin());
        System.out.println("Token gerado com sucesso");
        
        System.out.println("Criando AuthResponse...");
        AuthResponse response = new AuthResponse(token, usuario.getLogin(), usuario.getNome());
        System.out.println("Login concluido com sucesso!");
        
        return response;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Verificar se login já existe
        if (usuarioRepository.existsByLogin(request.getLogin())) {
            throw new RuntimeException("Login já está em uso");
        }

        // Criar novo usuário
        Usuario usuario = new Usuario();
        usuario.setLogin(request.getLogin());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setNome(request.getNome());

        usuarioRepository.save(usuario);

        // Gerar token
        String token = tokenProvider.generateToken(usuario.getLogin());

        return new AuthResponse(token, usuario.getLogin(), usuario.getNome());
    }

    public Usuario getUsuarioByLogin(String login) {
        return usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Transactional
    public Usuario updateUsuario(String login, UpdateUserRequest request) {
        Usuario usuario = getUsuarioByLogin(login);

        // Atualizar nome
        usuario.setNome(request.getNome());

        // Atualizar senha se fornecida
        if (request.getSenhaAtual() != null && !request.getSenhaAtual().isEmpty() && 
            request.getSenhaNova() != null && !request.getSenhaNova().isEmpty()) {
            
            if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenha())) {
                throw new RuntimeException("Senha atual incorreta");
            }

            usuario.setSenha(passwordEncoder.encode(request.getSenhaNova()));
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void alterarSenha(String login, AlterarSenhaRequest request) {
        Usuario usuario = getUsuarioByLogin(login);

        // Verificar senha atual
        if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        // Atualizar para nova senha
        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuarioRepository.save(usuario);
    }
}
