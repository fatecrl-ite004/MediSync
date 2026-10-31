# Experiência do usuário no MediSync

Revisão de 31 de outubro de 2026, a partir do código da v0.5, da wiki da P1 e do plano de marketing fornecido pelo grupo. O objetivo é permitir que o paciente entenda o próximo passo, leia com conforto e conclua tarefas sem pressa. A facilidade para diferentes idades é uma meta de projeto; ainda precisa ser avaliada com pessoas reais.

## Decisões aplicadas

| Necessidade | Comportamento implementado | Relação com a proposta |
| --- | --- | --- |
| Entender onde entrar | “Sou paciente” e “Sou profissional de saúde”, com identificação da demonstração | Linguagem acolhedora e clara |
| Saber o próximo compromisso | Tela inicial destaca a próxima consulta e uma ação principal para agendar | Agenda e cuidado conectados |
| Agendar sem sobrecarga | Três etapas: consulta, horário e confirmação; botões para voltar, com escolhas preservadas quando ainda válidas | Adoção simples do aplicativo |
| Evitar enganos | Revisão antes de salvar; cancelamento com diálogo e opção de manter ou reagendar | Confiabilidade do agendamento |
| Usar no celular | Quatro destinos fixos: Início, Consultas, Mensagens e Mais; demais opções na tela Mais | Prioridade para dispositivos móveis |
| Ler com conforto | Texto maior no cabeçalho; contraste e tema em Ajuda e opções; controles com área confortável e foco visível | Acessibilidade prevista no plano |
| Ter mais possibilidades de horário | Fila por consulta e período; aviso interno após liberação compatível; confirmação verifica disponibilidade de novo | Reaproveitamento de cancelamentos |
| Compreender erros | Mensagens persistentes no formulário, opção de tentar novamente e bloqueio de envios repetidos durante a operação | Redução de dúvida e retrabalho |
| Consultar ajuda | Orientações junto ao percurso e perguntas frequentes em linguagem direta | Menor dependência de treinamento |

A identidade mantém azul-marinho e verde-azulado. Os ícones acompanham rótulos visíveis; cores não são o único indicador de situação. Não há troca automática de etapas, contagem regressiva ou limite de tempo para ler. Avisos gerais podem ser fechados pela pessoa. As etapas e os títulos recebem foco para facilitar a orientação por teclado; as opções de consulta e horário usam controles de seleção nativos.

## Percursos principais

1. Entrar como paciente → Agendar consulta → escolher consulta → escolher dia e horário → revisar → confirmar → ver confirmação → Minhas consultas.
2. Consultas → Alterar consulta → Reagendar → escolher novo horário → revisar → confirmar. O compromisso anterior é preservado até a confirmação bem-sucedida.
3. Consultas → Alterar consulta → Cancelar consulta → conferir compromisso → manter, reagendar ou confirmar cancelamento.
4. Mais → Fila de espera → escolher consulta e período → salvar preferência → receber aviso no aplicativo quando houver liberação compatível → consultar horários e confirmar uma vaga disponível.
5. Consulta → Conversar com a médica → Mensagens. As chamadas dependem de uma sala aberta pela médica.

## Regras e limites da demonstração

A área do paciente representa João Silva (101). Há uma médica fictícia com três serviços. O catálogo e a grade de disponibilidade são demonstrativos: próximos 21 dias, dias úteis das 09h às 17h no horário de Brasília, com inícios a cada hora. Não há calendário de feriados nem configuração de jornada por clínica. O servidor bloqueia sobreposição e verifica novamente cada confirmação.

O paciente pode alterar somente suas próprias consultas confirmadas e futuras. Consultas em atendimento ou encerradas não podem ser canceladas nem reagendadas por ele. Cancelar encerra salas abertas vinculadas à consulta. O histórico e o fluxo médico são preservados.

A fila usa preferência de serviço e período (manhã, tarde ou qualquer período). Liberações por cancelamento ou reagendamento do médico/paciente geram avisos internos para preferências compatíveis, respeitando a preferência de notificações de consultas. Não há posição numérica, prioridade clínica, reserva exclusiva, distribuição sequencial, confirmação automática, push externo, SMS, WhatsApp ou e-mail. Todos os interessados compatíveis podem receber o aviso; quem confirmar primeiro ocupa a vaga. O ingresso na fila não cancela outra consulta. A preferência do serviço é removida quando o paciente confirma um horário desse serviço.

O JSON persiste a fila e aceita arquivos anteriores sem esse campo, preservando os dados existentes. O login e os cabeçalhos de papel são controles de demonstração e não substituem autenticação e autorização reais. Esta revisão não habilita uso clínico.

## Roteiro para avaliação com pessoas

Utilizar apenas dados fictícios, explicar que é uma demonstração e convidar pessoas com diferentes familiaridades digitais e faixas etárias. Não registrar nomes, dados clínicos ou outras informações pessoais nas anotações de teste.

| Tarefa simulada | Evidência a registrar | Meta inicial proposta |
| --- | --- | --- |
| Agendar uma consulta | Concluiu? Pediu ajuda? Entendeu a confirmação? | Pelo menos 4 de 5 participantes concluem sem orientação durante a tarefa |
| Reagendar sem criar uma segunda consulta | Reconheceu o novo horário? Encontrou a ação? | Pelo menos 4 de 5 concluem e identificam o horário novo |
| Cancelar sem erro acidental | Diferenciou manter, reagendar e cancelar? | Nenhum cancelamento involuntário na sessão |
| Entrar na fila e explicar o aviso | Entendeu que o aviso não reserva a vaga? | Todos os participantes conseguem explicar a necessidade de confirmar |
| Aumentar o texto | Encontrou o botão e continuou a navegação? | Todos conseguem aumentar e voltar a leitura padrão |

Estas metas orientam uma rodada futura e não representam resultados obtidos. Registrar o tempo espontâneo, dúvidas, erros e nota de facilidade de 1 a 5 após cada tarefa. Não impor cronômetro ou pressa ao participante. Se alguém não conseguir concluir, observar o ponto de interrupção e ajustar antes de ampliar a avaliação. Os resultados de usabilidade devem ser registrados separadamente dos testes técnicos.

## Próximas decisões

O grupo precisa consolidar o público institucional nas tabelas do plano, definir a jornada de clínicas/recepção e especificar regras futuras de ordenação da fila. A avaliação com participantes deve decidir se três etapas e os rótulos escolhidos são suficientes para o público pretendido. Autenticação, banco de dados, segurança, múltiplos profissionais e integrações de avisos exigem trabalho específico antes de uma implantação real.
