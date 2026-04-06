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
@Table(name = "tbagregado")
public class Agregado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAgre")
    @JsonProperty("idAgre")
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(name = "nomeAgre", nullable = false)
    @JsonProperty("nomeAgre")
    private String nome;

    @NotBlank
    @Size(max = 15)
    @Column(name = "telefoneAgre", nullable = false)
    @JsonProperty("telefoneAgre")
    private String telefone;

    @Column(name = "datanascAgre", nullable = false)
    @JsonProperty("datanascAgre")
    private LocalDate dataNascimento;

    @NotBlank
    @Size(max = 15)
    @Column(name = "cpfAgre", nullable = false)
    @JsonProperty("cpfAgre")
    private String cpf;

    @NotBlank
    @Size(max = 200)
    @Column(name = "enderecoagre", nullable = false)
    @JsonProperty("enderecoAgre")
    private String endereco;

    @Column(name = "buonnyAgre", nullable = false)
    @JsonProperty("buonnyAgre")
    private LocalDate buonny;

    @NotBlank
    @Size(max = 15)
    @Column(name = "cnhAgre", nullable = false)
    @JsonProperty("cnhAgre")
    private String cnh;

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

    public LocalDate getBuonny() {
        return buonny;
    }

    public void setBuonny(LocalDate buonny) {
        this.buonny = buonny;
    }

    public String getCnh() {
        return cnh;
    }

    public void setCnh(String cnh) {
        this.cnh = cnh;
    }
}
