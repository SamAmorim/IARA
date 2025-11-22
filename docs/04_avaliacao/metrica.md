# Avaliação e Diagnóstico dos Modelos de IA

Esta seção apresenta a avaliação detalhada da performance da arquitetura de Inteligência Artificial em duas etapas (Cascata). Os modelos foram avaliados utilizando um conjunto de teste independente para garantir a capacidade de generalização.

---

## 1. Desempenho do Modelo Binário (Classificador de Risco)

O primeiro estágio da arquitetura atua como um filtro de risco, decidindo se uma transação é Legítima (0) ou Fraude (1).

### 1.1. Métricas Globais

O modelo demonstrou robustez e alto poder de discriminação.

| Métrica | Valor | Interpretação Técnica |
| :--- | :--- | :--- |
| **ROC AUC** | **0.9806** | Capacidade excepcional de distinguir entre classes em variados limiares. |
| **Recall (Classe 1)** | **0.9267** | O modelo detecta aproximadamente 92.7% de todas as fraudes (Baixo índice de Falsos Negativos). |
| **Precision (Classe 1)** | **0.9220** | Quando o modelo alerta fraude, ele está correto em 92.2% das vezes. |
| **F1-Score** | **0.9244** | Equilíbrio harmônico entre precisão e recuperação. |
| **Acurácia** | **0.92** | Performance consistente em um dataset balanceado. |

### 1.2. Análise da Matriz de Confusão

A matriz revela o compromisso (trade-off) operacional do modelo.

| | Predito: Não Fraude (0) | Predito: Fraude (1) |
| :--- | :--- | :--- |
| **Real: Não Fraude (0)** | **99.247** (Verdadeiros Negativos) | **8.433** (Falsos Positivos) |
| **Real: Fraude (1)** | **7.879** (Falsos Negativos) | **99.679** (Verdadeiros Positivos) |

> **Diagnóstico:** O modelo apresenta um equilíbrio quase perfeito entre a minimização de perdas financeiras (7.879 fraudes perdidas) e a minimização de custos operacionais/atrito (8.433 alertas falsos).

### 1.3. Importância das Features (Permutation Importance)

A análise de importância confirma que o modelo atua primariamente como um detector de anomalias financeiras e temporais.

1.  **valor_transacao (~75%):** Feature dominante. O valor é o principal discriminador.
2.  **data_transacao (~12%):** O contexto temporal (hora do dia, dia da semana) é o segundo fator mais relevante.
3.  **finalidade_pix_id (~6.5%):** O propósito da transação.

**Features Irrelevantes:** Variáveis como `pagador_saldo` e `recebedor_valor_ultima_1h` tiveram impacto próximo de zero no modelo binário final.

---

## 2. Desempenho do Modelo Multiclasse (Tipificador)

O segundo estágio classifica a fraude em categorias específicas (Engenharia Social, Triangulação, etc.) e é executado apenas para transações suspeitas.

### 2.1. Métricas e Generalização

* **F1-Score Macro:** 0.88
* **Generalização:** A diferença (gap) entre o F1-Score de Treino e Validação foi de apenas **0.0004**, indicando **Baixíssima Variância** (ausência de overfitting).

### 2.2. Performance por Classe (Curva ROC OvR)

O modelo mantém alta performance em todas as classes, mas com variações de dificuldade.

| Classe de Fraude | AUC (One-vs-Rest) | Diagnóstico |
| :--- | :--- | :--- |
| **Engenharia Social** | **0.9961** | Classe mais fácil de identificar (Recall de 0.96). |
| **Consolidação de Fundos** | **0.9816** | Alta discriminação. |
| **Valor Atípico** | **0.9794** | Alta discriminação. |
| **Triangulação (Conta Laranja)** | **0.9651** | Classe mais difícil, com maior confusão de fronteira. |

### 2.3. Análise de Erros e Limitações

O modelo cometeu um total de 13.132 erros de classificação no conjunto de teste. A análise detalhada revela onde as fronteiras de decisão são frágeis.

**Principais Confusões (Matriz de Erros):**

1.  **Real: Valor Atípico** $\rightarrow$ **Predito: Triangulação** (21.4% dos erros).
2.  **Real: Triangulação** $\rightarrow$ **Predito: Consolidação de Fundos** (15.1% dos erros).
3.  **Real: Valor Atípico** $\rightarrow$ **Predito: Consolidação de Fundos** (13.8% dos erros).

> **Diagnóstico:** O modelo tende a confundir fraudes complexas (Triangulação e Valor Atípico) com a classe "Consolidação de Fundos". Isso sugere uma sobreposição de características no espaço vetorial dessas classes.

### 2.4. Perfil das Transações Erradas

A análise estatística dos erros mostra que o modelo tem dificuldade específica com transações de alto valor desproporcional ao saldo.

* **Valor Médio da Transação Errada:** R$ 4.082,45 (Alto valor).
* **Relação Valor/Saldo:** Em média, as transações erradas representam **17.9x** o saldo do pagador.

### 2.5. Importância das Features (Multiclasse)

Diferente do modelo binário, o modelo multiclasse depende de características do perfil do cliente para diferenciar os tipos de fraude.

1.  **pagador_data_nascimento (~25%):** Feature mais crítica. A idade é determinante para separar "Engenharia Social" (focada em idosos) de outras fraudes.
2.  **data_transacao (~17%):** Padrões de horário.
3.  **valor_transacao (~15%):** Magnitude do roubo.
4.  **recebedor_num_pagadores_unicos_24h (~10%):** Crucial para identificar "Consolidação de Fundos" (Fan-In).

---

## 3. Conclusão e Próximos Passos

### Diagnóstico Final
A arquitetura em cascata provou ser eficaz e pronta para produção. O **Modelo Binário** atua como um filtro robusto e seguro, enquanto o **Modelo Multiclasse** oferece granularidade operacional com alta precisão, apesar de dificuldades pontuais em classes complexas.

### Recomendações de Otimização

1.  **Feature Engineering (Multiclasse):** Criar features que melhorem a separação entre `valor_atipico` e `triangulacao`, focando na relação não-linear entre o valor da transação e o histórico de saldo.
2.  **Simplificação:** Remover features com importância nula (ex: `pagador_natureza_id` no binário) para reduzir custo computacional sem perda de performance.
3.  **Tratamento de Fronteira:** Investigar as transações de "Consolidação de Fundos" para reduzir o viés de predição (superestimação) desta classe.