# IARA: Inteligência Antifraude e Risco Automatizada

## Sumário

Este documento serve como a documentação técnica completa do projeto IARA, abordando desde a geração de dados sintéticos até a arquitetura de software e avaliação dos modelos de Inteligência Artificial.

(O menu de navegação à esquerda é construído automaticamente pelo MkDocs, use-o para navegar entre as seções detalhadas.)

## Equipe

* **Samuel Amorim:** Modelagem Estatística, Engenharia de Dados, Ciência de Dados
* **Leonardo Rondam:** Análise de Dados
* **Nicholas Campanelli:** Desenvolvimento de Software
* **Rodrigo Genaro:** Arquitetura de Cloud

## Proposta

A construção de um sistema robusto e ponta-a-ponta para a detecção de fraudes PIX em tempo real, superando a principal barreira do setor: a escassez de dados públicos representativos.

### Pilares da Solução

| **Ecossistema de Dados Sintéticos** | **Modelo de AI em Cascata** | **Ambiente de Simulação** |
| :--- | :--- | :--- |
| Estamos construindo um universo financeiro sintético. Este ecossistema replica com precisão estatística o comportamento de clientes (PF/PJ), contas e, crucialmente, simula padrões complexos de fraude baseados em **dados reais do BACEN** – incluindo triangulação, engenharia social e ataques em cadeia. Este ambiente nos permite gerar os dados necessários para desenvolver e testar soluções robustas. | Desenvolvemos uma arquitetura de inteligência artificial de dois estágios, projetada para eficiência e precisão. Primeiro, um Classificador Binário atua como um filtro, identificando transações potencialmente fraudulentas. Em seguida, apenas as transações sinalizadas ativam um **Tipificador Multiclasse** mais detalhado, que categoriza o tipo específico de fraude (ex: engenharia social, ataque em cadeia), permitindo respostas mais direcionadas. | Para garantir a eficácia e a viabilidade da nossa solução, validaremos todo o sistema em um ambiente que replica fielmente o cenário de produção. Utilizando uma **arquitetura de microsserviços** na **nuvem**, um **simulador** gera transações contínuas, que são analisadas e verificadas em tempo real por um **serviço de IA** (o "motor antifraude"). Isso demonstra a capacidade da nossa solução de funcionar de forma robusta e escalável no mundo real. |