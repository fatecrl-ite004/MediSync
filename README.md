# MediSync

**Sistema de agendamento e comunicação médica — protótipo acadêmico v0.5.**

O MediSync reúne consultas, pacientes, registros de atendimento, mensagens e telemedicina em uma interface web. A área do paciente prioriza agendamento em três etapas, acompanhamento da próxima consulta e comunicação clara, mantendo a rotina médica disponível. Projeto desenvolvido no curso de Tecnologia em Sistemas para Internet da FATEC Rubens Lara.

[Documentação e apresentação da P1 na wiki](https://github.com/fatecrl-ite004/MediSync/wiki)

## Funcionalidades

- Área do paciente com próxima consulta em destaque e agendamento em três etapas: consulta, horário e confirmação.
- Reagendamento e cancelamento pelo paciente, com revisão e confirmação antes de liberar a vaga.
- Fila de espera por tipo de consulta e período; avisos dentro do aplicativo quando um horário compatível é liberado. A vaga depende da confirmação, sem reserva exclusiva.
- Quatro destinos principais no celular, ajuda em linguagem simples e acesso rápido a texto maior, contraste e tema noturno.

- Agenda com cadastro, busca, filtros, reagendamento e cancelamento de consultas com motivo.
- Validação de horário futuro, duração de 10 a 240 minutos e bloqueio de sobreposição.
- Cadastro de pacientes e consulta do histórico individual.
- Registro de resumo e orientações durante o atendimento; leitura após a conclusão. O resumo deve ser salvo antes de concluir.
- Edição dos dados principais do perfil médico. Formação, experiências e catálogo permanecem com exemplos demonstrativos.
- Chat em tempo real ligado à consulta, notificações, feedback, denúncias e avaliações.
- Salas de voz e vídeo criadas pelo médico para consultas elegíveis.
- Botão de retorno à página de origem, tema claro/escuro nas configurações e recursos de acessibilidade.
- Persistência local dos dados em arquivo JSON.

> Utilize somente dados fictícios. O login é simulado e o projeto ainda não possui autenticação real, banco definitivo ou prontuário certificado. Essas funcionalidades fazem parte da evolução planejada.

## Tecnologias utilizadas

| Categoria | Tecnologias e uso no projeto |
| --- | --- |
| Linguagens | HTML, CSS, TypeScript na interface e JavaScript no backend. |
| Frontend | React 18 para a interface web. |
| Backend | Node.js e Express 4 para a API HTTP. |
| Ferramentas de build | Vite 6 e TypeScript 5 para desenvolvimento, verificação e compilação. |
| Comunicação | Socket.IO 4 para eventos em tempo real e WebRTC para voz e vídeo. |
| Armazenamento | Arquivo JSON local, criado pelo backend. |
| Testes | Executor nativo `node --test` e `node:assert`. |

PostgreSQL está planejado; **não é necessário instalar ou configurar banco de dados para executar esta versão**.

## Pré-requisitos

- **Git**, para clonar o repositório.
- **Node.js 24.x**, versão principal utilizada na validação destas instruções, com npm instalado.
- Navegador atualizado e conexão com a internet para baixar as dependências.
- Portas **3000**, **5173** e, caso use a prévia do build, **4173** disponíveis.
- Permissão de escrita na pasta do projeto para salvar os dados locais.

Downloads oficiais: [Git](https://git-scm.com/downloads) · [Node.js](https://nodejs.org/).

Confira no terminal:

```powershell
git --version
node --version
npm.cmd --version
```

Os exemplos abaixo usam **PowerShell no Windows**. No Linux/macOS, use `npm` no lugar de `npm.cmd`; os demais comandos Git e npm são os mesmos. No Windows, `npm.cmd` também evita o bloqueio de execução do arquivo `npm.ps1` pelo PowerShell.

## Instalação e configuração

### 1. Obter o código-fonte

Em uma pasta onde você possa criar arquivos, execute:

```powershell
git clone https://github.com/fatecrl-ite004/MediSync.git
cd MediSync
```

A pasta `MediSync` é a **raiz do projeto**: nela ficam este README, `backend` e `frontend`. Os comandos das próximas seções partem dessa pasta, salvo indicação em contrário.

### 2. Instalar as dependências

Na raiz, instale os dois conjuntos de dependências:

```powershell
npm.cmd --prefix backend ci
npm.cmd --prefix frontend ci
```

`npm ci` utiliza os arquivos `package-lock.json` versionados para instalar as versões registradas. Aguarde os dois comandos terminarem sem erro. Eles criam uma pasta `node_modules` em cada aplicação.

O `package.json` da raiz oferece apenas o atalho `npm.cmd run dev`; as dependências continuam nos dois subprojetos. Não é necessário executar `npm install` na raiz.

### 3. Configurar o ambiente

#### Configuração padrão

**Nenhuma variável de ambiente ou arquivo `.env` é obrigatório.** Esta versão não carrega `.env` automaticamente e não exige senha, token, chave de API, migração ou script SQL para iniciar.

| Recurso | Configuração padrão |
| --- | --- |
| API | `/api`, encaminhado pelo Vite para `http://127.0.0.1:3000` |
| Socket.IO | `/socket.io`, no mesmo host da interface, com proxy para a porta 3000 |
| Interface de desenvolvimento | `http://localhost:5173` |
| Prévia do build | `http://localhost:4173` |
| Dados locais | `backend/data/medisync.json` |

A pasta `backend/data` e os dados de exemplo são criados automaticamente na primeira inicialização do backend. Não é necessário criá-los manualmente.

#### Variáveis opcionais do backend

O backend lê estas variáveis do ambiente do processo:

| Variável | Padrão | Uso |
| --- | --- | --- |
| `PORT` | `3000` | Define a porta da API e do Socket.IO. |
| `MEDISYNC_DATA_FILE` | `backend/data/medisync.json` | Define outro arquivo de armazenamento. Prefira um caminho absoluto. |

Para usar um arquivo separado de demonstração, por exemplo, execute na raiz, no terminal do backend:

```powershell
$env:MEDISYNC_DATA_FILE = Join-Path $PWD.Path "backend/data/demonstracao.json"
npm.cmd --prefix backend start
```

A variável permanece somente nessa sessão do PowerShell. Para voltar ao padrão, encerre o backend com `Ctrl+C`, abra um novo terminal e use o comando padrão de execução.

Se alterar `PORT`, ajuste também os destinos de proxy em [frontend/vite.config.ts](frontend/vite.config.ts). Reinicie os dois servidores. O atalho da raiz utiliza a porta fixa 3000. **Não é necessário mudar portas para o fluxo padrão.** Não adicione credenciais ou outros segredos ao repositório.

#### Dados locais e backup

Perfil, pacientes, consultas, registros, mensagens, fila de espera e preferências ficam em `backend/data/medisync.json`. Reiniciar o backend preserva esses dados. As consultas de exemplo recebem datas relativas à primeira inicialização; recarregar a página volta ao login simulado.

Para fazer backup, **pare o backend** e copie a pasta `backend/data`. Para começar uma nova demonstração, pare o backend e renomeie essa pasta, preservando a cópia; ao iniciar novamente, os dados iniciais serão recriados. Ao atualizar o projeto, preserve os dados da instalação anterior.

Arquivos da v0.5 sem o campo de fila são abertos preservando os dados existentes; a fila começa vazia. O armazenamento é local, sem criptografia ou banco multiusuário. Não execute várias instâncias do backend sobre o mesmo arquivo. A evolução do projeto inclui autenticação e autorização completas, banco definitivo, auditoria e revisão de proteção de dados.

## Execução em ambiente de desenvolvimento

Após instalar as dependências dos dois subprojetos, você pode iniciar tudo em um terminal na raiz:

```powershell
npm.cmd run dev
```

O atalho inicia a API na porta 3000 e a interface na porta 5173. Abra **http://localhost:5173** e use `Ctrl+C` para encerrar ambos. Ele não deve ser executado junto com outra API do MediSync na mesma porta. Os comandos abaixo continuam disponíveis para trabalhar com cada processo separadamente.

### 1. Iniciar o backend

No primeiro terminal, na raiz `MediSync`:

```powershell
npm.cmd --prefix backend start
```

Resultado esperado:

```text
MediSync API + Socket.IO em http://localhost:3000
```

Mantenha esse terminal aberto. Para desenvolver com reinício automático ao salvar o backend, use `npm.cmd --prefix backend run dev` no lugar de `start`.

### 2. Iniciar o frontend

Abra **um segundo terminal na mesma pasta raiz `MediSync`** e execute:

```powershell
npm.cmd --prefix frontend run dev -- --host localhost --port 5173 --strictPort
```

Abra **[http://localhost:5173](http://localhost:5173)** no navegador. A opção `--strictPort` impede o Vite de trocar silenciosamente de porta caso 5173 esteja ocupada.

Os dois processos são necessários: o Vite entrega a interface, e o backend fornece dados, mensagens e operações da aplicação. Para encerrá-los, pressione `Ctrl+C` em cada terminal.

### 3. Conferir a instalação

Em outro terminal, confira a API:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health"
```

O retorno deve indicar `ok: true` e `version: 0.5.0`. No Linux/macOS, acesse a mesma URL no navegador ou utilize `curl http://localhost:3000/api/health`.

Na interface:

1. Escolha **Sou paciente** (João Silva) e toque em **Agendar consulta**.
2. Escolha o atendimento, o dia e o horário; confira os detalhes e confirme.
3. Em **Consultas**, abra **Alterar consulta** para reagendar ou testar a confirmação de cancelamento.
4. Abra **Mais → Fila de espera** no celular (ou o menu lateral no computador), salve uma preferência e confira sua permanência após sair e entrar.
5. Saia da demonstração e escolha **Sou profissional de saúde** (Dra. Ana). Em **Consultas**, confira a mesma agenda. Cadastre um paciente fictício, inicie um atendimento, salve o resumo e conclua para verificar o histórico.

A agenda de demonstração do paciente oferece horários futuros nos próximos 21 dias, de segunda a sexta, das 09h às 17h, no horário de Brasília. O catálogo tem uma médica fictícia e três tipos de consulta. Não há feriados, convênios, pagamentos ou múltiplas clínicas configurados.

### Atalho opcional no Windows

Após clonar, também é possível abrir [INICIAR-WINDOWS.bat](INICIAR-WINDOWS.bat) na pasta principal. Ele instala as dependências quando as pastas `node_modules` ainda não existem e abre os dois terminais. Aguarde a inicialização e acesse a URL exibida pelo Vite.

O atalho não substitui `npm ci` caso você precise reinstalar as dependências após uma atualização. Ele deve ser executado no Windows; os comandos manuais acima permitem entender e verificar cada etapa.

### Chat e telemedicina

Escolha **Sou profissional de saúde** na janela normal e **Sou paciente** em uma janela anônima. Use uma consulta de **João Silva** confirmada ou em atendimento; os demais pacientes de exemplo não possuem login próprio. O médico cria a sala, e ambos autorizam câmera e microfone no navegador.

Consultas canceladas ou concluídas não abrem novas salas. As salas vinculadas são encerradas ao cancelar ou concluir o atendimento. Ao sair da chamada, câmera e microfone são liberados.

Para testar câmera e microfone no mesmo computador, use `localhost`. O WebRTC utiliza STUN público; chamadas entre redes diferentes podem exigir TURN e HTTPS. Não foi validada uma chamada audiovisual real entre dois dispositivos nesta revisão.

### Conferir a interface no celular

Com notebook e celular na mesma rede de confiança, utilize `npm.cmd run dev` na raiz. O Vite recebe conexões na rede local e encaminha API e Socket.IO ao backend. No PowerShell, use `ipconfig` para identificar o IPv4 da conexão ativa do notebook. No navegador do celular, abra `http://IP_DO_NOTEBOOK:5173`, substituindo `IP_DO_NOTEBOOK` pelo endereço encontrado. Se houver bloqueio, confira as regras locais de rede/firewall com o responsável pelo dispositivo, sem desativar proteções. O teste depende da rede permitir conexão entre dispositivos.

Esse acesso permite conferir navegação, agendamento e mensagens com dados fictícios. Em HTTP por IP, o navegador pode bloquear câmera e microfone; para chamadas fora de `localhost`, é necessário um contexto seguro com HTTPS. O desenvolvimento não é uma publicação na internet.

### Testes

Na raiz, execute:

```powershell
npm.cmd --prefix backend test
```

Os testes de integração cobrem cadastro e validações, restrição de papel nas rotas médicas adicionadas, conflitos de agenda, reagendamento, cancelamento, início e conclusão, registro obrigatório, bloqueio de edição após conclusão e persistência após reiniciar.

Os testes usam APIs nas portas **3198** e **3199**, arquivos temporários e encerram os processos ao terminar; não altera o arquivo de dados da demonstração. As duas portas devem estar livres durante os testes. O fluxo do paciente também verifica duas confirmações concorrentes para a mesma vaga, proteção das consultas de outros pacientes, avisos da fila, persistência e abertura de um arquivo da v0.5 sem o campo de fila.

O frontend não possui um script de testes automatizados. Utilize `npm.cmd --prefix frontend run build` para verificar a compilação e siga o roteiro de instalação para a conferência manual das telas. Os resultados anteriores e os limites da validação estão em [VALIDACAO.md](VALIDACAO.md).

### Solução de problemas

| Sintoma | O que verificar |
| --- | --- |
| `git` ou `node` não reconhecido | Instale o pré-requisito e reabra o terminal para atualizar o PATH. |
| `npm.ps1` bloqueado no PowerShell | Use `npm.cmd`, como nos exemplos; não é necessário mudar a política de execução. |
| `ENOENT` ou `package.json` não encontrado | Entre na raiz `MediSync` e utilize o `--prefix` correto. |
| Erro durante `npm ci` | Confira a conexão, a versão do Node.js e a mensagem exibida. Mantenha os arquivos de lock do clone. |
| `EADDRINUSE` ou porta ocupada | Encerre a instância anterior do MediSync ou o programa que ocupa a porta e execute novamente. |
| Interface abre, mas não entra ou não carrega dados | Confira se a API está ativa em `http://localhost:3000/api/health` e se o proxy de `frontend/vite.config.ts` corresponde à porta usada. Reinicie o Vite após mudar o proxy. |
| Arquivo de dados incompleto ou inválido | Pare o backend e restaure um backup válido. Para recriar somente a demonstração, renomeie a pasta `data` preservando a cópia. |
| Erro ao salvar dados | Confira espaço disponível e permissão de escrita na pasta do arquivo JSON. |
| Câmera/microfone não disponíveis | Confira as permissões do navegador e use `localhost` no teste local. Não há garantia de chamadas entre todas as redes. |

## Build para produção

Com as dependências já instaladas, na raiz:

```powershell
npm.cmd --prefix frontend run build
```

O comando executa a verificação TypeScript e gera os arquivos estáticos em **`frontend/dist`**. O resultado esperado é a compilação terminar sem erros e listar os arquivos gerados.

### Testar a versão de produção localmente

Para conferir o build, mantenha o backend ativo e execute, em outro terminal na raiz:

```powershell
npm.cmd --prefix frontend run preview -- --host localhost --port 4173 --strictPort
```

Acesse **[http://localhost:4173](http://localhost:4173)**. A prévia serve o último conteúdo de `dist`: após alterar o frontend, execute o build novamente.

Em uma futura hospedagem, o servidor deverá encaminhar `/api` e `/socket.io` ao backend, incluindo WebSocket. Esses proxies do Vite servem apenas para desenvolvimento e prévia local. Não basta enviar a pasta `dist` a uma hospedagem estática isolada.

O backend é JavaScript executado diretamente com Node.js; **não possui script de build**. O servidor `preview` é uma ferramenta de verificação local, não uma configuração de implantação em produção.

## Aplicação publicada

Esta versão está disponível para **execução local**, nos endereços informados acima. Não há uma URL de aplicação hospedada documentada no repositório; a publicação da aplicação está prevista como evolução.

O [repositório público](https://github.com/fatecrl-ite004/MediSync) disponibiliza o código-fonte, e a [wiki](https://github.com/fatecrl-ite004/MediSync/wiki) reúne a documentação do projeto.

## Estrutura do projeto

| Caminho | Conteúdo |
| --- | --- |
| [package.json](package.json) e [scripts/dev.mjs](scripts/dev.mjs) | Atalho que inicia frontend e backend juntos. |
| [README.md](README.md) | Apresentação, instalação, execução e build. |
| [backend/package.json](backend/package.json) | Dependências e comandos da API. |
| [backend/server.js](backend/server.js) | API Express, Socket.IO, regras e persistência local. |
| [backend/tests/doctor.test.cjs](backend/tests/doctor.test.cjs) | Teste de integração do fluxo médico. |
| `backend/data/` | Dados gerados localmente; ignorados pelo Git. |
| [frontend/package.json](frontend/package.json) | Dependências e comandos da interface. |
| [frontend/src/App.tsx](frontend/src/App.tsx) | Telas principais, navegação e comunicação com a API. |
| [frontend/src/DoctorWorkspace.tsx](frontend/src/DoctorWorkspace.tsx) | Agenda, pacientes e registros de atendimento. |
| [frontend/src/PatientExperience.tsx](frontend/src/PatientExperience.tsx) | Início do paciente, agendamento, alterações e fila de espera. |
| [frontend/src/patient.css](frontend/src/patient.css) | Layout, leitura e navegação responsiva. |
| [frontend/vite.config.ts](frontend/vite.config.ts) | Proxy da API e do Socket.IO para desenvolvimento e prévia local. |
| [docs/README.md](docs/README.md) | Índice das referências e decisões do projeto. |
| [frontend/src/styles.css](frontend/src/styles.css) | Estilos e adaptações responsivas. |
| [frontend/public/](frontend/public/) | Recursos estáticos da interface. |
| `frontend/dist/` | Arquivos gerados pelo build; ignorados pelo Git. |
| [MER/MER.jpeg](MER/MER.jpeg) | Modelo inicial de dados. |
| [INICIAR-WINDOWS.bat](INICIAR-WINDOWS.bat) | Atalho de execução no Windows. |

## Equipe

A apresentação da P1 identifica os integrantes abaixo. As responsabilidades individuais não estão especificadas na documentação atual e devem ser confirmadas pelo grupo.

| Integrante | Responsabilidade |
| --- | --- |
| Luiz Henrique dos Passos Silva | Divisão individual a confirmar com o grupo. |
| Danilo Almeida Brito | Divisão individual a confirmar com o grupo. |
| Leandro | Divisão individual a confirmar com o grupo. |

## Documentação adicional

Consulte a [Wiki do MediSync](https://github.com/fatecrl-ite004/MediSync/wiki) para conhecer o problema, o público-alvo, a apresentação da P1, as funcionalidades, a arquitetura, o modelo de dados e as próximas etapas.

- [Índice da documentação](docs/README.md): referências, marketing e decisões de experiência.
- [Plano de marketing](docs/PLANO-DE-MARKETING.md): transcrição do material enviado, com original preservado.
- [Decisões da experiência do usuário](docs/EXPERIENCIA-DO-USUARIO.md): fluxos, limites e roteiro de avaliação.
- [Registro de validação](VALIDACAO.md): verificações documentadas do protótipo.
- [Modelo inicial de dados](MER/MER.jpeg): diagrama disponível no repositório.
- [Issues do projeto](https://github.com/fatecrl-ite004/MediSync/issues): dúvidas e relatos de problemas, com passos para reproduzir e sem dados pessoais ou credenciais.

O repositório ainda não define uma licença de uso.
