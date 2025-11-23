# IARA: Inteligência Antifraude e Risco Automatizada

**Ecossistema de Dados Sintéticos e Detecção de Fraudes PIX em Tempo Real**

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=flat-square)
![Versão](https://img.shields.io/badge/Versão-v1.0.0_dev-blue?style=flat-square)
![Licença](https://img.shields.io/badge/Licença-MIT-green?style=flat-square)

![Java](https://img.shields.io/badge/Backend-Java-orange?logo=openjdk&style=flat-square)
![TensorFlow](https://img.shields.io/badge/AI-TensorFlow-orange?logo=tensorflow&style=flat-square)
![Databricks](https://img.shields.io/badge/Platform-Databricks-red?logo=databricks&style=flat-square)
![Azure](https://img.shields.io/badge/Cloud-Azure-0078D4?logo=microsoftazure&style=flat-square)

---

## Sobre o Projeto

O projeto **IARA** é uma solução completa para a segurança no arranjo de pagamentos PIX. O sistema opera sob uma arquitetura de microsserviços na nuvem, utilizando modelos de **Deep Learning em Cascata** para classificar transações em milissegundos.

O grande diferencial do IARA é a superação da barreira de dados bancários protegidos por sigilo: desenvolvemos um motor de **simulação estatística** que gera um ecossistema financeiro sintético de alta fidelidade (Lakehouse), permitindo o treinamento de modelos capazes de detectar tipologias complexas como *Engenharia Social* e *Lavagem de Dinheiro*.

### Principais Funcionalidades

* **Geração de Dados Sintéticos:** Simulação de milhões de agentes (PF/PJ) com comportamento estatístico real.
* **Detecção em Cascata:**
    1.  **Filtro de Risco:** Modelo Binário (Alta Sensibilidade e Recall).
    2.  **Tipificador:** Modelo Multiclasse (Categorização do tipo de ataque).
* **Topologias de Fraude:** Detecção de grafos complexos (Triangulação e Consolidação).
* **Tempo Real:** Inferência via Azure Functions com baixa latência.

---

## Stack Tecnológica

O projeto utiliza uma arquitetura moderna distribuída em camadas de dados, inteligência e aplicação.

| Camada | Ferramentas Principais |
| :--- | :--- |
| **Lakehouse e Data Gen** | ![Databricks](https://img.shields.io/badge/-Databricks-red?logo=databricks) ![PySpark](https://img.shields.io/badge/-PySpark-orange?logo=apache-spark) ![Delta Lake](https://img.shields.io/badge/-Delta%20Lake-E82C24?logo=databricks) |
| **Machine Learning** | ![TensorFlow](https://img.shields.io/badge/-TensorFlow-FF6F00?logo=tensorflow) ![Keras](https://img.shields.io/badge/-Keras-D00000?logo=keras) ![Scikit-learn](https://img.shields.io/badge/-Scikit--learn-F7931E?logo=scikit-learn) |
| **Backend e API** | ![Java](https://img.shields.io/badge/-Java-orange?logo=openjdk) ![Spring Boot](https://img.shields.io/badge/-SpringBoot-brightgreen?logo=springboot) ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql) |
| **Frontend e Cloud** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react) ![Azure Functions](https://img.shields.io/badge/-Azure%20Functions-0078D4?logo=microsoftazure) |

---

## A Equipe

Especialistas responsáveis pela construção do ecossistema e arquitetura.

| Especialista | Papel e Foco | Contato |
| :--- | :--- | :--- |
| **Samuel Amorim** |  Modelagem estatística, Engenharia de Dados e Data Science | [LinkedIn](https://www.linkedin.com/in/samamorim/) |
| **Nicholas Campanelli** | Engenheiro de Software (Fullstack) | [LinkedIn](https://www.linkedin.com/in/campanellinicc/) |
| **Rodrigo Genaro** | Arquiteto de Cloud (Azure e DevOps) | [LinkedIn](https://www.linkedin.com/in/rodrigo-genaro-8713b726b/) |
| **Leonardo Rondam** | Analista de Dados (Insights) | [LinkedIn](https://www.linkedin.com/in/leonardo-rondam-910ba5214/) |