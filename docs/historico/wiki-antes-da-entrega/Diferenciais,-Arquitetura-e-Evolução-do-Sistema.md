

# Diferenciais, Arquitetura e Evolução do Sistema

## Diferenciais e referências de experiência

Durante o desenvolvimento da proposta do MediSync, foram utilizadas referências de plataformas conhecidas para orientar a experiência de utilização e a organização de algumas funcionalidades.

Essas referências servem exclusivamente como inspiração de interface e experiência do usuário. Não representam parcerias, integrações ou vínculos comerciais com os serviços mencionados.

| Referência da P1 | Padrão utilizado como inspiração | Aplicação no MediSync |
| --- | --- | --- |
| LinkedIn | Organização de perfis profissionais. | Foto, capa, formação, experiência, CRM, especialidades e serviços do médico. |
| WhatsApp | Comunicação direta e familiar. | Conversas, confirmações de leitura, silenciamento e notificações. |
| Uber | Avaliação da experiência entre participantes. | Avaliações entre médico e paciente após a realização da consulta. |

O principal diferencial da proposta é reunir esses recursos em um único ambiente, conectando as informações ao mesmo atendimento. Dessa forma, o médico pode gerenciar consultas, acessar dados dos pacientes e manter a comunicação dentro da mesma plataforma.

As referências utilizadas não representam uma comparação de desempenho ou superioridade em relação às plataformas existentes.

## Escopo do MVP e evolução

MVP (Produto Mínimo Viável) é a primeira versão de um produto, desenvolvida com um conjunto delimitado de funcionalidades para apresentar e validar sua proposta.

Na P1, o escopo inicial do MediSync foi definido considerando as principais necessidades da rotina médica e os recursos necessários para demonstrar a integração entre consultas, pacientes e comunicação.

| Incluído no escopo inicial da P1 | Reservado para evolução |
| --- | --- |
| Perfil profissional do médico. | Banco de dados definitivo. |
| Painel com consultas marcadas. | Autenticação completa por perfil. |
| Chat vinculado à consulta e modos de comunicação. | Fluxo completo da clínica e da recepção. |
| Notificações configuráveis. | Pagamentos e convênios. |
| Telemedicina com salas criadas pelo médico. | Prontuário clínico completo. |
| Feedback, denúncia e avaliação. | Integrações externas de notificação. |
| Tema noturno e recursos básicos de acessibilidade. | Regras avançadas de fila de espera. |
| Demonstração integrada dos principais fluxos. | Controles de segurança, auditoria, adequação à LGPD e implantação em produção. |

### Evolução após a P1: versão v0.5

Após a definição inicial do projeto, a versão v0.5 ampliou a demonstração da área médica, incluindo funcionalidades de gerenciamento de consultas, cadastro de pacientes, registros de atendimento, edição do perfil profissional e navegação contextual.

Outra evolução importante foi a inclusão da persistência dos dados em arquivo JSON local, permitindo manter os registros da demonstração mesmo após reiniciar o backend.

É importante diferenciar essa implementação do banco de dados definitivo planejado. O armazenamento em JSON atende ao cenário de demonstração local, enquanto o PostgreSQL permanece como uma etapa futura de evolução.

Portanto, funcionalidades como autenticação completa, prontuário eletrônico completo e integração com PostgreSQL não devem ser consideradas entregas concluídas da versão atual.

## Tecnologias e arquitetura

O MediSync utiliza tecnologias voltadas ao desenvolvimento da interface, processamento das operações do sistema e comunicação entre os participantes.

### Tecnologias utilizadas

| Camada | Tecnologia | Responsabilidade |
| --- | --- | --- |
| Interface | React, TypeScript e Vite. | Construção das telas, componentes, navegação e configurações. |
| Backend | Node.js. | Execução das operações e regras do servidor. |
| API | Express. | Organização das rotas e comunicação entre frontend e backend. |
| Eventos em tempo real | Socket.IO. | Comunicação de mensagens e atualização de eventos. |
| Comunicação audiovisual | WebRTC. | Comunicação de voz e vídeo entre os participantes. |
| Persistência atual | Arquivo JSON local. | Armazenamento dos dados da versão v0.5. |
| Persistência planejada | PostgreSQL. | Armazenamento estruturado e gerenciamento dos relacionamentos. |

### Arquitetura do sistema

A arquitetura do MediSync é dividida principalmente entre frontend e backend.

O frontend é responsável pela interface utilizada pelos participantes, permitindo acessar as funcionalidades de agenda, pacientes, perfil e comunicação.

O backend recebe as solicitações realizadas pela interface, executa as regras de funcionamento e gerencia a persistência dos dados.

Para complementar essa comunicação, o sistema utiliza Socket.IO para eventos em tempo real e WebRTC como base para as chamadas de voz e vídeo.

Loading

  

```text
flowchart TD
    U["Médico e paciente"] --> F["Interface React e TypeScript"]
    F --> A["API Node.js e Express"]
    F <--> R["Socket.IO e WebRTC"]
    A --> D["Arquivo JSON local na v0.5"]
    D -. "Evolução planejada" .-> P["PostgreSQL"]
```

O diagrama apresenta os principais componentes da arquitetura e a evolução prevista para o armazenamento dos dados.

Na comunicação audiovisual, o WebRTC é responsável pela transmissão de mídia entre os participantes, enquanto os eventos de sinalização auxiliam no estabelecimento da conexão. A mídia das chamadas não é armazenada no arquivo JSON.

Na base apresentada inicialmente na P1, os dados permaneciam em memória. Na versão v0.5, a persistência foi ampliada para gravação em `backend/data/medisync.json`, permitindo conservar os dados localmente.

Esse modelo atende à demonstração em uma única instância do sistema, mas não substitui um banco de dados preparado para operações multiusuário e implantação em produção.

Para uma utilização real em clínicas, ainda será necessário implementar autenticação e autorização adequadas nas rotas e nos eventos, controles de acesso às informações dos pacientes, auditoria das operações e mecanismos de proteção dos dados.

A infraestrutura de comunicação audiovisual também deverá contar com HTTPS e uma estratégia de conectividade adequada, incluindo servidores TURN quando necessários.

## Modelo de dados

O projeto possui um modelo inicial de entidade-relacionamento (MER), elaborado para representar as principais informações envolvidas no gerenciamento de consultas.

![Modelo de entidade-relacionamento do MediSync](https://raw.githubusercontent.com/fatecrl-ite004/MediSync/main/MER/MER.jpeg)

[[Visualizar o arquivo original do MER](https://github.com/fatecrl-ite004/MediSync/blob/main/MER/MER.jpeg).
O modelo apresenta as seguintes entidades e suas respectivas responsabilidades:

| Entidade do diagrama | Papel na modelagem |
| --- | --- |
| Especialidade | Classificação da área de atuação médica. |
| Médico | Armazenamento dos dados profissionais e vínculo com a especialidade. |
| Horário | Representação da data, hora e disponibilidade relacionadas ao médico. |
| Paciente | Armazenamento dos dados cadastrais do paciente. |
| Atendente | Representação do profissional responsável pelo atendimento administrativo. |
| Consulta | Relacionamento entre paciente, médico, horário, atendente e situação do agendamento. |
| Status da consulta | Identificação da situação em que o agendamento se encontra. |
| Histórico da consulta | Registro das alterações de status, datas e respectivos motivos. |

O MER é um artefato de planejamento e representa a estrutura inicial das informações necessárias ao sistema. Ele ainda não corresponde a um banco de dados integrado à API da versão v0.5.

Sua modelagem está concentrada no gerenciamento de agendamentos e poderá ser ampliada para contemplar outros módulos, como chat, telemedicina, avaliações e registros de atendimento.

A participação do atendente também poderá ser desenvolvida de forma mais completa em versões futuras, permitindo ampliar a utilização do MediSync para outros profissionais da clínica.

## Considerações sobre a evolução técnica

A arquitetura e o modelo de dados apresentados demonstram a estrutura planejada para o MediSync e as tecnologias utilizadas no protótipo.

A evolução do projeto depende da integração progressiva dos módulos, da melhoria da persistência e da implementação de mecanismos adequados de segurança e controle de acesso.

Com isso, o MediSync busca evoluir de um protótipo acadêmico para uma plataforma mais completa, mantendo como objetivo central a integração entre médicos, pacientes e os processos de atendimento das clínicas particulares.
