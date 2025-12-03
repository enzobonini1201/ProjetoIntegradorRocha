package com.rochatransportes.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "tbmotorista")
public class Motorista {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idMoto")
    @JsonProperty("idMoto")
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(name = "nomeMoto", nullable = false)
    @JsonProperty("nomeMoto")
    private String nome;

    @Size(max = 15)
    @Column(name = "telefoneMoto")
    @JsonProperty("telefoneMoto")
    private String telefone;

    @Column(name = "datanascMoto")
    @JsonProperty("datanascMoto")
    private String dataNascimento;

    @Size(max = 11)
    @Column(name = "cpfMoto")
    @JsonProperty("cpfMoto")
    private String cpf;

    @Size(max = 200)
    @Column(name = "enderecoMoto")
    @JsonProperty("enderecoMoto")
    private String endereco;

    @Column(name = "buonnyMoto")
    @JsonProperty("buonnyMoto")
    private String buonny;

    @Size(max = 15)
    @Column(name = "cnhMoto")
    @JsonProperty("cnhMoto")
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

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
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

    public String getBuonny() {
        return buonny;
    }

    public void setBuonny(String buonny) {
        this.buonny = buonny;
    }

    public String getCnh() {
        return cnh;
    }

    public void setCnh(String cnh) {
        this.cnh = cnh;
    }
}
