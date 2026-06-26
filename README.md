DOCUMENTAÇÃO TÉCNICA: PAIKAUHALE SOFTWARE

Módulo: Cálculo de Insumos para Drywall (v1.0)
Data: Junho de 2026
1. Visão Geral do Sistema

O Paikauhale Software é uma aplicação web Full-Stack projetada para automatizar e otimizar o cálculo de insumos na construção a seco (Drywall). O sistema recebe parâmetros físicos do ambiente e cruza com tabelas de preços em tempo real, fornecendo orçamentos precisos de materiais, mitigando falhas humanas na elaboração de propostas comerciais.
2. Arquitetura de Nuvem (Microserviços)

A infraestrutura foi desenhada separando completamente a camada de apresentação da camada de processamento e dados.

    Front-end (Interface da Calculadora e Painel):

        Tecnologias: React, TypeScript, Vite.

        Estilização: CSS Customizado (Paleta Industrial/Dark Mode).

        Hospedagem: Netlify (Borda global).

        Comunicação: Axios para consumo assíncrono da API.

    Back-end (Motor Lógico):

        Tecnologias: Node.js, TypeScript, Express.

        Segurança: Configuração rigorosa de CORS e variáveis de ambiente (Secrets).

        Hospedagem: Render (Instância isolada em Ohio).

    Banco de Dados (Persistência):

        Tecnologias: PostgreSQL gerenciado via Prisma ORM.

        Hospedagem: Neon Serverless (Data center em São Paulo).

3. Lógica de Negócios e Variáveis

O sistema processa as seguintes variáveis de entrada inseridas pelo usuário na interface:

    Comprimento e Altura (m): Define a área total da parede.

    Tipo de Placa: ST (Standard), RU (Resistente à Umidade) ou RF (Resistente ao Fogo).

    Faces (1 ou 2): Quantidade de lados da parede que receberão o chapeamento.

    Espaçamento dos Montantes: 40 cm (maior rigidez) ou 60 cm (padrão).

Com base nesses dados, a API processa a matemática estrutural e devolve:

    Quantidade de Placas necessárias.

    Quantidade de Guias (Perfil U).

    Quantidade de Montantes (Perfil C).

    Quantidade de Parafusos.

    Custo Estimado de Materiais (integrado ao banco de preços dinâmicos).

4. Gerenciamento e Painel Administrativo

O acesso à gestão de preços não depende de refatoração de código. O sistema conta com uma rota/estado administrativo (Admin.tsx) protegido no fluxo de renderização.

    Funcionalidade: Permite a leitura (GET) e a atualização (PUT/POST) dos valores unitários de cada insumo diretamente no banco de dados Neon.

    Reflexo Imediato: Qualquer alteração no painel recalibra instantaneamente os próximos cálculos realizados pela calculadora de frente de caixa.

5. Estratégia de Deploy e Escalabilidade

O software opera atualmente sob a doutrina de Deploy por Instância (Single-Tenant manual). Cada cliente B2B recebe uma infraestrutura espelhada e fisicamente isolada (um banco de dados próprio, um servidor Node.js próprio e um link Netlify exclusivo). Isso garante:

    Total isolamento e segurança dos dados e preços do cliente.

    Performance máxima sem concorrência de processamento de terceiros.

    Rápida inserção no mercado com zero atrito de reengenharia de código.
