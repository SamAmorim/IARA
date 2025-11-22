# Estrutura de Saída (Modelo de Dados)

Esta seção detalha o modelo relacional simples que materializa os "agentes" e "eventos" gerados pelo *pipeline* sintético. O modelo é composto por quatro tabelas **Delta** principais, todas armazenadas no *database* `transacoes_db.copper`[cite: 561, 562].

---

## 1. `transacoes_db.copper.clientes`

Esta é a tabela raiz que armazena a população de "agentes" Pessoa Física (PF) e Pessoa Jurídica (PJ)[cite: 563, 564].

| Coluna | Tipo | Descrição | Funções na Análise |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Chave primária única do cliente. | |
| `nome` | `string` | Nome completo (PF) ou Razão Social (PJ). | |
| `id_natureza` | `int` | 1 para PF, 2 para PJ[cite: 574]. | Categorização do agente. |
| `registro_nacional` | `string` | CPF ou CNPJ formatado[cite: 575]. | |
| `nascido_em` | `date` | Data de nascimento (PF) ou fundação (PJ)[cite: 576]. | Usado para a lógica de **Alvo Vulnerável** (Engenharia Social)[cite: 423]. |
| `municipio_ibge` | `int` | Município de origem do cliente[cite: 577]. | Distribuição geográfica. |

---

## 2. `transacoes_db.copper.contas`

Armazena as contas bancárias associadas aos clientes. Esta tabela é crucial por conter o sinal de "Alto Risco"[cite: 579, 581].

| Coluna | Tipo | Descrição | Lógica de Geração/Fraude |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Chave primária única da conta[cite: 585]. | |
| `id_cliente` | `uuid` | Chave estrangeira para a tabela `clientes`[cite: 586]. | Vínculo com o agente. |
| `saldo` | `decimal` | Saldo inicial (amostrado da **Log-Normal**)[cite: 587]. | Base para o cálculo da *feature* `valor_vs_saldo_pagador`[cite: 1083]. |
| `aberta_em` | `date` | Data de abertura (condicional ao risco)[cite: 588]. | Usada na lógica de **idade da conta**. |
| `is_high_risk` | `int` | 1 se a conta foi marcada como **"Alto Risco"** (via Bernoulli), 0 caso contrário[cite: 589]. | Sinal fundamental para a lógica de probabilidade de fraude ($P(F)$)[cite: 425]. |

---

## 3. `transacoes_db.copper.chaves_pix`

Armazena as chaves PIX. A data de cadastro desta chave é um sinal crucial, pois seu *delta* em relação à data de abertura da conta é usado para definir a probabilidade de fraude[cite: 594, 595].

| Coluna | Tipo | Descrição | Lógica de Geração/Fraude |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Chave primária única da chave[cite: 599]. | |
| `id_conta` | `uuid` | Chave estrangeira para a tabela `contas`[cite: 600]. | |
| `chave` | `string` | O valor da chave (ex: e-mail, CPF, aleatória)[cite: 602]. | |
| `id_tipo_chave` | `int` | Tipo da chave (CPF, e-mail, etc.)[cite: 604]. | |
| `cadastrada_em` | `timestamp` | Data de cadastro (condicional ao risco da conta)[cite: 605]. | Usada para definir a condição de **Chave Recente** ($C$)[cite: 426]. |

---

## 4. `transacoes_db.copper.transacoes`

Esta é a tabela de "eventos" principal. Contém todas as transações PIX, tanto legítimas quanto fraudulentas, com os sinais comportamentais inseridos[cite: 606, 607].

| Coluna | Tipo | Descrição | Funções na Análise de IA/Grafos |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Chave primária única da transação[cite: 612]. | |
| `id_conta_origem` | `uuid` | Conta de origem[cite: 613]. | Nó Pagador. |
| `id_conta_destino` | `uuid` | Conta de destino[cite: 614]. | Nó Recebedor. |
| `valor` | `decimal` | Valor final da transação[cite: 616]. | Feature mais importante para o modelo binário[cite: 1106]. |
| `data` | `timestamp` | Data e hora da transação[cite: 617]. | Usada para extrair o `hora_do_dia` e aplicar lógica de **Ataque de Madrugada**[cite: 617, 710]. |
| `is_fraud` | `int` | 0 (Legítima) ou 1 (Fraude)[cite: 618]. | **Target** do Modelo Binário. |
| `fraud_type` | `string` | Categoria da fraude (ex: `engenharia_social`, `teste_de_conta`)[cite: 619]. | **Target** do Modelo Multiclasse. |
| `id_transacao_cadeia_pai` | `uuid` | Usada para vincular transações de dispersão (filhas) à fraude raiz[cite: 620]. | Permite a reconstrução de **Grafos** (Fan-Out/Fan-In)[cite: 509]. |