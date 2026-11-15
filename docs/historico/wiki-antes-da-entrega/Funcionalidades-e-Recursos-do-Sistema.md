

### Agenda e gerenciamento de consultas

O painel apresenta consultas e acessos para a rotina médica. A agenda v0.5 oferece cadastro, pesquisa por paciente ou serviço, filtros por data e status, reagendamento, cancelamento com motivo, início e conclusão do atendimento.

| Regra da versão v0.5 | Comportamento esperado |
| --- | --- |
| Data do agendamento | Novas consultas e reagendamentos usam horários futuros. |
| Duração | O atendimento deve ter entre 10 e 240 minutos. |
| Conflitos | A agenda bloqueia sobreposição de consultas. |
| Cancelamento | O médico informa o motivo do cancelamento. |
| Registro | O resumo do atendimento deve ser salvo antes da conclusão. |
| Encerramento | Após concluir, o registro fica disponível para leitura. |

Os status apresentados são **Confirmada**, **Em atendimento**, **Concluída** e **Cancelada**. Consultas passadas ainda confirmadas continuam visíveis para que o médico possa resolvê-las.

### Pacientes e registros de atendimento

A versão v0.5 permite cadastrar e buscar pacientes, consultar contato e alergias informadas e acessar o histórico individual. O registro demonstrativo contém resumo e plano ou orientações, com edição durante o atendimento e leitura após a conclusão.

Esse registro organiza a demonstração acadêmica. Ele não constitui prontuário certificado, receita ou documento assinado digitalmente.

### Chat vinculado à consulta

O chat utiliza mensagens em tempo real, confirmação de entrega e leitura e silenciamento por conversa. A conversa é relacionada a uma consulta, para preservar o contexto do contato.

| Modo definido pelo médico | Funcionamento proposto |
| --- | --- |
| Aberto | Permite iniciar a comunicação pelos participantes, conforme as regras do protótipo. |
| Prioritário | Apenas o médico pode iniciar uma conversa. |
| Oculto | A abertura e a visualização das conversas ficam desativadas. |

A confirmação de leitura é configurável pelo médico. A interface também oferece denúncia de conversa ou usuário.

### Notificações

As preferências separam avisos de **consultas**, **mensagens**, **telemedicina** e **sistema**. Também é possível silenciar uma conversa individualmente.

A proposta de lembretes da P1 não deve ser confundida com uma integração já pronta com serviços externos: notificações por canais externos continuam como evolução futura.

### Telemedicina

A regra central apresentada na P1 é que **somente o médico cria a sala**. O paciente entra quando há uma sala disponível e vinculada à sua consulta.

- O médico seleciona uma consulta elegível.

- Cria uma sala de voz ou vídeo.

- O paciente recebe uma notificação.

- Os participantes entram e autorizam o uso de câmera e microfone.

- A sala é encerrada de acordo com as ações do atendimento.

Na versão v0.5, consultas canceladas ou concluídas não podem abrir novas salas; salas vinculadas são encerradas quando a consulta é concluída ou cancelada. Para demonstrar os dois participantes, utiliza-se a consulta de **João Silva**, pois os demais cadastros de exemplo não possuem login próprio.

O uso de WebRTC demonstra a base de comunicação audiovisual. A operação entre dispositivos e redes depende de permissões, infraestrutura e validação específica; não é uma garantia de funcionamento em todas as redes.

### Feedback, denúncia e avaliação

| Recurso | Finalidade |
| --- | --- |
| Feedback | Receber reclamações, pedidos e sugestões sobre a experiência. |
| Denúncia | Registrar uma ocorrência envolvendo conversa ou usuário. |
| Avaliação bilateral | Médico e paciente podem avaliar a experiência após consulta concluída, com nota de 1 a 5 estrelas. |

Os recursos são demonstrativos e não representam um processo completo de moderação ou atendimento de suporte.
