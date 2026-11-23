package com.rochatransportes.dto;

/**
 * Resumo das notas fiscais de UMA cidade de destino.
 * É o "valor" guardado no Mapa (a "chave" é o nome da cidade).
 */
public class ResumoCidadeDTO {

    private String cidade;
    private int total;
    private int pendentes;
    private int entregues;
    private int vencidas;

    public ResumoCidadeDTO(String cidade) {
        this.cidade = cidade;
    }

    public void somarTotal() { total++; }
    public void somarPendente() { pendentes++; }
    public void somarEntregue() { entregues++; }
    public void somarVencida() { vencidas++; }

    public String getCidade() { return cidade; }
    public int getTotal() { return total; }
    public int getPendentes() { return pendentes; }
    public int getEntregues() { return entregues; }
    public int getVencidas() { return vencidas; }
}
