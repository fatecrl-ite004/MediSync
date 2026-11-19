# Revisão de apresentação — 19/11/2026

Código conferido a partir da `main` em `6696de7506e5528d89090fe3570e4945ecb56394`, com Node.js 24.22.3 em Linux.

| Verificação | Resultado |
| --- | --- |
| Instalação a partir dos locks | Backend e frontend aprovados |
| Build TypeScript/Vite | Aprovado |
| `npm --prefix backend test` | 4 testes aprovados |
| `npm --prefix frontend test` | 6 testes aprovados |
| `npm run test:realtime` | 1 teste de integração aprovado, cobrindo dois clientes, conversas, regras e salas |
| Navegador | Mensagem atualiza lista no outro perfil, sala aparece nos detalhes, encerramento chega ao paciente e regra de chat é sincronizada |

[Correções, limites e roteiro da apresentação](docs/REVISAO-APRESENTACAO-20261119.md). O novo teste usa a porta 3195 e arquivos temporários próprios. Os testes anteriores mantêm suas portas e não alteram os dados da demonstração. Windows real, rede da faculdade, dispositivos físicos e calendário externo não foram verificados aqui.

---

# Preparação da entrega — 15/11/2026

Verificações executadas com Node.js 24.22.1:

| Verificação | Resultado |
| --- | --- |
| `npm --prefix backend ci` | Aprovado; instalação a partir do lock versionado |
| `npm --prefix frontend ci` | Aprovado; instalação a partir do lock versionado |
| `npm --prefix backend test` | 4 testes aprovados, 0 falhas |
| `npm --prefix frontend test` | 6 testes aprovados, 0 falhas |
| `npm --prefix frontend run build` | TypeScript e Vite 6.4.6 aprovados |
| Integridade dos documentos e pacotes | DOCX, PPTX e ZIP abriram sem erro de CRC; anexos E–I presentes no Word mais recente |
| Links locais do índice e README | Destinos existentes no pacote preparado |

O código funcional e os locks do pacote são idênticos à revisão submetida a esses comandos. A organização dos documentos não alterou o comportamento da aplicação. As conferências no navegador abaixo mantêm suas datas originais; não foram repetidas nesta preparação. A disponibilidade dos novos links remotos depende da publicação no repositório e na wiki.

---

# Complemento da revisão — 14/11/2026

- Build TypeScript/Vite e os 10 testes passaram novamente. O teste de privacidade também rejeita dados extras em preferências, tipos inválidos, CRM numérico e especialidades em formato inválido; preserva edição do perfil fictício e preferências válidas.
- `npm audit --audit-level=low` retornou zero vulnerabilidades conhecidas nos dois locks nesta data.
- Navegador: aviso de armazenamento dispensado e mantido após recarga; versão pública 2026-11-14; scripts presentes no DOM somente do Vite e da aplicação local.
- Teclado: Shift+Tab do fechar para o último controle do cadastro, Tab para o aviso de privacidade e Enter para abrir a política; foco no título legal, Tab fora da interface oculta, retorno ao modal, Escape e retorno ao botão Cadastrar paciente conferidos.
- Contraste: amostra de 51 elementos de texto na página Pacientes e 27 na página de cookies em escuro/alto contraste/texto maior, sem falhas no cálculo amostral. Não cobre gradientes, opacidade e todos os estados.
- Revisão responsiva em iframe: cookies nos quadros de 320, 390, 768, 1024 e 1280 px com escuro/alto contraste/texto maior; seis páginas legais em quadro de 320 px, sem overflow horizontal. Corrigido min-width do body para acomodar a barra vertical: área útil de 305 px no quadro de 320 px. Não houve teste em celular físico ou validação completa de zoom 200%/400%.
- Retirados CNPJ não confirmado e alegação sem fonte sobre lembretes do Markdown de marketing. O DOCX antigo é material histórico; não é identificação empresarial nem texto aprovado de divulgação.

Não existe certificação de acessibilidade ou conformidade integral LGPD. Persistem as pendências descritas na auditoria, especialmente identidade, contato privado e controles para operação real.

---

# Revisão de privacidade e acessibilidade — 13/11/2026

Resultado: build aprovado com Vite 6.4.6; 6 testes frontend e 4 testes backend aprovados (10 no total), após `npm ci` dos dois locks corrigidos. `npm audit --audit-level=low` não encontrou vulnerabilidades conhecidas em ambos os locks em 13/11/2026. Isso não comprova ausência de falhas de segurança. Alertas iniciais: Vite alto, body-parser alto e qs moderado; corrigidos sem `--force` para Vite 6.4.6, body-parser 1.20.9 e qs 6.16.2.

Verificações adicionais desta revisão:

- As seis páginas legais abriram pelo rodapé sem login; em 320 px, largura do documento e do conteúdo permaneceram 320 px. A página de acessibilidade também foi verificada em 390, 768, 1024 e 1280 px, sem overflow horizontal.
- Aviso de armazenamento: “somente necessários” retirou o aviso; recarga manteve a escolha; apagar ciência fez o aviso reaparecer. Os testes cobrem JSON inválido, versão antiga, data futura e expiração de 180 dias.
- Teclado: modal de cadastro recebeu foco no fechar; Tab alcançou o link de privacidade; Enter abriu a política e focou seu título; Tab na política ficou fora da interface oculta. Voltar restaurou foco ao fechar do modal. Shift+Tab do fechar foi para o último botão; Escape fechou e devolveu foco a Cadastrar paciente.
- Cadastro `Paciente de teste 8` salvo pela interface, sem campos de contato, nascimento ou alergias. Os testes de API confirmam rejeição de nome livre e de e-mail/campos extras.
- No DOM da tela médica: uma imagem local `/avatar-medica.svg`, decorativa junto ao nome, com alt vazio; entradas de script somente locais do Vite e da aplicação. A foto informativa do perfil tem descrição da ilustração fictícia. A inspeção de fonte não encontrou GA, GTM, pixels, importação de webfonts ou captura WebRTC restante.
- Contraste calculado sobre estilos computados: tela médica inicial apresentou 3,58:1 no separador e 4,34:1 no status; corrigidos. Nova amostragem da página de pacientes: 56 textos sem falha; termos em tema claro: 26 sem falha; Mais opções em escuro/alto contraste/texto maior: 57 sem falha; cookies em escuro normal: 31 sem falha; reembolso em escuro normal: 23 sem falha. Trata-se de amostragem, não certificação de todos os estados.
- Em 320 px, Mais opções e a página de cookies permaneceram sem overflow horizontal com tema escuro, alto contraste e texto maior. Os três atributos de estilo foram conferidos no DOM.
- Chamadas agora são simulações: captura de mídia e STUN foram removidos. API em NODE_ENV=production foi testada recusando inicialização sem criar arquivo de dados. Headers no-store, origem externa rejeitada e limites de texto também foram verificados em testes.

Limites: sem acesso à configuração de hospedagem/contas GA/GTM, sem inspeção completa de tráfego de produção, sem teste de leitor de tela, zoom completo, dispositivos físicos ou titulares reais. Não houve certificação WCAG ou confirmação integral LGPD. Controlador, contato privado, bases legais de operação real, retenção, contratos, autoria de materiais antigos e requisitos clínicos permanecem pendentes. Arquivos de dados antigos do usuário não foram apagados. Ver [auditoria e riscos](docs/AUDITORIA-PRIVACIDADE-ACESSIBILIDADE.md).

---

# Validação do MediSync

## Simplificação no PC em 5 de novembro de 2026

- Build TypeScript/Vite aprovado; dois testes de integração do backend aprovados e três testes do frontend aprovados.
- Painel médico: no mesmo cenário de demonstração, dez botões no conteúdo passaram a dois e nove itens de navegação passaram a cinco.
- Listas: primeiro lote com seis consultas, expansão conferida com nove consultas do paciente e onze do médico em cenário local temporário. Dados adicionais de lista longa removidos após a verificação.
- Navegador: cadastro fictício, agenda, início e conclusão, resumo obrigatório, registro somente leitura, reagendamento do paciente, opção de manter a consulta ao cancelar, conversa e retorno à agenda, acesso à fila por Mais opções.
- Busca sem acentos, filtros de status/data e visualizações Próximas, Hoje e Histórico conferidos.
- Teclado: seções expansíveis dos detalhes alcançáveis com Tab; Escape fecha e devolve o foco ao botão de origem.
- Larguras da agenda: 320, 390, 768, 1024 e 1280 px sem transbordamento horizontal nas telas verificadas. Texto ampliado, alto contraste e tema noturno conferidos em 320 px; menu/saída acessíveis em janela de 600 px de altura.
- Calendário: geração `.ics` validada em testes para fuso, duração, texto, quebras UTF-8 e entradas inválidas. O botão exibiu confirmação de arquivo preparado, mas a captura do download no navegador gerenciado não foi confirmada. A importação em calendários externos permanece pendente.

O detalhamento e os limites estão em [Simplificação no PC](docs/SIMPLICIDADE-NO-PC.md). A API e seus dados não foram alterados por esta revisão de código. Não há alegação de testes em aparelhos físicos ou com participantes, nem de prontidão clínica.

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
