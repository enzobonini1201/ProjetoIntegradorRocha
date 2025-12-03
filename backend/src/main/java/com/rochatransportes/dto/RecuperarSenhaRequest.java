package com.rochatransportes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RecuperarSenhaRequest {
    
    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "(\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2})|(\\d{11})", message = "CPF inválido")
    private String cpf;

    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 8, message = "A nova senha deve ter no mínimo 8 caracteres")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!]).+$", 
             message = "A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial (@#$%^&+=!)")
    private String novaSenha;

    // Getters and Setters
    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }
}
