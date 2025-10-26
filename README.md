# 🚀 Detecção de Fraudes Financeiras com IA

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-v1.0.0--dev-blue)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-green)

![GitHub Stars](https://img.shields.io/github/stars/SamAmorim/Fraud-Finder-Pix?style=social)
![GitHub Forks](https://img.shields.io/github/forks/SamAmorim/Fraud-Finder-Pix?style=social)
![GitHub Issues](https://img.shields.io/github/issues/SamAmorim/Fraud-Finder-Pix)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/SamAmorim/Fraud-Finder-Pix)

<br>

![Java](https://img.shields.io/badge/Backend-Java-orange)
![Python](https://img.shields.io/badge/Data%20Science-Python-blue)
![Databricks](https://img.shields.io/badge/Platform-Databricks-red)
![MySQL](https://img.shields.io/badge/Database-MySQL-lightblue)
![IA](https://img.shields.io/badge/AI-ML%20Model-green)

---

## ▶️ Como Rodar o Projeto

## 📌 Descrição Geral do Projeto

- Projeto para **detectar fraudes em transações PIX** usando um modelo de **Inteligência Artificial** integrado a um **simulador de transações em Java**.
- O sistema analisa as operações em tempo real, estima a probabilidade de fraude e decide se deve aprovar ou bloquear a transação.

---

## 🎯 Objetivos

- ✅ Detectar fraudes financeiras com foco em PIX.
- ✅ Integrar IA ao fluxo de transações **antes da liquidação**.

---

## 🗄️ Dados Públicos do BACEN

O modelo é inspirado em **dados oficiais** de alta escala, usados para criar uma base sintética realista:

| **Tabela** | **Registros** |
| :--- | ---: |
| 🔑 **chaves_pix** | 91.459.726 |
| 🏙️ **transacoes_pix_por_municipio** | 2.873.892 |
| 📈 **estatisticas_transacoes_pix** | 5.624.483 |

Esses dados permitem definir a **linha de base legítima** e injetar padrões de fraude para treinamento do modelo.

---

## 🏗️ Arquitetura do Sistema

- 📊 **Dados** → análise descritiva + geração de dados sintéticos.
- 🧠 **IA** → modelo de classificação treinado para distinguir *legítimo x fraude*.
- ⚙️ **Feature Engineering** → valor, frequência, horário, recorrência de chaves, dispositivos, etc.
- 💻 **Simulador (Java)** → recebe os dados da transação, consulta a IA e retorna score + decisão.
- 🗄️ **MySQL** → persistência e histórico de transações.

---

## 📌 Estratégia

1. 🔎 Explorar dados públicos do BACEN.
2. 🏗️ Criar base sintética com padrões de fraude e legítimos.
3. 🧠 Treinar e validar o modelo de IA.
4. 💻 Integrar ao simulador em Java para prevenção em tempo real.

---

## 🌲 Estrutura de Branches

- `main` → versão estável e pronta para produção.
- `Data-Analysis` → análise, limpeza e geração de dados sintéticos.
- `AI-Engineering` → desenvolvimento, feature engineering e validação do modelo.
- `Software-Development` → simulador em Java + integração com banco de dados.

![graphviz.png](imgs/graphviz.png)
![graphviz (1).png](imgs/graphviz_(1).png)
![graphviz (2).png](imgs/graphviz_(2).png)
![graphviz (4).png](imgs/graphviz_(4).png)
![graphviz (3).png](imgs/graphviz_(3).png)

---

# Modelagem estatística

Esta documentação descreve os modelos estatísticos e as regras probabilísticas utilizadas para gerar um conjunto de dados sintético de transações PIX, destinado ao treinamento de modelos de Inteligência Artificial para detecção de fraudes. A geração é baseada em estatísticas macroeconômicas (derivadas do BACEN) e injeta comportamentos de agentes (clientes, contas) e eventos (transações, fraudes) através de amostragens de distribuições estatísticas.

### 1. Macroeconomia do Ecossistema Gerador (Volume e escala)

A escala do universo sintético é definida a partir de dados empíricos do BACEN.

#### Número de clientes PF ou PJ por município:

$N_{pf} = \\max\\Big(1, \\Big\\lfloor \\frac{V_{pf\\_anual} \\cdot f_{escala}}{T_{esperado} \\cdot 12} \\Big\\rfloor \\Big)$

$N_{pj} = \\max\\Big(1, \\Big\\lfloor \\frac{V_{pj\\_anual} \\cdot f_{escala}}{T_{esperado} \\cdot 12} \\Big\\rfloor \\Big)$

> 📌
>
> **Interpretação estatística:** modelo determinístico de primeira ordem. O número de agentes não é aleatório, mas decorre diretamente do volume observado e de uma hipótese comportamental.
>
> ”O Número de clientes Pessoa Física ou Pessoa Juridica é igual ao maior valor entre um e a parte inteira (arredondada para baixo) do resultado da divisão do Volume anual de transações de PF (escalado) pela quantidade de Transações esperadas por cliente no ano todo.”
>
> ---

- Onde:
  - $V_{pf\_anual}$ ou $V_{pj\_anual}$: volume anual de transações por PF ou PJ (dado empirico vindo do BACEN).
  - $f_{escala}$: `FATOR_ESCALA_VOLUME` (parâmetro de escala definido por uma porcentagem).
  - $T_{esperado}$: `TX_POR_CLIENTE_ESPERADO` (suposição sobre a atividade do cliente)
    - Se **DIMINUIR** esse valor (Clientes menos ativos):
      - Como a `TX_POR_CLIENTE_ESPERADO` está no denominador, diminuí-la faz o resultado da divisão **AUMENTAR**.
      - **Consequência:** **MAIS clientes precisam ser gerados** para conseguir gerar o mesmo volume total de transações definido pelo BACEN.
      - **Atividade Média Real:** Como o volume total de transações é fixo e agora temos *mais* clientes, a atividade média real de cada cliente gerado será **MENOR**.
    - Se **AUMENTAR** esse valor (Clientes mais ativos)
      - Aumentar o denominador faz o resultado da divisão **DIMINUIR**.
      - **Consequência:** **MENOS clientes precisam ser gerados** para gerar o mesmo volume de transações do BACEN.
      - **Atividade Média Real:** Com *menos* clientes gerando o mesmo volume total, a atividade média real de cada cliente será **MAIOR**.
    - **`TX_POR_CLIENTE_ESPERADO`:** É a sua **hipótese inicial** ou **meta**. É o número que *você* diz ao script: "Eu *espero* que, em média, cada cliente faça X transações por mês". O script usa essa hipótese para calcular quantos clientes ele precisa criar.
    - **Atividade Média Real:** É o **resultado final** que acontece *depois* que o script roda e gera todos os dados. É a **média real** de quantas transações cada cliente *efetivamente realizou* no seu dataset sintético.

#### Volume mensal de transações:

$V_{mensal} = \\lfloor V_{mensal\\_original} \\cdot f_{escala} \\rfloor$

> 📌
>
> ”O volume de eventos (transação) a serem gerados é escalonamento determinado dos dados empíricos”

## 2. Geração de Clientes e Contas (População/Agentes)

As características dos agentes (clientes e contas) são modeladas como variáveis aleatórias, seguindo regras estatísticas para simular um comportamento realista.

### Data de Nascimento (PF) e Fundação (PJ):

Modelada como uma Distribuição Uniforme Contínua dentro de intervalos de idade/tempo de atividade plausíveis.

$D_{nasc\\,(PF)} \\sim U[D_{hoje} - 80\\,\\text{anos},\\; D_{hoje} - 18\\,\\text{anos}]$

$D_{fund\\,(PJ)} \\sim U[D_{hoje} - 20\\,\\text{anos},\\; D_{hoje} - 1\\,\\text{ano}]$

### Número de Contas por Cliente:

Modelado como uma Distribuição Uniforme Discreta, condicional à natureza do cliente.

$N_{contas\\,|(PF)} \\sim U\\{1, 2\\}$

$N_{contas\\,|(PJ)} \\sim U\\{1, 2, 3, 4, 5\\}$

> 📌
>
> Um cliente PF terá 1 ou 2 contas (50% de chance cada). Um cliente PJ terá entre 1 e 5 contas (20% de chance cada).

![image.png](imgs/image.png)

![image.png](imgs/image%201.png)

### Definição do Risco da Conta (R):

A primeira característica definida para uma nova conta é o seu perfil de risco. Isso é modelado como uma variável aleatória de Bernoulli, $R$. Esta variável decide se a conta será classificada como "Alto Risco" (mais provável de ser usada em fraudes) ou "Risco Normal".

$R \\sim \\text{Bernoulli}(p_{risco})$

**Onde:**

- $R$: Variável aleatória representando o risco. Assume valor 1 (Alto Risco) ou 0 (Risco Normal).
- $p_{risco}$: Parâmetro de probabilidade, definido pela variável de configuração `PROB_CONTA_ALTO_RISCO` (ex: 0.03). Representa a chance da conta ser classificada como de Alto Risco.

**Matematicamente**: $P(R = 1) = p_{risco}$

> 📌
>
> A variável aleatória $R$ (Risco) segue a distribuição de Bernoulli, com a probabilidade de sucesso (Alto Risco) definida pelo parâmetro $p_{risco}.$

### **Data de Abertura da conta (Modelo de Mistura Condicional)**

A data de abertura da conta, $D_{abertura}$, é modelada como uma **mistura de distribuições uniformes**. A distribuição específica de onde a data será amostrada é condicional a duas variáveis aleatórias independentes: o Risco da Conta ($R$) e a Era da Conta ($T_{pix}$}).

**1. Componentes do Modelo**

**Variáveis Aleatórias (Bernoulli):**

- **Risco da Conta ($R$):**
  - $R \\sim \\text{Bernoulli}(p_{risco})$
- **Era da Conta ($T_{pix}$):**
  - $T_{pix} \\sim \\text{Bernoulli}(p_{pos\\_pix})$
    - $T_{pix}=1$: A conta é "Pós-PIX" (criada após o lançamento do sistema).
    - $T_{pix}=0$: A conta é "Pré-PIX" (criada antes do lançamento do sistema).
  - $p_{pos\_pix} = \text{`PESO\_CONTAS\_POS\_PIX`}$ (ex: 0.70).
- **Datas de Referência (Constantes):**
  - $D_{limite}$: Primeiro dia do `ANO_ESTATISTICA` (ex: 01/01/2023).
  - $D_{pix}$: Data oficial de lançamento do PIX (16/11/2020).
  - $D_{recente}$: $D_{limite} - 180 \\text{ dias}$.

**2. Modelo de Amostragem (Distribuições Uniformes)**

A data $D_{abertura}$ é amostrada de uma das quatro distribuições a seguir, com base nos resultados de $R$ e $T_{pix}$:

**Caso 1: Conta de Risco Normal ($R=0$)**

- Se $T_{pix}=0$ (Pré-PIX): $D_{abertura} \\sim U\\,[D_{limite} - 10\\,\\text{anos},\\; D_{pix}]$
- Se $T_{pix}=1$ (Pós-PIX): $D_{abertura} \\sim U\\,[D_{pix},\\; D_{limite}]$

**Caso 2: Conta de Alto Risco ($R=1$)**

- Se $T_{pix}=0$ (Pré-PIX): $D_{abertura} \\sim U\\,[D_{recente},\\; D_{pix}]$
- Se $T_{pix}=1$ (Pós-PIX): $D_{abertura} \\sim U\\,[D_{pix},\\; D_{limite}]$

> 📌
>
> O parâmetro `PESO_CONTAS_POS_PIX` força com que a maioria (ex: 70%) das contas, tanto normais quanto de risco, tenham sido criadas após o lançamento do PIX.
>
> Contas de Alto Risco ($R=1$) são sempre forçadas a serem mais recentes (criadas no intervalo $[D_{recente}, D_{limite}]$), enquanto contas normais ($R=0$) podem ser muito mais antigas (até 10 anos).

![image.png](imgs/image%202.png)

![image.png](imgs/image%203.png)

### Saldo Inicial da Conta

O saldo inicial da conta, $S_{conta}$, é modelado usando a **Distribuição Log-Normal**.

**Definição dos Parâmetros:**
Os parâmetros $\\mu$ (parâmetro de localização, mean do log) e $\\sigma$ (parâmetro de escala/forma, **sigma** do log) da distribuição são definidos condicionalmente à natureza do cliente:

- **Para Pessoa Física (PF)**
  - $\\mu = 6.0$
  - $\\sigma = 1.5$
- **Para Pessoa Jurídica (PJ):**
  - $\\mu = 9.0$
  - $\\sigma = 1.8$

![image.png](imgs/image%204.png)

> 📌
>
> **O $\\mu$ maior para PJ** (9.0 vs 6.0) desloca o centro da distribuição para a direita, garantindo que os saldos de PJ sejam, em geral, **significativamente mais altos** que os de PF.
> **O $\\sigma$ maior para PJ** (1.8 vs 1.5) torna a distribuição mais "espalhada", refletindo uma **maior variação e desigualdade** entre os saldos das contas de empresas.

### Geração de Chaves PIX

A geração de chaves PIX é modelada por dois componentes:

1.  **Data de cadastro** (quando foi criada)
2.  **Tipo de chave** (qual é a chave)

---

**Data de Cadastro da Chave**

A data de cadastro ($D_{chave}$) é definida como um *offset* ($\\Delta_{dias}$) somado à data de abertura da conta ($D_{abertura}$):

$D_{chave} = D_{abertura} + \\Delta_{dias}$

O *offset* é amostrado de uma **Distribuição Uniforme Discreta**, condicional ao **Risco ($R$)** da conta:

- **Para Risco Normal ($R = 0$):**
  - $\\Delta_{dias} \\mid (R=0) \\sim U\\{1, \\dots, 90\\}$
- **Para Alto Risco ($R = 1$):**
  - $\\Delta_{dias} \\mid (R=1) \\sim U\\{1, \\dots, D_{max\\_risco}\\}$

**Onde:**

$D_{max\\_risco} = \\text{MAX\\_DIAS\\_CADASTRO\\_CHAVE\\_RISCO}$
(exemplo: 5 dias)

---

> 📌
>
> Este modelo simula um comportamento fraudulento comum: contas de **"laranjas"** (Alto Risco) cadastram suas chaves PIX quase imediatamente após a abertura (ex: em até 5 dias) para estarem prontas para uso, enquanto clientes legítimos (Risco Normal) podem levar até 3 meses.

## Geração de Transações (Eventos) - LOOP DE MUNICIPIO → loop MES

### Quando acontece uma transação

- Timestamp da transação (sem fraude): *quando* uma transação acontece

  $T_{tx} \\sim U\\,[T_{in\\'icio\\_m\\^es},\\; T_{fim\\_m\\^es}]$

> 📌
>
> Observação: a uniformidade temporal simples é refinada indiretamente pela lógica de fraude, que distorce a distribuição horária.

- Valor da transação como modelo de mistura:

  $V_{tx} = V_{base} \\cdot M$.

  $V_{base} \\sim \\text{Log-Normal}(\\mu_{valor},\\,\\sigma^2_{valor})$

- $V_{base}$: valor base da transação
- $M$: multiplicador discreto conforme o tipo de transação.

### **Definição do Multiplicador ($M$)**

Ajusta o valor base de acordo com a "natureza" da transação (Normal, Fraude, Outlier).
O código define um Multiplicador ($M$) com base nas seguintes regras:

- **Se a transação é Normal:** $M = 1$ (o valor base não muda).
- **Se a transação é um Outlier Legítimo:** $M$ recebe um valor fixo, moderadamente alto (ex: `2.5`). Isso simula uma compra grande, mas legítima. A chance disso acontecer é baixa (definida implicitamente no código por `np.random.rand(n) < 0.04`).
- **Se a transação é Fraude:** $M$ recebe um valor fixo, **muito alto** (ex: `30`, definido em `MULTIPLICADOR_MAGNITUDE_FRAUDE`). Isso faz com que o valor da fraude seja significativamente maior que o normal.

### **Geração do Valor Base ($V_{base}$)**

$V_{base} \\sim \\text{Log-Normal}(\\mu_{valor}, \\sigma^2_{valor})$

---

### Distribuição Geográfica (Intermunicipal)

O volume mensal ($V_{mensal}$) é dividido em **local** e **intermunicipal**:

$V_{intermunicipal} = \\lfloor V_{mensal} \\cdot p_{inter} \\rfloor$

$V_{local} = V_{mensal} - V_{intermunicipal}$

- $p_{inter} = \\text{PROBABILIDADE\\_TRANSACAO\\_INTERMUNICIPAL}$ (ex: 0.20)
- O município de destino de $V_{intermunicipal}$ é escolhido aleatoriamente via distribuição uniforme discreta entre os municípios já processados.

---

### Refinamento do Valor: Fraude "Abaixo do Radar"

**Descrição:** Subconjunto de fraudes que tenta não ser detectado, usando valores discretos pré-definidos ou pequenas transações.

Para simular fraudes evasivas, um subconjunto de transações fraudulentas ($F=1$) tem o valor **substituído** ao invés de multiplicado:

- Evento "Abaixo do Radar" $A$, com probabilidade:

  $P(A \\mid F=1) = p_{abaixo\\_radar} = \\text{PROBABILIDADE\\_ABAIXO\\_RADAR}$

- **Se $A=1$**, o valor é amostrado de uma Distribuição Uniforme Discreta de valores-limite:

  $V_{tx} \\mid (A = 1) \\sim U\\{\\text{VALORES\\_LIMITE\\_RADAR}\\}$

  ![image.png](imgs/image%205.png)

(Ex: $U\\{499.90, 999.90, 1999.90, 4999.90\\}$)

- **Se $A=0$**, aplica-se o modelo de mistura usual:

  $V_{tx} = V_{base} \\cdot M_{fraude}$

  ![image.png](imgs/image%206.png)

**Resumo do Fluxo de Geração de Transações:**

1. Determinar timestamp da transação: $T_{tx}$
2. Sortear valor base $V_{base} \\sim \\text{Log-Normal}(\\mu_{valor}, \\sigma_{valor}^2)$
3. Definir multiplicador $M$ conforme tipo (Normal / Outlier / Fraude)
4. Ajustar para fraudes "Abaixo do Radar" quando aplicável
5. Distribuir transação entre município local ou intermunicipal

## Geração de Fraudes (Modelo Preditivo Invertido)

A fraude não é totalmente aleatória; ela é gerada seguindo uma lógica condicional para criar sinais que o modelo de IA deve aprender a detectar.

### Probabilidade de Fraude com Lógica Sequencial Condicional.

Seja $F$ o evento fraude, $R$ conta destino de alto risco e $C$ chave PIX recente:

$$
P(F) =
\\begin{cases}
p_{risco} & \\text{se } R \\\\
p_{recente} & \\text{se } \\neg R \\text{ e } C \\\\
p_{base} & \\text{se } \\neg R \\text{ e } \\neg C
\\end{cases}
$$

Onde:

- $p_{risco}$: `PROBABILIDADE_FRAUDE_CONTA_DESTINO_RISCO` (ex: 0.60)
- $p_{recente}$: `PROBABILIDADE_FRAUDE_CHAVE_RECENTE` (ex: 0.40)
- $p_{base}$: `PROBABILIDADE_FRAUDE_BASE` (ex: 0.005)

**Ocorrência Final:**
$I_{fraude} \\sim \\text{Bernoulli}(P(F))$

**Tipo de Fraude Condicional a $F=1$:**

$P(T_{fraude} = k \\mid F=1) = p_k$

**Exemplos:**
$p_{\\text{valor\\_atipico}} = 0.30, \\quad p_{\\text{triangulacao\\_conta\\_laranja}} = 0.15, \\dots$

**Padrões Comportamentais:**

1.  **Valor Atípico**

    **Descrição:** Transações de valor muito maior ou menor que o normal do cliente, simulando compras incomuns.

2.  **Ataque de Madrugada**

    **Descrição:** Transações executadas em horários incomuns (1h–4h), simulando comportamento fraudulento automatizado.

    - Se $F = 1$, com probabilidade:
      - $p_{madrugada} = \\text{PROBABILIDA\\_DE\\_ATAQUE\\_MADRUGADA}$ (ex: 0.70)
      - A hora da transação é amostrada de uma distribuição uniforme discreta:
        - $H_{tx} \\sim U\\{1,2,3,4\\}$

        ![image.png](imgs/image%207.png)

3.  **Teste de Conta:**

    **Descrição:** Transações de baixo valor realizadas para verificar se a conta está ativa ou pronta para fraude futura.

    - Se $F = 1$, com probabilidade:
      - $p_{teste} = \\text{PROBABILIDADE\\_TESTE\\_CONTA} \\ (\\text{ex: } 0.30)$
    - Gerar um **evento adicional prévio de baixo valor**
    - **Valor do teste:**
      - $V_{teste} \\sim U[0.01, 1.00]$
    - **Tempo do teste:**
      $T_{teste} = T_{fraude} - \\Delta_t, \\quad \\Delta_t \\sim U\\{1, \\dots, 5\\} \\text{ minutos}$

### Modelagem de Fraudes em Cadeia (Triangulação/Laranja)

**Descrição:** Dispersão de fundos por meio de contas intermediárias (laranjas) para camuflar origem/destino.

Para simular a dispersão de fundos (`triangulacao_conta_laranja`), um **processo estocástico em árvore** é iniciado.

### Profundidade da Cadeia

A profundidade $D_{chain}$ (quantos níveis a fraude terá) é amostrada de uma **Distribuição Categórica**:

$D_{chain} \\sim \\text{Cat}(\\{2: 0.35, 3: 0.65\\})$

### Divisão de Valores (Fan-out)

- Número de sub-transações:
  $k = N_{sub} \\sim U\\{2,3,4,5\\}$
- Proporções das sub-transações via **Distribuição de Dirichlet**:

  $(p_1, \\dots, p_k) \\sim \\text{Dir}(\\alpha), \\quad \\alpha = (1, \\dots, 1)$

  $(v_1, \\dots, v_k) = (p_1 \\cdot V_{origem}, \\dots, p_k \\cdot V_{origem})$

> 📌
>
> Interpretação: Gera k proporções aleatórias que somam 1, simulando divisão irregular entre contas laranjas.

![image.png](imgs/image%208.png)

### Latência da Cadeia (Delay)

$\\Delta_{segundos} \\mid (N) \\sim U[60 \\cdot (N-1), 3600 \\cdot (N-1)]$

### Geração de Ruído Legítimo

Para camuflar a cadeia:

- Probabilidade de ruído:
  $p_{ruido} = \\text{PROB\\_RUIDO} \\ (\\text{ex: } 0.25)$
- Número de transações de ruído:
  $N_{ruido} \\sim U\\{1,2,3\\}$
- Valor do ruído:
  $V_{ruido} \\sim U[7.50, 75.00]$

![image.png](imgs/image%209.png)

### Modelo de Dados de Saída (Tabelas Geradas)

O *pipeline* de geração de dados sintéticos foi projetado para materializar os "agentes" e "eventos" em um modelo relacional simples, composto por quatro tabelas Delta principais. Todas as tabelas são armazenadas no *database* `transacoes_db.copper`.

### 1. `transacoes_db.copper.clientes`

- **Descrição:** Armazena a população de "agentes" Pessoa Física (PF) e Pessoa Jurídica (PJ). É a tabela raiz da qual dependem as contas e chaves.
- **Função de Geração:** `_gerar_clientes`
- **Principais Colunas Geradas:**
  - `id` (uuid): Chave primária única do cliente.
  - `nome` (string): Nome completo (PF) ou Razão Social (PJ).
  - `id_natureza` (int): 1 para PF, 2 para PJ.
  - `registro_nacional` (string): CPF ou CNPJ formatado.
  - `nascido_em` (date): Data de nascimento (PF) ou fundação (PJ).
  - `municipio_ibge` (int): Município de origem do cliente.

| id | nome | id_natureza | registro_nacional | nascido_em | estado_ibge | municipio_ibge |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 64991ac1-80ce-43b1-add2-7a95c866688e | Leonardo Moreira | 1 | 451.679.380-66 | 1990-02-24 | 23 | 2304400 |
| 799b21ed-1154-4530-baa1-0b7815aecd6a | Eloá Ferreira | 1 | 906.843.275-38 | 1968-09-26 | 23 | 2304400 |
| f1f2eb98-bee9-4263-816b-db8b596cc946 | Henry Nunes | 1 | 107.392.654-07 | 1989-02-07 | 23 | 2304400 |
| 3b950f03-fc29-49fe-aa6e-02ad299acbef | Dante Moreira | 1 | 067.912.853-03 | 1954-03-10 | 23 | 2304400 |
| 21dda2f3-187a-4500-9f3b-3238eb6899b5 | Sr. Ravy Casa Grande | 1 | 845.207.169-85 | 1990-11-20 | 23 | 2304400 |

### 2. `transacoes_db.copper.contas`

- **Descrição:** Armazena as contas bancárias associadas aos clientes. Cada cliente pode ter múltiplas contas. Esta tabela contém o sinal de "Alto Risco", que é fundamental para a lógica de fraude.
- **Função de Geração:** `_gerar_contas`
- **Dependências de Entrada:** `transacoes_db.copper.clientes`
- **Principais Colunas Geradas:**
  - `id` (uuid): Chave primária única da conta.
  - `id_cliente` (uuid): Chave estrangeira para `clientes.id`.
  - `saldo` (decimal): Saldo inicial (amostrado da Log-Normal).
  - `aberta_em` (date): Data de abertura (condicional ao risco).
  - `is_high_risk` (int): 1 se a conta foi marcada como "Alto Risco" (via Bernoulli), 0 caso contrário.

| id | saldo | aberta_em | agencia | numero | id_tipo_conta | ispb_instituicao | id_cliente | is_high_risk | estado_ibge | municipio_ibge |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 603ae08c-dfab-4dd1-af01-3f077f6242c3 | 426.96 | 2022-08-31 | 4187 | 71500-9 | 3 | 45331622 | fbf1252f-da40-4cd7-862f-4adbe54faa8b | 1 | 53 | 5300108 |
| 746bfa3d-8914-4734-97fc-17fef4b1e4be | 639.21 | 2018-06-27 | 6138 | 56819-1 | 2 | 18189547 | fbf1252f-da40-4cd7-862f-4adbe54faa8b | 0 | 53 | 5300108 |
| b392d417-ff05-47df-ac62-2b30a3150cc4 | 1905.09 | 2021-05-28 | 4779 | 77705-7 | 3 | 16501555 | 26ec9cc6-dace-4f60-900e-c403b539f22f | 0 | 53 | 5300108 |
| 62150e01-94ac-45aa-bb78-4a0f4cd80735 | 6140.06 | 2018-07-09 | 4102 | 84030-8 | 4 | 2507780 | 26ec9cc6-dace-4f60-900e-c403b539f22f | 0 | 53 | 5300108 |
| 89aa1177-56e3-415e-a03a-c6d95fddd986 | 18.82 | 2016-11-16 | 5162 | 27392-7 | 2 | 4079285 | 3cf4e464-9e50-4b9d-bc44-e0d3c108c178 | 0 | 53 | 5300108 |

### 3. `transacoes_db.copper.chaves_pix`

- **Descrição:** Armazena as chaves PIX associadas a cada conta. A data de cadastro desta chave (`cadastrada_em`) é um sinal crucial, pois seu *delta* em relação à data de abertura da conta é usado para definir a probabilidade de fraude.
- **Função de Geração:** `_gerar_chaves_pix`
- **Dependências de Entrada:** `transacoes_db.copper.contas`, `transacoes_db.copper.clientes`
- **Principais Colunas Geradas:**
  - `id` (uuid): Chave primária única da chave.
  - `id_conta` (uuid): Chave estrangeira para `contas.id`.
  - `chave` (string): O valor da chave (ex: e-mail, CPF, aleatória).
  - `id_tipo_chave` (int): Tipo da chave (CPF, e-mail, etc.).
  - `cadastrada_em` (timestamp): Data de cadastro (condicional ao risco da conta).

| id | chave | id_tipo_chave | cadastrada_em | id_conta | estado_ibge | municipio_ibge |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1de68e89-1de3-4b0a-8da1-0ace56a70203 | duartemanuella@example.net | 2 | 2021-06-01 | 0bbf13aa-d095-4945-91c0-28b47e095263 | 35 | 3509502 |
| 7e410408-5ac1-44c2-80cb-fe2186182683 | hlopes@example.org | 2 | 2017-12-12 | 9f6786a4-9b75-4067-914f-5c5599f98a53 | 35 | 3509502 |
| 44eb8273-2f48-439c-a015-13f2937289e7 | 24766133-dd61-45e1-b6d0-1391bf70739a | 4 | 2021-12-11 | 597d2b48-640b-4737-8b08-d972ff6a3ce5 | 35 | 3509502 |
| c29f7e73-ea18-4741-af5e-bb8e775ce532 | zfarias@example.org | 2 | 2020-10-31 | bf6029a8-b3b7-4f50-a9fc-40222fa485d4 | 35 | 3509502 |
| 17f7a85c-da8e-4b78-b083-e01d01e4f4fe | aragaovitor-hugo@example.com | 2 | 2021-10-30 | f18469d4-afff-4365-bdda-f15f36a1ae84 | 35 | 3509502 |

### 4. `transacoes_db.copper.transacoes`

- **Descrição:** A tabela de "eventos" principal. Contém todas as transações PIX, tanto legítimas quanto fraudulentas, com os sinais comportamentais (valor, horário, tipo de fraude) inseridos.
- **Função de Geração:** `gerar_transacoes` (orquestrador) e `_gerar_detalhes_transacao_python_vetorizado` (lógica principal).
- **Dependências de Entrada:** `transacoes_db.copper.contas` (para pares locais e destino intermunicipal), `transacoes_db.copper.chaves_pix` (para lógica de chave recente).
- **Principais Colunas Geradas:**
  - `id` (uuid): Chave primária única da transação.
  - `id_conta_origem` (uuid): Conta de origem.
  - `id_conta_destino` (uuid): Conta de destino.
  - `valor` (decimal): Valor final da transação.
  - `data` (timestamp): Data e hora da transação (com lógica de "Ataque de Madrugada" aplicada).
  - `is_fraud` (int): 0 (Legítima) ou 1 (Fraude).
  - `fraud_type` (string): Categoria da fraude (ex: `triangulacao_conta_laranja`, `teste_de_conta`).
  - `id_transacao_cadeia_pai` (uuid): Usada para vincular transações de dispersão (filhas) à fraude raiz.

## Resumo da Implementação (Código vs. Modelo)

| Modelo Estatístico | Implementação (Função/Parâmetro) |
| :--- | :--- |
| Nº Clientes (Determinístico) | `num_pf = max(1, int(volume_pf_anual / (TX_POR_CLIENTE_ESPERADO * 12)))` (Célula 4) |
| Nº Contas (Uniforme Discreta) | `F.floor(F.rand() * 2) + 1` ... `F.floor(F.rand() * 5) + 1` (`_gerar_contas`) |
| Risco Conta (Bernoulli) | `random.random() < config['PROB_CONTA_ALTO_RISCO']` (`_gerar_detalhes_conta_python_v2`) |
| Era Conta (Bernoulli) | `random.random() < config.get('PESO_CONTAS_POS_PIX', 0.5)` (`_gerar_detalhes_conta_python_v2`) |
| Data Abertura (Mistura Uniforme) | `if/else` aninhado usando `is_high_risk` e `is_pos_pix` (`_gerar_detalhes_conta_python_v2`) |
| Saldo (Log-Normal) | `np.random.lognormal(mean=6, sigma=1.5)` (`_gerar_detalhes_conta_python_v2`) |
| Data Chave (Uniforme Cond.) | `random.randint(1, config['MAX_DIAS_CADASTRO_CHAVE_RISCO'])` (`_gerar_detalhes_chave_udf_v2`) |
| Timestamp (Uniforme Cont.) | `pd.to_timedelta(np.random.uniform(0, delta_segundos, n), unit='s')` (`_gerar_detalhes_transacao_python_vetorizado`) |
| Prob. Fraude (Condicional) | `np.select([cond1, cond2], [p_risco, p_recente], default=p_base)` (`_gerar_detalhes_transacao_python_vetorizado`) |
| Ocorrência Fraude (Bernoulli) | `(np.random.rand(n) < prob_fraude_dinamica).astype(int)` (`_gerar_detalhes_transacao_python_vetorizado`) |
| Valor Base (Log-Normal) | `np.random.lognormal(mean=np.log(150), sigma=0.8, size=n)` (`_gerar_detalhes_transacao_python_vetorizado`) |
| Valor "Abaixo Radar" (Unif. Disc.) | `np.random.choice(config.get('VALORES_LIMITE_RADAR', ...), n)` (`_gerar_detalhes_transacao_python_vetorizado`) |
| Tipo Fraude (Categórica) | `np.random.choice(list(probs_tipo_fraude.keys()), ...)` (`_gerar_detalhes_transacao_python_vetorizado`) |
| Ataque Madrugada (Unif. Disc.) | `data_transacao.replace(hour=random.randint(1, 4), ...)` (`_aplicar_horario_suspeito`) |
| Divisão Cadeia (Dirichlet) | `np.random.dirichlet(np.ones(num_subs)) * valor_origem` (`_gerar_transacoes_em_cadeia`) |
| Delay Cadeia (Uniforme Cont.) | `random.uniform(60 * (nivel_atual-1), ...)` (`_gerar_transacoes_em_cadeia`) |

### Hiperparâmetros de Simulação

Esta seção define os valores e parâmetros de configuração centrais utilizados para gerar o ecossistema sintético.

| **Parâmetro** | **Chave de Configuração** | **Valor Padrão** | **Descrição** |
| :--- | :--- | :--- | :--- |
| Prob. Conta de Risco | `PROB_CONTA_ALTO_RISCO` | 0.03 | Probabilidade de uma nova conta ser classificada como "Alto Risco" (R=1). |
| Saldo PF ($\\mu$) | `SALDO_PF_MEAN` | 6.0 | Parâmetro de localização (média do log) para saldos de Pessoa Física. |
| Saldo PF ($\\sigma$) | `SALDO_PF_SIGMA` | 1.5 | Parâmetro de escala (sigma do log) para saldos de Pessoa Física. |
| Saldo PJ ($\\mu$) | `SALDO_PJ_MEAN` | 9.0 | Parâmetro de localização (média do log) para saldos de Pessoa Jurídica. |
| Saldo PJ ($\\sigma$) | `SALDO_PJ_SIGMA` | 1.8 | Parâmetro de escala (sigma do log) para saldos de Pessoa Jurídica. |
| Dias Chave (Normal) | `(hardcoded)` | 90 | Máximo de dias que um cliente normal leva para cadastrar uma chave PIX. |
| Dias Chave (Risco) | `MAX_DIAS_CADASTRO_CHAVE_RISCO` | 5 | Máximo de dias que um cliente de alto risco leva para cadastrar uma chave PIX . |

### Parâmetros de Geração de Eventos (Transações)

| **Parâmetro** | **Chave de Configuração** | **Valor Padrão** | **Descrição** |
| :--- | :--- | :--- | :--- |
| Prob. Intermunicipal | `PROBABILIDADE_TRANSACAO_INTERMUNICIPAL` | 0.20 | Proporção do volume total de transações que será destinada a outros municípios . |
| Valor Base ($\\mu_{log}$) | `(hardcoded)` | $np.log(150)$ | Parâmetro $\\mu$(média do log) para o valor base ($V_{base}$) da transação. |
| Valor Base ($\\sigma_{log}$) | `(hardcoded)` | 0.8 | Parâmetro $\\sigma$ (sigma do log) para o valor base ($V_{base}$) da transação. |
| Multiplicador Fraude | `MULTIPLICADOR_MAGNITUDE_FRAUDE` | 30.0 | Fator que multiplica o $V_{base}$ se a transação for uma fraude. |
| Multiplicador Outlier | `(hardcoded)` | 2.5 | Fator que multiplica o $V_{base}$ se a transação for um outlier legítimo. |
| Prob. Abaixo Radar | `PROBABILIDADE_ABAIXO_RADAR` | 0.40 | Probabilidade de uma fraude $(F=1)$ usar a estratégia "Abaixo do Radar" (do código). |
| Valores Abaixo Radar | `VALORES_LIMITE_RADAR` | `\\{499.90, 999.90, 1999.90, 4999.90\\}` | Valores discretos amostrados pela fraude "Abaixo do Radar". |

### Parâmetros de Lógica de Fraude

| **Parâmetro** | **Chave de Configuração** | **Valor Padrão** | **Descrição** |
| :--- | :--- | :--- | :--- |
| Prob. Fraude (Base) | `PROBABILIDADE_FRAUDE_BASE` | 0.005 | |
| Prob. Fraude (Chave) | `PROBABILIDADE_FRAUDE_CHAVE_RECENTE` | 0.40 | |
| Prob. Fraude (Risco) | `PROBABILIDADE_FRAUDE_CONTA_DESTINO_RISCO` | 0.60 | |
| Dias Chave Recente | `DIAS_CHAVE_CONSIDERADA_RECENTE` | 30 | Período em dias para uma chave ser considerada "recente" para fins de $P(F)$ (do código). |
| Prob. Ataque Madrugada | `PROBABILIDADE_ATAQUE_MADRUGADA` | 0.70 | Chance de uma fraude $(F=1)$ ter seu *timestamp* movido para 1h-4h da manhã. |
| Prob. Teste de Conta | `PROBABILIDADE_TESTE_CONTA` | 0.30 | Chance de uma fraude em cadeia gerar um evento "teste" prévio. |
| Profundidade Cadeia | `PROBS_PROFUNDIDADE` | `\\{2: 0.35, 3: 0.65\\}` | Distribuição Categórica para a profundidade da cadeia de fraude. |
| Fan-Out (Min/Max) | `(hardcoded)` | `(2, 5)` | $k \\sim U\\{2, 3, 4, 5\\}$. Número de sub-transações em cada nível da cadeia. |
| Prob. Ruído Cadeia | `PROB_RUIDO` | 0.25 | Probabilidade de adicionar transações de ruído legítimo em um nó da cadeia. |
| Contagem Ruído | `(hardcoded)` | $U\\{1, 2, 3\\}$ | |
| Valor Ruído | `(hardcoded)` | $U[7.50, 75.00]$ | |

## Conclusões

- **Forças:**
  - Distribuições log-normais para valores e saldos refletem fenômenos financeiros reais (distribuição de riqueza/valores).
  - Camadas de probabilidade condicional (risco da conta, recência da chave) criam sinais realistas e complexos para IA.
  - A modelagem de fraude em cadeia com distribuições de Dirichlet (para divisão) e Categórica (para profundidade) simula comportamentos de dispersão sofisticados.
- **Suposições e Limitações:**
  - **Independência entre variáveis:** O modelo atual não modela correlações complexas. Por exemplo, o saldo da conta de um cliente não influencia o valor das transações que ele origina ($V_{base}$ é independente).
  - **Estacionariedade:** Os parâmetros (ex: $p_{risco}$, valor médio) são fixos ao longo do ano. Um modelo mais avançado poderia considerar parâmetros que evoluem no tempo (não-estacionários) e dependências cruzadas entre agentes.
  - **Distribuição Geográfica Simplista:** A geração de transações intermunicipais é aleatória, selecionando qualquer município processado com probabilidade uniforme. Isso ignora a "gravidade" econômica do mundo real (ex: transações são muito mais prováveis entre grandes centros econômicos do que entre duas cidades pequenas aleatórias).
  - **Homogeneidade Comportamental:** Todos os agentes dentro de uma categoria (ex: PF) seguem as mesmas distribuições base. O modelo não gera "perfis" de clientes (ex: "jovem universitário" vs. "trabalhador de alta renda") que teriam padrões de transação fundamentalmente diferentes.

---

