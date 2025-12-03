package com.rochatransportes.dto;

public class AuthResponse {
    
    private String token;
    private String tipo = "Bearer";
    private String login;
    private String nome;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, String login, String nome) {
        this.token = token;
        this.login = login;
        this.nome = nome;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
