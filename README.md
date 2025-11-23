# IARA - Inteligência Antifraude e Risco automática

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-v1.0.0--dev-blue)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-green)

### 🛠️ Tecnologias Principais
![Java](https://img.shields.io/badge/Backend-Java-orange?logo=openjdk)
![Spring](https://img.shields.io/badge/Framework-SpringBoot-brightgreen?logo=springboot)
![Python](https://img.shields.io/badge/Data%20Science-Python-blue?logo=python)
![Databricks](https://img.shields.io/badge/Platform-Databricks-red?logo=databricks)
![PySpark](https://img.shields.io/badge/BigData-PySpark-orange?logo=apache-spark)
![TensorFlow](https://img.shields.io/badge/AI-TensorFlow-orange?logo=tensorflow)
![Keras](https://img.shields.io/badge/AI-Keras-red?logo=keras)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Azure](https://img.shields.io/badge/Cloud-Azure-0078D4?logo=microsoftazure)

---

## 📌 Descrição Geral do Projeto


![ACESSE A DOCUMENTAÇÂO COMPLETA](https://samamorim.github.io/IARA/)

O PIX revolucionou as transações, mas trouxe consigo um desafio crescente: a sofisticação das fraudes.  
Este projeto apresenta um sistema ponta-a-ponta para **detecção de fraudes PIX em tempo real**.

Como dados de fraude são raros e sigilosos, criamos um **Ecossistema de Dados Sintéticos** completo, replicando comportamentos de clientes PF/PJ e simulando padrões avançados de ataques.

Em cima dessa fundação, implementamos uma arquitetura de **Inteligência Artificial em Cascata**, composta por um modelo Binário (detecção de risco) seguido por um modelo Multiclasse (tipificação da fraude).

---

## 🚀 Demonstração (Simulador em Ação)

Um simulador em **Java (Spring)** e **React** envia transações contínuas para o motor de IA.  
O modelo binário classifica a transação em milissegundos e, quando necessário, o modelo multiclasse identifica o tipo de fraude.

---

## 🏗️ Pilares Estratégicos

### 1. O Ecossistema de Dados Sintéticos  
Construímos um pipeline em Python/Databricks capaz de gerar:

* Clientes com renda e saldo baseados em **Distribuição Log-normal**
* Contas de risco (contas laranja) usando **Distribuição de Bernoulli**
* Transações com padrões reais e comportamentos fraudulentos modelados estatisticamente  

### 2. Inteligência Artificial em Cascata  
Arquitetura composta por:

**1. Modelo Binário (Filtro Rápido)**  
Classificador de risco focado em **alto recall**.

**2. Modelo Multiclasse (Tipificador)**  
Executado apenas quando o binário acusa suspeita, identificando golpes como:  
Engenharia Social, Fan-Out, Fan-In, Valor Atípico e outros.

### 3. Simulador em Produção  
Aplicação em **Java + React** rodando em ambiente **Azure**, utilizando:

* Load Balancer  
* Sub-redes públicas e privadas  
* Banco MySQL em subnet isolada  
* Microsserviços de IA  

---

## 🧠 Modelagem dos Vetores de Ataque

A IA é treinada para identificar padrões como:

### • Engenharia Social  
Golpes direcionados a perfis vulneráveis.

### • Valor Atípico  
Transações muito acima da média ou **abaixo do radar** (ex: 499,90).

### • Triangulação / Conta Laranja (Fan-Out)  
Divisão irregular de valores usando **Distribuição de Dirichlet**.

### • Consolidação de Fundos (Fan-In)  
Várias contas enviando para um único destino em poucos segundos.

---

## 🛠️ Tecnologias Aplicadas

| Categoria | Tecnologias |
| :--- | :--- |
| **Ecossistema de Dados Sintéticos** | Databricks, Delta Lake, PySpark, Python, SQL, Faker |
| **Inteligência Artificial** | Keras, TensorFlow, Scikit-learn, MLflow, Power BI, NumPy, Pandas |
| **Simulador de Transações** | Java, Spring Boot, Hibernate, React, Azure Functions, Azure MySQL |

---

## 🌲 Estrutura de Branches

- `main` → Versão estável e pronta para produção.  
- `Data-Analysis` → Geração/análise de dados sintéticos.  
- `AI-Engineering` → Treinamento e avaliação dos modelos.  
- `Software-Development` → Simulador Java/React + integração.  

---

## ▶️ Como Rodar o Projeto

O sistema possui 3 partes:

1. **Pipeline de Dados** – Databricks/Spark  
2. **Motor de IA** – Python  
3. **Simulador** – Java + React  

### Backend Java
```bash
cd Software-Development/
mvn spring-boot:run
