# Validação do MediSync

## Revisão da experiência do paciente em 31 de outubro de 2026

Validação com dados fictícios em Node.js 24.22.1, TypeScript estrito e Chromium. O código parte da v0.5 do repositório e preserva os fluxos médicos.

| Verificação | Resultado |
| --- | --- |
| `npm --prefix frontend run build` | Aprovado: TypeScript e Vite, com os arquivos estáticos gerados |
| `npm --prefix backend test` | Aprovado: 2 testes de integração, fluxo médico e fluxo do paciente |
| Agenda do paciente | Horários futuros e em dias úteis; bloqueio de horário fora da grade; consulta, revisão e confirmação |
| Disputa por vaga | Duas confirmações concorrentes para a mesma vaga: uma criada (201) e outra rejeitada (409) |
| Reagendamento | Mantém o mesmo identificador; libera o horário anterior; verifica a nova disponibilidade |
| Cancelamento | Confirmação na interface; servidor rejeita repetição e alteração de consulta encerrada ou de outro paciente |
| Fila de espera | Inscrição sem duplicação por serviço; período compatível gera aviso; período incompatível não gera aviso; saída da fila |
| Persistência | Consultas e fila preservadas após reiniciar; JSON anterior sem campo de fila abre sem apagar os dados existentes |
| Atalho `npm run dev` | API e interface iniciadas juntas; navegação validada pela prévia gerenciada e verificação adicional em loopback |
| Proxy e build servido | API, disponibilidade e transporte de polling Socket.IO acessíveis pelo host do Vite; JS/CSS e API acessíveis pela prévia do build |
| Navegador | Entrada nos dois papéis; agendamento; retorno de etapa com horário preservado; reagendamento; manter e cancelar consulta; inscrição na fila; aviso com acesso à fila; mensagem enviada; agenda médica refletindo alterações |
| Responsividade | Larguras de conteúdo 320, 390, 768, 1024 e 1280 px, conferidas em quadro de teste no Chromium; sem transbordamento horizontal nas telas inspecionadas |
| Acessibilidade visual | Texto ampliado, alto contraste e tema noturno em 320 px; navegação inferior com quatro destinos; seleção por teclado e diálogo de cancelamento com foco inicial |

O cenário de teste da API usa as portas 3198 e 3199, arquivos temporários e encerra seus processos ao terminar. As verificações não alteram dados de uma instalação existente. A prévia de interface utilizou uma cópia local de demonstração.

## Limites desta validação

As larguras foram simuladas em quadros do navegador; não substituem testes em aparelhos físicos, tecnologias assistivas ou avaliação com pessoas de diferentes idades. Não foi medido desempenho de rede móvel, nem comprovada conformidade integral com padrões de acessibilidade.

Não foi executado o iniciador no Windows, nem verificado acesso real entre notebook e celular na mesma rede. O roteiro correspondente está no README. Na execução isolada do terminal, o Vite não conseguiu enumerar interfaces de rede ao usar host aberto; a verificação adicional utilizou explicitamente `127.0.0.1`, enquanto a prévia gerenciada com o iniciador completo funcionou.

Não foi validada uma chamada audiovisual real entre dois dispositivos/redes. O teste de Socket.IO pelo proxy confirma o transporte HTTP de polling; não mede uma chamada WebRTC nem garante conectividade entre redes externas.

Os testes de usuário descritos em [Experiência do usuário](docs/EXPERIENCIA-DO-USUARIO.md) são um roteiro futuro. Não há resultados de satisfação, redução de faltas ou uso clínico real. O login continua simulado, o armazenamento é JSON e esta revisão não representa prontidão para produção.

## Registro anterior da v0.5

A validação anterior cobriu cadastro de pacientes, agenda médica, registros e resumo obrigatório antes da conclusão, retorno do chat à agenda, histórico, edição de perfil e tema noturno. O teste de integração médico permanece no repositório e passou novamente nesta revisão.
