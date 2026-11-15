> **Contexto histórico:** esta página registra uma etapa anterior à revisão de 14/11/2026. Para funcionalidades atuais, instalação, chamadas simuladas e limites de privacidade, consulte a [Entrega final](Entrega-final). A proposta original permanece preservada abaixo.



## Design, navegação e acessibilidade

A experiência busca facilitar a localização das ações e manter o usuário no contexto do atendimento, tanto no computador quanto no celular.

- **Navegação contextual:** abrir o chat pela agenda permite retornar à agenda; abrir pelo painel permite retornar ao painel.

- **Preferências centralizadas:** a troca entre tema claro e escuro fica nas configurações.

- **Adaptação de layout:** a interface utiliza estilos responsivos; em telas pequenas, a navegação inferior permite acessar os módulos.

- **Apoio à leitura:** estão disponíveis narrador, alto contraste e texto ampliado.

- **Formulários:** a versão v0.5 inclui retorno de erros, estados vazios, foco contido nos formulários modais e aviso antes de descartar alterações.

- **Saída da chamada:** ao deixar a chamada, câmera e microfone são liberados.

A existência desses recursos não representa certificação de acessibilidade ou validação em todos os dispositivos. A continuidade do projeto inclui revisar legibilidade, contraste, teclado, áreas de toque e comportamento em diferentes tamanhos de tela.

## Execução e demonstração

### Preparação

A versão documentada utiliza **Node.js 20 ou superior**, npm e Git. Os comandos abaixo são para PowerShell no Windows.

```text
git clone https://github.com/fatecrl-ite004/MediSync.git
cd MediSync
```

Na pasta principal, o arquivo `INICIAR-WINDOWS.bat` facilita a instalação das dependências e a abertura dos dois servidores. Também é possível iniciar manualmente.

### Terminal 1 — backend

```text
cd backend
npm.cmd ci
npm.cmd start
```

### Terminal 2 — frontend

Abra outro terminal na pasta principal do projeto e execute:

```text
cd frontend
npm.cmd ci
npm.cmd run dev
```

| Serviço | Endereço local |
| --- | --- |
| Interface | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:3000](http://localhost:3000) |

Mantenha os dois terminais abertos. No macOS ou Linux, use `npm` no lugar de `npm.cmd`.

### Roteiro de demonstração da versão v0.5

- Entre como médica e abra **Consultas**.

- Cadastre um paciente fictício e agende uma consulta futura.

- Confira a busca, os filtros e o reagendamento.

- Inicie o atendimento, registre e salve o resumo e as orientações.

- Conclua a consulta e confira seu histórico.

- Abra um chat pela agenda e retorne usando **Voltar**.

- Edite o perfil e confira o tema em **Configurações**.

- Para a telemedicina, use uma consulta elegível de João Silva, com a médica em uma janela e João em uma janela anônima.

- Reinicie o backend para conferir a permanência dos dados salvos.

### Verificações disponíveis

Na pasta `backend`, `npm.cmd test` executa os testes de integração existentes. Na pasta `frontend`, `npm.cmd run build` verifica o TypeScript e gera a compilação.

O repositório registra as verificações da versão anterior em [VALIDACAO.md](https://github.com/fatecrl-ite004/MediSync/blob/main/VALIDACAO.md). Esta wiki descreve os recursos e verificações documentados; não registra uma nova execução desses testes nem uma nova validação audiovisual entre redes.

## Próximas etapas

| Prioridade | Etapa | Resultado esperado |
| --- | --- | --- |
| 1 | Validar a jornada integrada. | Conferir o fluxo médico → consulta → chat → chamada → acompanhamento. |
| 2 | Refinar UX e acessibilidade. | Melhorar organização, leitura e interação em dispositivos móveis e computadores. |
| 3 | Revisar a modelagem. | Consolidar entidades, relacionamentos, estados e histórico, incluindo os módulos adicionais. |
| 4 | Integrar o banco definitivo. | Migrar a persistência demonstrativa para PostgreSQL. |
| 5 | Implementar autenticação e autorização. | Controlar identidades e acesso conforme o papel e a consulta. |
| 6 | Preparar uma implantação segura. | Definir proteção de dados, auditoria e infraestrutura de comunicação. |

As etapas são orientações de evolução, sem datas de conclusão definidas nesta documentação. O roteiro da P1 também previa preparar uma demonstração de 5 a 10 minutos e solicitar à banca validação do escopo e das prioridades do MVP.

## Organização da apresentação da P1

O conteúdo dos dez slides foi convertido para as seguintes partes da wiki:

| Slide da P1 | Conteúdo preservado nesta documentação |
| --- | --- |
| 1 — Apresentação inicial | Nome do projeto, equipe, contexto acadêmico e proposta central. |
| 2 — Público e problema | Público-alvo, fragmentação das informações e objetivo. |
| 3 — Solução proposta | Jornada integrada e consulta como elemento central. |
| 4 — Estado do protótipo | Base funcional, tecnologias e limites da demonstração. |
| 5 — Perfil profissional | CRM, especialidades, serviços e credibilidade da apresentação profissional. |
| 6 — Comunicação e atendimento remoto | Chat, notificações, modos de comunicação e salas de voz ou vídeo. |
| 7 — Diferenciais | Referências de UX e sua aplicação no projeto. |
| 8 — Escopo do MVP | Delimitação da primeira entrega e evolução posterior. |
| 9 — Tecnologias e arquitetura | Interface, API, tempo real e PostgreSQL planejado. |
| 10 — Próximas etapas | Validação, UX, modelagem, persistência e demonstração. |

A divisão sugerida na apresentação distribuía problema e proposta para o primeiro integrante; protótipo, funcionalidades e diferenciais para o segundo; e tecnologias, MVP e próximas etapas para o terceiro. Todos devem conhecer a jornada completa.

## Fontes e manutenção da wiki

### Fontes do projeto

- **Apresentação inicial da P1:** `MediSync_Apresentacao_Premium(1).pptx`, com dez slides. Base para a proposta, o público, os diferenciais e o escopo.

- **[README do projeto](https://github.com/fatecrl-ite004/MediSync/blob/main/README.md):** descrição da versão v0.5 e instruções de execução.

- **[Frontend](https://github.com/fatecrl-ite004/MediSync/blob/main/frontend/package.json)** e **[backend](https://github.com/fatecrl-ite004/MediSync/blob/main/backend/package.json):** tecnologias, versão e comandos disponíveis.

- **[Modelo de dados](https://github.com/fatecrl-ite004/MediSync/blob/main/MER/MER.jpeg):** modelagem inicial disponibilizada no repositório.

### Referências para edição

- [Sobre wikis — GitHub Docs](https://docs.github.com/pt/communities/documenting-your-project-with-wikis/about-wikis).

- [Adicionar ou editar páginas de wiki — GitHub Docs](https://docs.github.com/pt/communities/documenting-your-project-with-wikis/adding-or-editing-wiki-pages).

- [Sintaxe básica de Markdown — GitHub Docs](https://docs.github.com/pt/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

### Como manter esta documentação viva

Sempre que houver uma entrega relevante, atualize a versão e a data de revisão, mova para o estado atual apenas o que foi implementado e mantenha as decisões futuras identificadas como planejamento. As mensagens de edição da wiki devem explicar a mudança e preservar o histórico do projeto.

| Data | Revisão |
| --- | --- |
| 23/10/2026 | Conversão da apresentação da P1 para wiki e contextualização com a versão v0.5 do repositório. |
