# Especificação Técnica: Modelagem Estatística e Estocástica

Este documento detalha as distribuições de probabilidade, funções determinísticas e processos estocásticos utilizados para compor o "Universo Financeiro Sintético" do projeto IARA. A geração de dados segue o paradigma de **Modelo Preditivo Invertido**, onde comportamentos latentes (causas) são definidos *a priori* para gerar observáveis transacionais (efeitos).



## Resumo das Características Modeladas

### 1. Agentes e Entidades (Estado Estático)
* **Volumetria Populacional:** Função determinística baseada em dados macroeconômicos (BACEN) e pressão de atividade ($T_{esperado}$).
* **Demografia (Idade/Fundação):** Distribuição Uniforme Contínua ($\mathcal{U}[a, b]$) para datas de nascimento e fundação.
* **Densidade de Contas:** Distribuição Uniforme Discreta condicionada à natureza jurídica (PF/PJ).
* **Risco Latente da Conta ($R$):** Variável Aleatória de Bernoulli ($p=0.05$) determinando contas "laranjas".
* **Saldo Inicial ($S$):** Distribuição Log-Normal condicionada à natureza jurídica ($\mu, \sigma$) para simular desigualdade de riqueza.
* **Temporalidade de Abertura:** Distribuição Uniforme condicionada ao Risco ($R$); contas fraudulentas são recentes.
* **Latência de Chave Pix:** Distribuição Uniforme Discreta condicionada ao Risco ($R$); fraudadores operam com imediatismo.

### 2. Eventos e Dinâmica (Transações)
* **Sazonalidade Temporal:** Amostragem Categórica Ponderada (Dias Úteis/Fins de Semana) e Uniforme Contínua (Horários).
* **Valor Transacional ($V_{tx}$):** Modelo de Mistura (*Mixture Model*) composto por uma Log-Normal Base multiplicada por Fatores de Magnitude Discretos.
* **Causalidade de Fraude ($P(F)$):** Árvore de Decisão Probabilística Hierárquica baseada em vetores de risco (Alvo, Destino, Chave).
* **Topologia de Lavagem (Fan-Out):** Processo de Ramificação Estocástica com Partição de Valor via Distribuição de Dirichlet.
* **Topologia de Consolidação (Fan-In):** Convergência Temporal Uniforme em Janela Curta (Ataque Coordenado).

---

## Detalhamento da Modelagem

### 1. Modelagem Macro-Estrutural (População)

A escala do ecossistema é ancorada na realidade econômica. O número de agentes ($N$) para um determinado município não é aleatório, mas uma função do Volume Financeiro Anual ($V_{anual}$) daquela região reportado pelo Banco Central.

**Função Geradora de População:**

$$
N_{agentes} = \max\left(1, \left\lfloor \frac{V_{anual} \cdot f_{escala}}{T_{esperado} \cdot 12} \right\rfloor\right)
$$

Onde:
* **$f_{escala}$**: Fator de redução do dataset (amostragem).
* **$T_{esperado}$**: Atividade média mensal esperada por cliente.



---

### 2. Modelagem Micro-Atributiva (Agentes)

Cada agente é instanciado com atributos estocásticos que definem seu perfil comportamental.

#### 2.1. Risco Latente ($R$)
Propriedade fundamental para a injeção de fraudes. Define se uma conta pertence a um usuário legítimo ou a um laranja/fraudador.

$$
R \sim \text{Bernoulli}(p_{risco})
$$

* **Se $R=1$ (Sucesso):** A conta assume comportamento de alto risco (abertura recente, cadastro rápido de chaves).
* **Parâmetro padrão:** $p_{risco} = 0.05$.

#### 2.2. Capacidade Financeira (Saldo)
O saldo inicial ($S_{conta}$) modela a disparidade de riqueza utilizando uma **Distribuição Log-Normal**. Os parâmetros são ajustados condicionalmente à natureza do cliente (Pessoa Física vs. Jurídica) para garantir que empresas tenham, em média, maior liquidez e variância.

$$
S_{conta} \sim \text{Log-Normal}(\mu, \sigma^2)
$$

| Natureza | Parâmetros ($\mu, \sigma$) | Característica |
| :--- | :--- | :--- |
| **Pessoa Física** | $\mu=6.0, \sigma=1.5$ | Distribuição padrão de varejo. |
| **Pessoa Jurídica** | $\mu=9.0, \sigma=1.8$ | Cauda longa (saldos multimilionários). |

![](imgs/saldos_iniciais.png)

#### 2.3. Temporalidade Condicional
A "idade" da conta e das chaves Pix não é aleatória, mas dependente do Risco ($R$).

* **Data de Abertura ($D_{abertura}$):**
    * *Baixo Risco ($R=0$):* Histórico longo (até 10 anos).
        $$D \sim \mathcal{U}[D_{hoje}-3650, D_{limite}]$$
    * *Alto Risco ($R=1$):* Histórico curto (últimos 6 meses).
        $$D \sim \mathcal{U}[D_{hoje}-180, D_{limite}]$$

* **Latência de Cadastro de Chave ($\Delta_{chave}$):**
    Tempo decorrido entre a abertura da conta e o cadastro da chave.
    * *Alto Risco ($R=1$):* Imediatismo operacional.
        $$\Delta \sim \mathcal{U}\{1, \dots, 7\} \text{ dias}$$
    * *Baixo Risco ($R=0$):* Comportamento orgânico.
        $$\Delta \sim \mathcal{U}\{1, \dots, 90\} \text{ dias}$$


![](imgs/distribuicao_data_abertura.png)
---

### 3. Física das Transações (Eventos)

A geração de cada transação é um evento independente modelado por um sistema de mistura de distribuições (*Mixture Model*).

#### 3.1. O Modelo de Valor ($V_{tx}$)
O valor final não é amostrado de uma única distribuição, mas composto por um valor base estocástico e um multiplicador determinístico de contexto ($M$).

$$
V_{tx} = V_{base} \cdot M
$$

1.  **Componente Estocástico ($V_{base}$):** Segue uma Log-Normal global.
    $$V_{base} \sim \text{Log-Normal}(\ln(150), 0.8^2)$$

1.  **Componente Determinístico ($M$):**
    $$
    M = \begin{cases}
    1 & \text{Transação Normal} \\
    2.5 & \text{Outlier Legítimo } (p=0.04) \\
    30.0 & \text{Fraude Padrão}
    \end{cases}
    $$

![](imgs/dist_valores_finais.png)

#### 3.2. Mecanismo "Abaixo do Radar"
Para simular fraudes que tentam burlar regras de limite, uma sub-rotina substitui a distribuição contínua por valores discretos de limiar com probabilidade $P_{radar}=0.40$ (dado que é fraude).

$$
V_{tx}|(Radar=1) \sim \mathcal{U}\{999.90, 499.90, 1999.90\}
$$

---

### 4. Motor de Causalidade (Probabilidade de Fraude)



A decisão de marcar uma transação como fraudulenta ($F=1$) segue uma lógica hierárquica de prioridades baseada no vetor de contexto $\mathbf{x}$.

$$
P(F)=\begin{cases}p_{alvo}&se~A\\ p_{risco}&se\neg A~e~R\\ p_{recente}&se\neg A~e\neg R~e~C\\ p_{base}&se\neg A~e\neg R~e\neg C\end{cases}
$$




| Prioridade | Condição ($\mathbf{x}$) | Prob. ($P$) | Descrição |
| :--- | :--- | :--- | :--- |
| **1** | **Alvo Vulnerável** (Idade Pagador $\ge$ 55) | $0.80$ | Engenharia Social contra idosos. |
| **2** | **Destino de Risco** (Conta Destino $R=1$) | $0.60$ | Transferência para laranja. |
| **3** | **Chave Recente** (Cadastro $\le$ 15 dias) | $0.40$ | Chaves descartáveis. |
| **4** | **Base** (Nenhuma condição acima) | $0.35$ | Fraude de oportunidade. |

O rótulo final é amostrado de $I_F \sim \text{Bernoulli}(P(F|\mathbf{x}))$.



---

### 5. Topologias de Grafo Estocástico

Para fraudes complexas (Lavagem de Dinheiro), o sistema gera sub-grafos com propriedades estatísticas controladas.

#### 5.1. Triangulação (Fan-Out)
Simula a dispersão de fundos de um nó para múltiplos laranjas.

* **Estrutura de Árvore:** Profundidade $D \sim \mathcal{U}\{2, 4\}$ e Largura $k \sim \mathcal{U}\{2, 5\}$.
* **Partição de Valor (Dirichlet):** A divisão do valor do nó pai ($V_{pai}$) para os $k$ filhos segue uma distribuição de Dirichlet Simétrica, garantindo soma 1 e assimetria realista.
    $$
    (p_1, \dots, p_k) \sim \text{Dir}(\mathbf{\alpha}), \quad \text{onde } \mathbf{\alpha} = \mathbf{1}
    $$
    $$
    V_{filho_i} = V_{pai} \cdot p_i
    $$
* **Delay Temporal:** Introduz latência progressiva baseada na profundidade do nível ($L$).
    $$\Delta t \sim \mathcal{U}[60 \cdot (L-1), 3600 \cdot (L-1)]$$

![](imgs/fan-out.svg)

#### 5.2. Consolidação (Fan-In)
Simula a agregação de fundos em uma conta mestre.

* **Fontes:** Número de nós origem $N \sim \mathcal{U}\{10, 30\}$.
* **Janela Temporal:** Convergência forçada em intervalo curto.
    $$\Delta t \sim \mathcal{U}[1, 600] \text{ segundos}$$



---

### 6. Tipologias Comportamentais Específicas

Além das topologias de grafo, o sistema modela padrões comportamentais individuais baseados em regras condicionais para simular vetores de ataque comuns.

#### 6.1. Engenharia Social (Golpe do Idoso)
Simula a indução da vítima ao erro.
* **Filtro de Alvo ($A$):** Apenas pagadores com `Idade` $\ge 55$ anos.
* **Probabilidade:** Altíssima prioridade na árvore de decisão ($P=0.80$).
* **Comportamento:** Transações de valor moderado a alto, sem padrão de horário noturno forçado.

#### 6.2. Ataque de Madrugada (Automação)
Simula invasão de conta ou coação noturna.
* **Trigger:** Probabilidade condicional $P_{madrugada} = 0.70$ (dado que é fraude).
* **Modificação Temporal:** Se ativado, o *timestamp* da transação é forçado para uma distribuição uniforme discreta na janela crítica.
    $$H_{tx} \sim \mathcal{U}\{01, 02, 03, 04\} \text{ (Horas)}$$



#### 6.3. Teste de Conta (Ping)
Simula a verificação de validade de uma conta laranja antes do ataque principal.
* **Trigger:** Ocorre com $P=0.30$ antes de uma fraude em cadeia.
* **Valor ($V_{teste}$):** Micro-transação.
    $$V_{teste} \sim \mathcal{U}[0.01, 1.00] \text{ BRL}$$
* **Latência:** Ocorre minutos antes da transação principal.
    $$\Delta t \sim \mathcal{U}\{1, \dots, 5\} \text{ minutos}$$

---

![alt text](imgs/Valores.png)

### 7. Hiperparâmetros de Simulação (Configuração Global)

A estabilidade estatística do universo sintético é controlada por um conjunto de constantes globais (hiperparâmetros).

| Parâmetro | Valor Padrão | Descrição Estatística |
| :--- | :--- | :--- |
| `PROB_CONTA_ALTO_RISCO` | `0.05` | Parâmetro $p$ da Bernoulli para geração de contas laranjas ($R$). |
| `MAX_DIAS_CADASTRO_CHAVE_RISCO` | `7` | Limite superior da Uniforme para latência de chave em contas $R=1$. |
| `SALDO_PF_MEAN` | `6.0` | Média ($\mu$) da Log-Normal para saldo de Pessoa Física. |
| `SALDO_PJ_MEAN` | `9.0` | Média ($\mu$) da Log-Normal para saldo de Pessoa Jurídica. |
| `PROB_FRAUDE_BASE` | `0.35` | *Baseline* da probabilidade de fraude ($P(F)$) sem agravantes. |
| `MULTIPLICADOR_MAGNITUDE_FRAUDE` | `30.0` | Fator determinístico $M$ para valores fraudulentos. |
| `PROB_ABAIXO_RADAR` | `0.40` | Probabilidade de substituição da Log-Normal por valores discretos. |
| `VALORES_LIMITE_RADAR` | `[999.9, ...]` | Espaço amostral discreto para fraudes "Abaixo do Radar". |