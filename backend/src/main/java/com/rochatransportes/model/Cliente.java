package com.rochatransportes.model;

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
@Table(name = "tbcliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCliente")
    @JsonProperty("idCliente")
    private Long id;

    @NotBlank
    @Size(max = 15)
    @Column(name = "telefoneCliente", nullable = false)
    @JsonProperty("telefoneCliente")
    private String telefone;

    @NotBlank
    @Size(max = 100)
    @Column(name = "razaosocialCliente", nullable = false)
    @JsonProperty("razaosocialCliente")
    private String razaoSocial;

    @Size(max = 15)
    @Column(name = "cnpjCliente")
    @JsonProperty("cnpjCliente")
    private String cnpj;

    @Size(max = 100)
    @Column(name = "cepCliente")
    @JsonProperty("cepCliente")
    private String cep;

    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public String getTelefone() { 
        return telefone; 
    }
    
    public void setTelefone(String telefone) { 
        this.telefone = telefone; 
    }
    
    public String getRazaoSocial() { 
        return razaoSocial; 
    }
    
    public void setRazaoSocial(String razaoSocial) { 
        this.razaoSocial = razaoSocial; 
    }
    
    public String getCnpj() { 
        return cnpj; 
    }
    
    public void setCnpj(String cnpj) { 
        this.cnpj = cnpj; 
    }
    
    public String getCep() { 
        return cep; 
    }
    
    public void setCep(String cep) { 
        this.cep = cep; 
    }
}
