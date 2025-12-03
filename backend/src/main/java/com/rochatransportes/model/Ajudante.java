package com.rochatransportes.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tbajudante")
public class Ajudante {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAjuda")
    @JsonProperty("idAjuda")
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(name = "nomeAjuda", nullable = false)
    @JsonProperty("nomeAjuda")
    private String nome;

    @NotBlank
    @Size(max = 15)
    @Column(name = "telefoneAjuda", nullable = false)
    @JsonProperty("telefoneAjuda")
    private String telefone;

    @Column(name = "datanascAjuda", nullable = false)
    @JsonProperty("datanascAjuda")
    private LocalDate dataNascimento;

    @NotBlank
    @Size(max = 15)
    @Column(name = "cpfAjuda", nullable = false)
    @JsonProperty("cpfAjuda")
    private String cpf;

    @NotBlank
    @Size(max = 200)
    @Column(name = "enderecoajuda", nullable = false)
    @JsonProperty("enderecoAjuda")
    private String endereco;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
}
