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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tbnotas")
public class Nota {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idNota")
    @JsonProperty("idNota")
    private Long id;

    @NotNull
    @Column(name = "numeroNota", nullable = false)
    @JsonProperty("numeroNota")
    private Integer numeroNota;

    @NotNull
    @Column(name = "qtdNota", nullable = false)
    @JsonProperty("qtdNota")
    private Integer quantidade;

    @NotBlank
    @Size(max = 100)
    @Column(name = "razaosocialdestNota", nullable = false)
    @JsonProperty("razaosocialdestNota")
    private String razaoSocialDestino;

    @NotBlank
    @Size(max = 100)
    @Column(name = "cidadedestNota", nullable = false)
    @JsonProperty("cidadedestNota")
    private String cidadeDestino;

    @NotBlank
    @Size(max = 15)
    @Column(name = "cnpjdestNota", nullable = false)
    @JsonProperty("cnpjdestNota")
    private String cnpjDestino;

    @NotBlank
    @Size(max = 60)
    @Column(name = "coletadoporNota", nullable = false)
    @JsonProperty("coletadoporNota")
    private String coletadoPor;

    @Size(max = 60)
    @Column(name = "entregueporNota")
    @JsonProperty("entregueporNota")
    private String entreguePor;

    @NotNull
    @Column(name = "datacoletaNota", nullable = false)
    @JsonProperty("datacoletaNota")
    private LocalDate dataColeta;

    @Column(name = "dataentregaNota")
    @JsonProperty("dataentregaNota")
    private LocalDate dataEntrega;

    @NotBlank
    @Size(max = 100)
    @Column(name = "clienteNota", nullable = false)
    @JsonProperty("clienteNota")
    private String cliente;

    // Novos campos para coletador (motorista/agregado)
    @Column(name = "tipo_coletador", length = 20)
    @JsonProperty("tipoColetador")
    private String tipoColetador;

    @Column(name = "id_coletador")
    @JsonProperty("idColetador")
    private Long idColetador;

    @Column(name = "nome_coletador", length = 200)
    @JsonProperty("nomeColetador")
    private String nomeColetador;

    // Novos campos para entregador (motorista/agregado)
    @Column(name = "tipo_entregador", length = 20)
    @JsonProperty("tipoEntregador")
    private String tipoEntregador;

    @Column(name = "id_entregador")
    @JsonProperty("idEntregador")
    private Long idEntregador;

    @Column(name = "nome_entregador", length = 200)
    @JsonProperty("nomeEntregador")
    private String nomeEntregador;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroNota() {
        return numeroNota;
    }

    public void setNumeroNota(Integer numeroNota) {
        this.numeroNota = numeroNota;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getRazaoSocialDestino() {
        return razaoSocialDestino;
    }

    public void setRazaoSocialDestino(String razaoSocialDestino) {
        this.razaoSocialDestino = razaoSocialDestino;
    }

    public String getCidadeDestino() {
        return cidadeDestino;
    }

    public void setCidadeDestino(String cidadeDestino) {
        this.cidadeDestino = cidadeDestino;
    }

    public String getCnpjDestino() {
        return cnpjDestino;
    }

    public void setCnpjDestino(String cnpjDestino) {
        this.cnpjDestino = cnpjDestino;
    }

    public String getColetadoPor() {
        return coletadoPor;
    }

    public void setColetadoPor(String coletadoPor) {
        this.coletadoPor = coletadoPor;
    }

    public String getEntreguePor() {
        return entreguePor;
    }

    public void setEntreguePor(String entreguePor) {
        this.entreguePor = entreguePor;
    }

    public LocalDate getDataColeta() {
        return dataColeta;
    }

    public void setDataColeta(LocalDate dataColeta) {
        this.dataColeta = dataColeta;
    }

    public LocalDate getDataEntrega() {
        return dataEntrega;
    }

    public void setDataEntrega(LocalDate dataEntrega) {
        this.dataEntrega = dataEntrega;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    // Getters e Setters para coletador
    public String getTipoColetador() {
        return tipoColetador;
    }

    public void setTipoColetador(String tipoColetador) {
        this.tipoColetador = tipoColetador;
    }

    public Long getIdColetador() {
        return idColetador;
    }

    public void setIdColetador(Long idColetador) {
        this.idColetador = idColetador;
    }

    public String getNomeColetador() {
        return nomeColetador;
    }

    public void setNomeColetador(String nomeColetador) {
        this.nomeColetador = nomeColetador;
    }

    // Getters e Setters para entregador
    public String getTipoEntregador() {
        return tipoEntregador;
    }

    public void setTipoEntregador(String tipoEntregador) {
        this.tipoEntregador = tipoEntregador;
    }

    public Long getIdEntregador() {
        return idEntregador;
    }

    public void setIdEntregador(Long idEntregador) {
        this.idEntregador = idEntregador;
    }

    public String getNomeEntregador() {
        return nomeEntregador;
    }

    public void setNomeEntregador(String nomeEntregador) {
        this.nomeEntregador = nomeEntregador;
    }

    // Métodos auxiliares
    public String getStatus() {
        return (dataEntrega == null) ? "Pendente" : "Entregue";
    }

    public Integer getDiasRestantes() {
        if (dataEntrega != null) {
            return null; // Já foi entregue
        }
        LocalDate dataVencimento = dataColeta.plusDays(3);
        LocalDate hoje = LocalDate.now();
        return (int) java.time.temporal.ChronoUnit.DAYS.between(hoje, dataVencimento);
    }

    public boolean isPendente() {
        return dataEntrega == null;
    }

    public boolean isVencida() {
        Integer dias = getDiasRestantes();
        return dias != null && dias < 0;
    }
}
