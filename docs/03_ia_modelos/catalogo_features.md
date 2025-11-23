
# Catalogo de Features

(`transacoes_db.feature_store.in_live_features`) é a fonte única de verdade para os atributos utilizados tanto no treinamento dos modelos quanto na inferência em tempo real. Ela consolida dados cadastrais (perfil), contexto técnico do arranjo PIX e deriva métricas comportamentais complexas baseadas no histórico transacional.

## 1. Linhagem e Origem dos Dados

As features são construídas a partir da unificação de três domínios de dados da camada refinada (*Gold/Copper*):



1.  **Fluxo Transacional:** Histórico de eventos financeiros, utilizado para cálculos de janelas deslizantes e tendências.
2.  **Dimensão Conta:** Dados de saldo e datas de abertura, essenciais para cálculo de risco de crédito e idade da conta.
3.  **Dimensão Cliente:** Dados demográficos (Data de Nascimento, Natureza Jurídica) fundamentais para a detecção de Engenharia Social.

---

## 2. Dicionário de Dados

As variáveis estão organizadas por categoria analítica.

### 2.1. Perfil Estático (Entidades)
Atributos cadastrais e de estado associados às partes envolvidas (Pagador e Recebedor) no momento da transação.

| Nome da Feature | Tipo | Descrição Funcional | Relevância para Fraude |
| :--- | :--- | :--- | :--- |
| `pagador_saldo` | Decimal | Saldo disponível na conta de origem. | Crítico para calcular o comprometimento financeiro (esvaziamento de conta). |
| `recebedor_saldo` | Decimal | Saldo atual da conta de destino. | Contas laranjas costumam ter saldo próximo a zero antes do ataque. |
| `pagador_data_nascimento` | Date | Data de nascimento do cliente pagador. | **Alta**: Variável principal para identificar vítimas de golpes contra idosos. |
| `recebedor_data_nascimento` | Date | Data de nascimento do cliente recebedor. | Ajuda a identificar laranjas jovens ou perfis sintéticos. |
| `[pagador/recebedor]_natureza_id` | Int | Classificação da entidade (1=PF, 2=PJ). | Estabelece o padrão de movimentação esperado (CNPJ movimenta mais que CPF). |
| `[pagador/recebedor]_tipo_conta_id` | Int | Modalidade (Corrente, Poupança, Pagamento). | Contas de pagamento são vetores comuns para contas descartáveis. |
| `[pagador/recebedor]_conta_aberta_em`| Timestamp | Data original de abertura da conta. | Base para o cálculo da idade da conta. |
| `recebedor_idade_conta_dias` | Int | Tempo de vida da conta de destino (em dias). | Detecta contas "laranjas" recém-criadas para receber golpes. |
| `pagador_idade_conta_dias` | Int | Tempo de vida da conta de origem (em dias). | Contas antigas tendem a ser vítimas legítimas; novas tendem a ser fraudadoras. |

### 2.2. Contexto da Transação (Categóricas)
Atributos técnicos do arranjo PIX que descrevem o método de iniciação e propósito.

| Nome da Feature | Tipo | Descrição Funcional | Relevância |
| :--- | :--- | :--- | :--- |
| `tipo_iniciacao_pix_id` | Int | Método de entrada (Chave, QR Code, Manual, etc.). | **Média**: Fraudes de Engenharia Social usam frequentemente Chave Manual ou Aleatória. |
| `finalidade_pix_id` | Int | Propósito declarado (Transferência, Compra, Retirada). | Contextualiza se o valor faz sentido para aquela finalidade. |

### 2.3. Comportamento Temporal (Janelas Deslizantes)
Métricas que capturam o padrão de uso recente, calculadas sobre janelas de tempo móveis (ex: últimas 24h).

| Nome da Feature | Janela | Lógica de Negócio | Objetivo da Detecção |
| :--- | :--- | :--- | :--- |
| `pagador_txs_ultimas_24h` | 24h | Frequência de uso diário do pagador. | Identificar mudança repentina de hábito (muitas transações em pouco tempo). |
| `pagador_valor_ultimas_24h` | 24h | Volume financeiro total movido pelo pagador. | Detectar fuga de capital atípica. |
| `recebedor_txs_ultima_1h` | 1h | Intensidade de recebimento recente no destino. | Detectar "contas de passagem" em ataques coordenados (*burst*). |
| `recebedor_valor_ultima_1h` | 1h | Volume financeiro recebido na última hora. | Identificar contas que estão agregando fundos rapidamente (*Fan-In*). |
| `pagador_segundos_desde_ultima_tx` | Lag | Tempo decorrido desde a operação anterior. | Intervalos humanos vs. autômatos (Bots operam em milissegundos). |

### 2.4. Relacionamento e Grafos
Variáveis que descrevem a força da conexão histórica entre a Origem e o Destino.



| Nome da Feature | Tipo | Descrição Funcional | Objetivo da Detecção |
| :--- | :--- | :--- | :--- |
| `primeira_interacao` | Bool | Indica se é a primeira vez que estas contas interagem. | **Alerta**: A vasta maioria das fraudes ocorre em primeiras interações. |
| `pagador_interacoes_com_recebedor` | Int | Contagem histórica de transferências entre o par. | Estabelece um "score de confiança" baseado na recorrência. |
| `recebedor_num_pagadores_unicos_24h` | Int | Quantidade de pessoas diferentes que enviaram dinheiro para este destino hoje. | **Crítico**: Detecta topologia de "Consolidação de Fundos" (Muitos para Um), típica de lavagem de dinheiro. |

### 2.5. Indicadores de Anomalia (Ratios)
Razões matemáticas normalizadas para identificar *outliers* financeiros.

| Nome da Feature | Fórmula Conceitual | Descrição |
| :--- | :--- | :--- |
| `valor_vs_media_pagador_30d` | $Valor / Média_{30d}$ | Quantas vezes o valor atual supera a média mensal do usuário. Valores altos indicam desvio de perfil. |
| `valor_vs_saldo_pagador` | $Valor / Saldo$ | Percentual do saldo comprometido na operação. Valores $>1.0$ (uso de cheque especial) são fortes indícios de esvaziamento. |

### 2.6. Variáveis Alvo (Targets)
Rótulos históricos utilizados exclusivamente para o treinamento supervisionado (ignorados ou nulos durante a inferência).

| Nome da Coluna | Tipo | Descrição | Uso |
| :--- | :--- | :--- | :--- |
| `transacao_fraudulenta` | Int (0/1) | Classificação Binária (Legítimo vs. Fraude). | Alvo do Modelo 1 (Filtro de Risco). |
| `tipo_fraude` | String | Categoria da Fraude (ex: 'engenharia_social'). | Alvo do Modelo 2 (Tipificador). |

---

## 3. Lógica de Engenharia de Features

### 3.1. Tratamento de Tempo e Precisão
Para garantir a precisão necessária na detecção de ataques automatizados (bots), todas as janelas temporais são calculadas com precisão de **segundos**. As datas são convertidas internamente para *Unix Timestamp* antes do processamento das janelas deslizantes.

### 3.2. Cardinalidade em Janelas (Unique Count)
O cálculo de `recebedor_num_pagadores_unicos_24h` utiliza uma abordagem de agregação baseada em conjuntos (*Sets*). Isso permite contar a cardinalidade distinta de origens dentro de uma janela móvel, algo essencial para identificar contas que funcionam como "caixa centralizador" de fraudes (Topologia *Fan-In*).

### 3.3. Robustez Matemática (Tratamento de Ratios)
As features de razão (*Ratios*) possuem mecanismos de defesa contra inconsistências matemáticas:
* **Contas Novas:** Se o usuário não possui histórico suficiente (média de 30 dias zerada), a feature de desvio de perfil retorna um valor tratado, evitando erros de divisão por zero.
* **Saldo Zerado:** O mesmo tratamento é aplicado para cálculos envolvendo saldo.

### 3.4. Prevenção de Vazamento de Dados (Data Leakage)
Todas as métricas históricas (médias, contagens e somas) são calculadas utilizando uma janela estrita de **exclusão do evento atual**.
* *Lógica:* As agregações consideram do tempo `T - Janela` até `T - 1 segundo`.
* *Motivo:* Isso impede que a própria transação que está sendo analisada influencie a média histórica, o que mascararia anomalias e enviesaria o treinamento do modelo.