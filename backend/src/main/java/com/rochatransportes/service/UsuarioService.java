package com.rochatransportes.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rochatransportes.dto.CadastroRequest;
import com.rochatransportes.dto.RecuperarSenhaRequest;
import com.rochatransportes.model.Usuario;
import com.rochatransportes.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Map<String, String> cadastrarUsuario(CadastroRequest request) {
        // Validar se senhas conferem
        if (!request.getSenha().equals(request.getConfirmarSenha())) {
            throw new RuntimeException("As senhas não conferem");
        }

        // Remover formatação do CPF
        String cpfSemFormatacao = request.getCpf().replaceAll("[^0-9]", "");
        
        // Validar CPF (deve ter 11 dígitos)
        if (cpfSemFormatacao.length() != 11) {
            throw new RuntimeException("CPF inválido");
        }
        
        // Verificar se CPF já existe (buscar com e sem formatação)
        if (usuarioRepository.existsByCpf(cpfSemFormatacao) || 
            usuarioRepository.existsByCpf(request.getCpf())) {
            throw new RuntimeException("CPF já cadastrado no sistema");
        }

        // Validar força da senha
        String erroSenha = validarForcaSenha(request.getSenha());
        if (erroSenha != null) {
            throw new RuntimeException(erroSenha);
        }

        // Criar novo usuário
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNomeCompleto());
        usuario.setCpf(cpfSemFormatacao);
        
        // Usar CPF sem formatação como login
        usuario.setLogin(cpfSemFormatacao);
        
        // Criptografar senha usando BCrypt
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));

        usuarioRepository.save(usuario);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Usuário cadastrado com sucesso! Use seu CPF para fazer login.");
        response.put("login", cpfSemFormatacao);
        
        return response;
    }

    @Transactional
    public Map<String, String> recuperarSenha(RecuperarSenhaRequest request) {
        // Remover formatação do CPF
        String cpfSemFormatacao = request.getCpf().replaceAll("[^0-9]", "");
        
        // Buscar usuário pelo CPF (sem formatação)
        Usuario usuario = usuarioRepository.findByCpf(cpfSemFormatacao)
            .orElseThrow(() -> new RuntimeException("CPF não encontrado no sistema"));

        // Atualizar senha do usuário usando BCrypt
        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuarioRepository.save(usuario);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Senha alterada com sucesso! Faça login com sua nova senha.");
        
        return response;
    }

    private String validarForcaSenha(String senha) {
        if (senha.length() < 8) {
            return "Senha deve ter no mínimo 8 caracteres";
        }
        
        if (!senha.matches(".*[A-Z].*")) {
            return "Senha deve conter pelo menos 1 letra maiúscula";
        }
        
        if (!senha.matches(".*[a-z].*")) {
            return "Senha deve conter pelo menos 1 letra minúscula";
        }
        
        if (!senha.matches(".*\\d.*")) {
            return "Senha deve conter pelo menos 1 número";
        }
        
        if (!senha.matches(".*[@#$%^&+=!].*")) {
            return "Senha deve conter pelo menos 1 caractere especial (@#$%^&+=!)";
        }
        
        return null;
    }
    
    private String gerarSenhaTemporaria() {
        String maiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String minusculas = "abcdefghijklmnopqrstuvwxyz";
        String numeros = "0123456789";
        String especiais = "@#$%^&+=!";
        String todos = maiusculas + minusculas + numeros + especiais;
        
        Random random = new Random();
        StringBuilder senha = new StringBuilder();
        
        // Garantir pelo menos um de cada tipo
        senha.append(maiusculas.charAt(random.nextInt(maiusculas.length())));
        senha.append(minusculas.charAt(random.nextInt(minusculas.length())));
        senha.append(numeros.charAt(random.nextInt(numeros.length())));
        senha.append(especiais.charAt(random.nextInt(especiais.length())));
        
        // Completar com caracteres aleatórios até 10 caracteres
        for (int i = 4; i < 10; i++) {
            senha.append(todos.charAt(random.nextInt(todos.length())));
        }
        
        // Embaralhar a senha
        char[] chars = senha.toString().toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        
        return new String(chars);
    }
}
