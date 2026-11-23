# Funcionalidade: Resumo de entregas por cidade (Mapa)

## O que foi feito
Na tela **Notas Fiscais** foi criado o botão **"Resumo por cidade"**. Ele abre uma tabela com uma linha para cada **cidade de destino**, mostrando:
- **Total** de notas para aquela cidade
- **Pendentes** (ainda sem data de entrega)
- **Entregues**
- **Vencidas** (pendentes há mais de 3 dias desde a coleta, mesma regra que já existia no sistema)

As cidades aparecem da que tem mais notas para a que tem menos. Assim a transportadora vê rapidamente para onde vai a maior parte das cargas e onde estão os atrasos.

## Arquivos alterados
| Arquivo | Alteração |
|---|---|
| `backend/.../dto/ResumoCidadeDTO.java` | **Novo.** Guarda os contadores de uma cidade (é o "valor" do mapa). |
| `backend/.../service/NotaService.java` | Novo método `resumoPorCidade()`, que monta o **Mapa** (`HashMap<String, ResumoCidadeDTO>`), e o método auxiliar `normalizarCidade()`. |
| `backend/.../controller/NotaController.java` | Novo endpoint `GET /api/notas/resumo-por-cidade`. |
| `frontend/.../services/nota.service.ts` | Interface `ResumoCidade` e método `resumoPorCidade()`. |
| `frontend/.../nota-list/nota-list.component.ts` | Botão "Resumo por cidade" e a tabela do resumo. |

## Como o Mapa é usado
- **Chave (key):** o nome da cidade, em maiúsculas e sem espaços sobrando (ex.: `"CAMPINAS"`).
- **Valor (value):** um `ResumoCidadeDTO` com os contadores daquela cidade.

O sistema percorre a lista de notas **uma única vez**. Para cada nota:
1. monta a chave da cidade;
2. faz um `get` no mapa para ver se essa cidade já existe;
3. se não existir, cria o resumo e faz um `put` no mapa;
4. soma os contadores (total, pendente/entregue, vencida).

No final, os valores do mapa viram uma lista, que é ordenada pelo total para aparecer na tela.

## Por que Mapa?
- O problema é **agrupar por uma chave** (a cidade). Esse é o uso típico de um Mapa: cada chave aparece uma vez só e aponta para o seu valor.
- No `HashMap`, o `get` e o `put` são **O(1)** (instantâneos). Por isso o resumo inteiro custa **O(n)**: uma passada só pelas notas.
- **Por que não Array/Lista?** Para cada nota, eu teria que percorrer a lista procurando se a cidade já está lá. Isso custa O(n²), muito mais lento quando há muitas notas.
- **Por que não Pilha ou Fila?** Elas servem para controlar **ordem de chegada e saída** (LIFO/FIFO), não para agrupar por chave.
- **Por que não Árvore (TreeMap)?** Ela manteria as cidades em ordem alfabética, mas cada operação custa O(log n). Como a ordem que interessa é pelo **total de notas**, e não pelo nome, usei o HashMap e ordenei só no final.

## Consequências para a aplicação
- **Positivas:** um painel novo, que ajuda a planejar as rotas e a ver onde estão os atrasos, sem precisar contar as notas na mão.
- **Nenhum dado é alterado:** é só uma consulta. Não muda o banco nem as outras telas.
- **Cidades com nomes diferentes:** "Campinas", " campinas " e "CAMPINAS" são juntadas na mesma linha. Mas grafias diferentes, como "Sao Paulo" e "São Paulo", aparecem separadas.
- **Notas sem cidade** aparecem como "SEM CIDADE".
- **Desempenho:** o resumo busca todas as notas do banco toda vez que o botão é aberto. Para o tamanho atual do sistema isso é rápido. Se o volume crescer muito, daria para fazer esse agrupamento direto no banco com SQL (`GROUP BY`).
- O resumo é recalculado sempre que o botão é aberto e depois de uma exclusão, então os números ficam sempre atualizados.
