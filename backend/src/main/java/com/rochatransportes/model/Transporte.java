package com.rochatransportes.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tbtransporte")
public class Transporte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTrans")
    @JsonProperty("idTrans")
    private Long id;

    @NotBlank
    @Size(max = 60)
    @Column(name = "tipoTrans", nullable = false)
    @JsonProperty("tipoTrans")
    private String tipo;

    @NotBlank
    @Size(max = 10)
    @Column(name = "placaTrans", nullable = false)
    @JsonProperty("placaTrans")
    private String placa;

    @NotBlank
    @Size(max = 100)
    @Column(name = "capacidadeTrans", nullable = false)
    @JsonProperty("capacidadeTrans")
    private String capacidade;

    @NotBlank
    @Size(max = 200)
    @Column(name = "nomeTrans", nullable = false)
    @JsonProperty("nomeTrans")
    private String nome;

    @NotBlank
    @Size(max = 100)
    @Column(name = "responsavelTrans", nullable = false)
    @JsonProperty("responsavelTrans")
    private String responsavel;

    @NotBlank
    @Size(max = 20)
    @Column(name = "tipoResponsavel", nullable = false)
    @JsonProperty("tipoResponsavel")
    private String tipoResponsavel;

    @Column(name = "idResponsavel", nullable = false)
    @JsonProperty("idResponsavel")
    private Long idResponsavel;

    @Size(max = 200)
    @Column(name = "nomeResponsavel")
    @JsonProperty("nomeResponsavel")
    private String nomeResponsavel;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(String capacidade) {
        this.capacidade = capacidade;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getTipoResponsavel() {
        return tipoResponsavel;
    }

    public void setTipoResponsavel(String tipoResponsavel) {
        this.tipoResponsavel = tipoResponsavel;
    }

    public Long getIdResponsavel() {
        return idResponsavel;
    }

    public void setIdResponsavel(Long idResponsavel) {
        this.idResponsavel = idResponsavel;
    }

    public String getNomeResponsavel() {
        return nomeResponsavel;
    }

    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }
}
