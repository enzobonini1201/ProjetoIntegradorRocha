package com.rochatransportes.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tbrota")
public class Rota {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRota")
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(name = "origem", nullable = false)
    private String origem;

    @NotBlank
    @Size(max = 200)
    @Column(name = "destino", nullable = false)
    private String destino;

    @NotNull
    @Column(name = "tipo_responsavel", nullable = false, length = 20)
    private String tipoResponsavel; // "motorista" ou "agregado"

    @NotNull
    @Column(name = "id_responsavel", nullable = false)
    private Long idResponsavel;

    @Size(max = 200)
    @Column(name = "nome_responsavel", length = 200)
    private String nomeResponsavel;

    @Column(name = "distanciaKm")
    private Double distanciaKm;

    @Column(name = "tempo_estimado_minutos")
    private Integer tempoEstimadoMinutos;

    @Column(name = "coordenadas_origem", columnDefinition = "TEXT")
    private String coordenadasOrigem; // JSON: {"lat": -23.550520, "lng": -46.633308}

    @Column(name = "coordenadas_destino", columnDefinition = "TEXT")
    private String coordenadasDestino; // JSON: {"lat": -22.906847, "lng": -43.172896}

    @Column(name = "criadoEm")
    private LocalDateTime criadoEm;

    @Column(name = "atualizadoEm")
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    // Getters and Setters
    @JsonProperty("idRota")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
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

    public Double getDistanciaKm() {
        return distanciaKm;
    }

    public void setDistanciaKm(Double distanciaKm) {
        this.distanciaKm = distanciaKm;
    }

    public Integer getTempoEstimadoMinutos() {
        return tempoEstimadoMinutos;
    }

    public void setTempoEstimadoMinutos(Integer tempoEstimadoMinutos) {
        this.tempoEstimadoMinutos = tempoEstimadoMinutos;
    }

    public String getCoordenadasOrigem() {
        return coordenadasOrigem;
    }

    public void setCoordenadasOrigem(String coordenadasOrigem) {
        this.coordenadasOrigem = coordenadasOrigem;
    }

    public String getCoordenadasDestino() {
        return coordenadasDestino;
    }

    public void setCoordenadasDestino(String coordenadasDestino) {
        this.coordenadasDestino = coordenadasDestino;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}
