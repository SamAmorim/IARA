# Arquitetura de Cloud

A implantacao da solucao utiliza servicos **Azure** e e projetada para garantir escalabilidade, seguranca e isolamento de rede.


![Arquitetura_de_Cloud](Arquitetura_cloud.png)


![Diagrama da Arquitetura de Cloud](assets/image.png)

| Componente | Servico Azure Correspondente | Funcao na Solucao |
| :--- | :--- | :--- |
| **Frontend** | Azure Web App (ou similar) | Hospeda a aplicacao de simulacao (React). |
| **Backend (PixApi)** | Azure Virtual Machine (ou App Service) | Hospeda o servico **Spring Boot** para a simulacao de transacoes. |
| **Servico de Analise (AnaliseApi)** | **Azure Functions** (Python) | Executa o motor de IA (*serverless*), ideal para responder a eventos de baixa latencia. |
| **Banco de Dados** | Azure MySQL | Armazenamento persistente de dados de clientes, contas e transacoes. |
| **Rede/Seguranca** | Load Balancer, OpenVPN, Blob Storage | Gerencia o trafego, garante a seguranca da rede e armazena grandes volumes de dados/artefatos de ML. |