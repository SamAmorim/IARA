A **Modelagem Estatística** e a **Lógica de Geração** criam o Ecossistema Sintético, fornecendo um *dataset* de transações PIX de alta fidelidade para o treinamento dos modelos de IA.

---

## 1. Macroeconomia do Ecossistema Gerador

O volume total de agentes (clientes) e eventos (transações) é determinado por um **modelo determinístico** baseado em dados empíricos do BACEN e parâmetros de escala.

### 1.1. Cálculo do Número de Clientes

O número de agentes ($N_{pf}$ ou $N_{pj}$) decorre diretamente do volume observado e de uma **hipótese comportamental** ($T_{esperado}$).

$$
N_{pf} = \max\Big(1, \Big\lfloor \frac{V_{pf\_anual} \cdot f_{escala}}{T_{esperado} \cdot 12} \Big\rfloor \Big)
$$

$$
N_{pj} = \max\Big(1, \Big\lfloor \frac{V_{pj\_anual} \cdot f_{escala}}{T_{esperado} \cdot 12} \Big\rfloor \Big)
$$

| Variável | Descrição |
| :--- | :--- |
| $V_{pf\_anual}$ ou $V_{pj\_anual}$ | Volume anual de transações por PF ou PJ (dado empírico vindo do BACEN). [cite: 208] |
| $f_{escala}$ | Parâmetro de escala definido por uma porcentagem. [cite: 209] |
| $T_{esperado}$ | Suposição sobre a **atividade esperada** do cliente (transações por mês). [cite: 210, 220] |

> **Nota sobre $T_{esperado}$:** Se diminuir o valor esperado ($T_{esperado}$), mais clientes precisam ser gerados para manter o volume total, resultando em uma Atividade Média Real **MENOR** por cliente. Se aumentar o valor, menos clientes são gerados, resultando em Atividade Média Real **MAIOR**. [cite: 211-219]

### 1.2. Volume Mensal de Transações

O volume de eventos (transação) a ser gerado é um escalonamento determinado dos dados empíricos. [cite: 225]

$$
V_{mensal} = \lfloor V_{mensal\_original} \cdot f_{escala} \rfloor
$$

---

## 2. Modelagem Estatística de Agentes (Clientes e Contas)

As características dos agentes são modeladas como variáveis aleatórias seguindo regras estatísticas para simular um comportamento realista. [cite: 227]

### 2.1. Idade e Tempo de Fundação (Uniforme Contínua)

| Agente | Variável | Distribuição | Intervalo (Idade/Tempo) |
| :--- | :--- | :--- | :--- |
| **Pessoa Física** | $D_{nasc\,(PF)}$ | Uniforme | Entre 18 e 80 anos de idade. [cite: 232, 237, 238] |
| **Pessoa Jurídica** | $D_{fund\,(PJ)}$ | Uniforme | Entre 1 e 20 anos de existência. [cite: 233, 242, 243] |

### 2.2. Distribuição de Contas (Uniforme Discreta)

O número de contas por cliente é condicional à natureza do cliente: [cite: 245]

* **PF:** $N_{contas\,|\,(PF)} \sim U\{1, 2\}$ (1 ou 2 contas, 50% de chance cada). [cite: 246, 248]
* **PJ:** $N_{contas\,|\,(PJ)} \sim U\{1, 2, 3, 4, 5\}$ (Entre 1 e 5 contas, 20% de chance cada). [cite: 247, 249]

### 2.3. Risco da Conta (Bernoulli)

O perfil de risco ($R$) é a primeira característica definida e determina se a conta será classificada como "Alto Risco" ou "Risco Normal". [cite: 287, 288]

$$
R \sim \text{Bernoulli}(p_{risco})
$$

* $R=1$ (Alto Risco) ou $R=0$ (Risco Normal). [cite: 291]
* $p_{risco}$ é a probabilidade de sucesso (Alto Risco), definida pela variável `PROB_CONTA_ALTO_RISCO` (ex: 0.03). [cite: 292]

### 2.4. Data de Abertura Condicional

A data de abertura da conta ($D_{abertura}$) é amostrada de forma estritamente **condicional ao Risco da Conta ($R$)**: [cite: 313]

* **Alto Risco ($R=1$):** Contas são **forçadas a serem recentes** (criadas nos últimos 6 meses). [cite: 325, 326]
* **Risco Normal ($R=0$):** Contas podem ser significativamente mais antigas (até 10 anos). [cite: 323, 327]

### 2.5. Saldo Inicial da Conta (Log-Normal)

O saldo inicial ($S_{conta}$) é modelado usando a **Distribuição Log-Normal**. [cite: 329] Os parâmetros são definidos condicionalmente à natureza do cliente para simular saldos mais altos para PJ. [cite: 332, 340]

| Cliente | $\mu$ (Localização) | $\sigma$ (Escala/Variação) |
| :--- | :--- | :--- |
| **Pessoa Física (PF)** | 6.0 [cite: 334] | 1.5 [cite: 335] |
| **Pessoa Jurídica (PJ)** | 9.0 [cite: 337] | 1.8 [cite: 338] |

---

## 3. Modelagem de Fraudes e Eventos

### 3.1. Valor da Transação (Modelo de Mistura)

O valor final da transação ($V_{tx}$) é o produto do **Valor Base** ($V_{base} \sim \text{Log-Normal}$) e um **Multiplicador** ($M$). [cite: 384, 385]

| Categoria | Multiplicador ($M$) | Lógica de Ocorrência |
| :--- | :--- | :--- |
| **Normal** | $M = 1$ | O valor base não muda. [cite: 391] |
| **Outlier Legítimo** | $M = 2.5$ (Fixo) | Ocorre com probabilidade de 4% ($\neg$ Fraude). [cite: 392, 397] |
| **Fraude** | $M = 30$ (Fixo, Alto) | Valor significativamente maior que o normal. [cite: 398, 399] |

### 3.2. Lógica Sequencial Condicional de Fraude ($P(\text{Fraude})$)

A **Probabilidade de Fraude** ($P(\text{Fraude})$) é determinada por uma **lógica sequencial e condicional** baseada em prioridade de risco: [cite: 429]

* **Prioridade 1 (Máxima):** Se o pagador for um **Alvo Vulnerável** ($A$: PF $\geq 55$ anos), $p_{alvo}=0.80$. [cite: 423, 424]
* **Prioridade 2:** Se não for Alvo Vulnerável ($\neg A$) e o destino for **Alto Risco** ($R$), $p_{risco}=0.60$. [cite: 425]
* **Prioridade 3:** Se $\neg A$, $\neg R$ e a **Chave PIX for Recente** ($C$), $p_{recente}=0.40$. [cite: 426, 427]
* **Prioridade 4 (Base):** Se nenhuma condição de risco for atendida, $p_{base}=0.35$. [cite: 428]

### 3.3. Padrões Comportamentais Injetados

Uma vez rotulada como fraude ($F=1$), a transação é classificada em um tipo, o que desencadeia padrões específicos: [cite: 467]

| Tipo de Fraude | Sinal Comportamental Injetado | Modelo Estatístico |
| :--- | :--- | :--- |
| **Engenharia Social** | Fraude de alto valor com $p_{alvo}$. [cite: 472] | Condição $A$. [cite: 472] |
| **Ataque de Madrugada** | Horário forçado para $H_{tx} \sim U\{1, 2, 3, 4\}$ (1h-4h). [cite: 472] | Uniforme Discreta. [cite: 472] |
| **Teste de Conta** | Transação prévia de **baixo valor** ($\sim U[0.01, 1.00]$) com pequeno *delay*. [cite: 472] | Uniforme Contínua/Discreta. [cite: 472] |
| **Abaixo do Radar** | Valor **substituído** por valores discretos (ex: 999.90, 1999.90). [cite: 527, 528] | Uniforme Discreta de valores-limite. [cite: 531] |

### 3.4. Fraudes em Cadeia (Topologia e Grafos)

As fraudes em cadeia são modeladas como **processos estocásticos em grafo** para camuflar o movimento de fundos. [cite: 484]

* **Triangulação (Fan-Out):** Fragmentação do valor (divisão) para múltiplos nós sucessores. [cite: 486, 502] A divisão é feita via **Distribuição de Dirichlet**. [cite: 503]
* **Consolidação (Fan-In):** Convergência de múltiplas arestas (origens $N_{fontes} \sim U[10, 30]$) em um único nó destino em uma janela de tempo curta ($\Delta_{segundos} \sim U[1, 600]$ segundos). [cite: 504, 506]

---

## 4. Modelo de Dados de Saída (Tabelas Delta)

O *pipeline* gera quatro tabelas Delta principais para materializar os agentes e eventos, armazenadas no *database* `transacoes_db.copper`. [cite: 561, 562]

| Tabela | Descrição | Sinais Cruciais para IA |
| :--- | :--- | :--- |
| **1. `clientes`** | População de agentes PF e PJ. [cite: 564] | `nascido_em` (para lógica de Alvo Vulnerável). [cite: 576] |
| **2. `contas`** | Contas bancárias. [cite: 580] | `is_high_risk`, `saldo`, `aberta_em`. [cite: 581, 587, 588, 589] |
| **3. `chaves_pix`** | Chaves associadas a contas. [cite: 595] | `cadastrada_em` (para lógica de Chave Recente). [cite: 605] |
| **4. `transacoes`** | Eventos PIX (Legítimas e Fraudulentas). [cite: 607] | `is_fraud`, `fraud_type`, `valor`, `data`, `id_transacao_cadeia_pai` (para análise de grafo). [cite: 616, 617, 618, 619, 620] |

---

## 5. Hiperparâmetros de Simulação

| Parâmetro | Chave de Configuração | Valor Padrão |
| :--- | :--- | :--- |
| Prob. Conta de Risco ($p_{risco}$) | `PROB_CONTA_ALTO_RISCO` | **0.05** [cite: 631] |
| Dias Chave (Alto Risco) | `MAX_DIAS_CADASTRO_CHAVE_RISCO` | **7** [cite: 631] |
| Saldo PF ($\mu$) | `SALDO_PF_MEAN` | 6.0 [cite: 631] |
| Multiplicador Fraude ($M$) | `MULTIPLICADOR_MAGNITUDE_FRAUDE` | **30.0** [cite: 633] |
| Prob. Abaixo Radar | `PROBABILIDADE_ABAIXO_RADAR` | 0.40 [cite: 633] |
| Prob. Fraude (Alvo $p_{alvo}$) | `PROBABILIDADE_FRAUDE_ENG_SOCIAL_ALVO` | **0.80** [cite: 638] |
| Idade Mínima Alvo (PF) | `IDADE_MINIMA_ALVO_ENG_SOCIAL` | **55** [cite: 638] |
| Profundidade Cadeia (Min/Max) | `FANOUT_MIN/MAX_PROFUNDIDADE` | **(2, 4)** [cite: 638] |