## Arquitetura de Software

A arquitetura logica e baseada em microsservicos e segue um fluxo de chamadas sincrona HTTP/REST, permitindo a separacao de responsabilidades entre as camadas de transacao e de analise de IA.

--- 
![alt text](Arquitetura_de_software.svg)

### 1. Camada Frontend
| Componente | Funcao | Tecnologias |
| :--- | :--- | :--- |
| **App (Frontend)** | Aplicacao frontend que proporciona um ambiente virtual que auxilia a **simulacao de transacoes**. | React (Vite). |

### 2. Camada de API (Backend)

| Componente | Funcao | Fluxo de Dados |
| :--- | :--- | :--- |
| **PixApi** | Servico **RESTful** para simular transacoes PIX. Ele gerencia o fluxo de transacoes e contas, persistindo dados no Banco de Dados. | Recebe requisicoes HTTP/REST e persiste via **CRUD (JPA/MySQL)**. |
| **AnaliseApi** | Servico focado em **analisar dados de transacoes PIX** e detectar transacoes fraudulentas. Ele e o motor antifraude que executa a logica de IA. | E invocado pela `PixApi` (cliente HTTP) para a predicao. |

---

## Fluxo da Deteccao de Fraude (Cascata)

O fluxo se inicia quando a **PixApi** recebe uma requisicao de transacao e, antes de finaliza-la no banco, invoca a **AnaliseApi** para a predicao em tempo real.

| Passo | Componente | Acao Principal |
| :--- | :--- | :--- |
| 1. Transacao | `App` $\rightarrow$ `PixApi` | Envio dos dados da transacao (via HTTP/REST). |
| 2. Analise | `PixApi` $\rightarrow$ `AnaliseApi` | Invocacao do servico de analise (cliente HTTP/REST). |
| 3. Predicao | `AnaliseApi` (Azure Function) | Carrega modelos de **Keras/TensorFlow** e executa o **pipeline de inferencia em cascata**. |
| 4. Persistencia | `PixApi` $\rightarrow$ Banco de Dados | Salva a transacao e o resultado da analise (fraude ou legitima). |


