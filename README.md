# MediSync

**Sistema de agendamento e comunicação médica — protótipo acadêmico v0.5.**

O MediSync reúne consultas, pacientes, registros de atendimento, mensagens e telemedicina em uma interface web. O foco atual é a rotina do médico; a área do paciente permite demonstrar a comunicação entre os participantes. Projeto desenvolvido no curso de Tecnologia em Sistemas para Internet da FATEC Rubens Lara.

[Documentação e apresentação da P1 na wiki](https://github.com/fatecrl-ite004/MediSync/wiki)

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Obter o projeto](#obter-o-projeto)
- [Instalar as dependências](#instalar-as-dependências)
- [Configuração](#configuração)
- [Executar localmente](#executar-localmente)
- [Build e prévia local](#build-e-prévia-local)
- [Testes](#testes)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Dados locais e backup](#dados-locais-e-backup)
- [Solução de problemas](#solução-de-problemas)
- [Equipe e documentação](#equipe-e-documentação)

## Funcionalidades

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

## Tecnologias

| Parte | Tecnologias e finalidade |
| --- | --- |
| Frontend | React 18, TypeScript 5 e Vite 6 para interface e build. |
| Backend | Node.js e Express 4 para a API HTTP. |
| Tempo real | Socket.IO 4 para mensagens e eventos; WebRTC para chamadas. |
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

## Obter o projeto

Em uma pasta onde você possa criar arquivos, execute:

```powershell
git clone https://github.com/fatecrl-ite004/MediSync.git
cd MediSync
```

A pasta `MediSync` é a **raiz do projeto**: nela ficam este README, `backend` e `frontend`. Os comandos das próximas seções partem dessa pasta, salvo indicação em contrário.

## Instalar as dependências

Na raiz, instale os dois conjuntos de dependências:

```powershell
npm.cmd --prefix backend ci
npm.cmd --prefix frontend ci
```

`npm ci` utiliza os arquivos `package-lock.json` versionados para instalar as versões registradas. Aguarde os dois comandos terminarem sem erro. Eles criam uma pasta `node_modules` em cada aplicação.

Não há `package.json` na raiz: não execute `npm install` ou `npm start` nela sem indicar `--prefix backend` ou `--prefix frontend`.

## Configuração

### Configuração padrão

**Nenhuma variável de ambiente ou arquivo `.env` é obrigatório.** Esta versão não carrega `.env` automaticamente e não exige senha, token, chave de API, migração ou script SQL para iniciar.

| Recurso | Configuração padrão |
| --- | --- |
| API | `http://localhost:3000/api` |
| Socket.IO | `http://localhost:3000` |
| Interface de desenvolvimento | `http://localhost:5173` |
| Prévia do build | `http://localhost:4173` |
| Dados locais | `backend/data/medisync.json` |

A pasta `backend/data` e os dados de exemplo são criados automaticamente na primeira inicialização do backend. Não é necessário criá-los manualmente.

### Variáveis opcionais do backend

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

Se alterar `PORT`, ajuste também as constantes `API` e `SOCKET_URL` em [frontend/src/App.tsx](frontend/src/App.tsx), pois os endereços estão definidos no código. Reinicie os dois servidores após essa alteração. **Não é necessário mudar portas para o fluxo padrão.** Não adicione credenciais ou outros segredos ao repositório.

## Executar localmente

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

1. Clique em **Entrar como Dra. Ana**.
2. Abra **Consultas**, cadastre um paciente fictício e agende uma consulta futura.
3. Inicie o atendimento, salve o resumo e as orientações e conclua a consulta.
4. Confira o histórico do paciente e o retorno do chat à agenda.

### Atalho opcional no Windows

Após clonar, também é possível abrir [INICIAR-WINDOWS.bat](INICIAR-WINDOWS.bat) na pasta principal. Ele instala as dependências quando as pastas `node_modules` ainda não existem e abre os dois terminais. Aguarde a inicialização e acesse a URL exibida pelo Vite.

O atalho não substitui `npm ci` caso você precise reinstalar as dependências após uma atualização. Ele deve ser executado no Windows; os comandos manuais acima permitem entender e verificar cada etapa.

### Chat e telemedicina

Entre como médica na janela normal e como João em uma janela anônima. Use uma consulta de **João Silva** confirmada ou em atendimento; os demais pacientes de exemplo não possuem login próprio. O médico cria a sala, e ambos autorizam câmera e microfone no navegador.

Consultas canceladas ou concluídas não abrem novas salas. As salas vinculadas são encerradas ao cancelar ou concluir o atendimento. Ao sair da chamada, câmera e microfone são liberados.

Para a demonstração local, use o mesmo computador e `localhost`. O WebRTC utiliza STUN público; chamadas entre redes diferentes podem exigir TURN e HTTPS. As instruções locais não configuram acesso por outro computador ou celular, pois a interface usa endereços `localhost` definidos no código.

## Build e prévia local

Com as dependências já instaladas, na raiz:

```powershell
npm.cmd --prefix frontend run build
```

O comando executa a verificação TypeScript e gera os arquivos estáticos em **`frontend/dist`**. O resultado esperado é a compilação terminar sem erros e listar os arquivos gerados.

Para conferir o build, mantenha o backend ativo e execute, em outro terminal na raiz:

```powershell
npm.cmd --prefix frontend run preview -- --host localhost --port 4173 --strictPort
```

Acesse **[http://localhost:4173](http://localhost:4173)**. A prévia serve o último conteúdo de `dist`: após alterar o frontend, execute o build novamente.

O backend é JavaScript executado diretamente com Node.js; **não possui script de build**. O servidor `preview` é uma ferramenta de verificação local, não uma configuração de implantação em produção.

## Testes

Na raiz, execute:

```powershell
npm.cmd --prefix backend test
```

O teste de integração cobre cadastro e validações, restrição de papel nas rotas médicas adicionadas, conflitos de agenda, reagendamento, cancelamento, início e conclusão, registro obrigatório, bloqueio de edição após conclusão e persistência após reiniciar.

Ele inicia uma API na porta **3198**, usa um arquivo temporário e encerra o processo ao terminar; não altera o arquivo de dados da demonstração. A porta 3198 deve estar livre durante esse teste.

O frontend não possui um script de testes automatizados. Utilize `npm.cmd --prefix frontend run build` para verificar a compilação e siga o roteiro de instalação para a conferência manual das telas. Os resultados anteriores e os limites da validação estão em [VALIDACAO.md](VALIDACAO.md).

## Estrutura do repositório

| Caminho | Conteúdo |
| --- | --- |
| [README.md](README.md) | Apresentação, instalação, execução e build. |
| [backend/package.json](backend/package.json) | Dependências e comandos da API. |
| [backend/server.js](backend/server.js) | API Express, Socket.IO, regras e persistência local. |
| [backend/tests/doctor.test.cjs](backend/tests/doctor.test.cjs) | Teste de integração do fluxo médico. |
| `backend/data/` | Dados gerados localmente; ignorados pelo Git. |
| [frontend/package.json](frontend/package.json) | Dependências e comandos da interface. |
| [frontend/src/App.tsx](frontend/src/App.tsx) | Telas principais, navegação e comunicação com a API. |
| [frontend/src/DoctorWorkspace.tsx](frontend/src/DoctorWorkspace.tsx) | Agenda, pacientes e registros de atendimento. |
| [frontend/src/styles.css](frontend/src/styles.css) | Estilos e adaptações responsivas. |
| [frontend/public/](frontend/public/) | Recursos estáticos da interface. |
| `frontend/dist/` | Arquivos gerados pelo build; ignorados pelo Git. |
| [MER/MER.jpeg](MER/MER.jpeg) | Modelo inicial de dados. |
| [INICIAR-WINDOWS.bat](INICIAR-WINDOWS.bat) | Atalho de execução no Windows. |

## Dados locais e backup

Perfil, pacientes, consultas, registros, mensagens e preferências ficam em `backend/data/medisync.json`. Reiniciar o backend preserva esses dados. As consultas de exemplo recebem datas relativas à primeira inicialização; recarregar a página volta ao login simulado.

Para fazer backup, **pare o backend** e copie a pasta `backend/data`. Para começar uma nova demonstração, pare o backend e renomeie essa pasta, preservando a cópia; ao iniciar novamente, os dados iniciais serão recriados. Ao atualizar o projeto, preserve os dados da instalação anterior.

O armazenamento é local, sem criptografia ou banco multiusuário. Não execute várias instâncias do backend sobre o mesmo arquivo. A evolução do projeto inclui autenticação e autorização completas, banco definitivo, auditoria e revisão de proteção de dados.

## Solução de problemas

| Sintoma | O que verificar |
| --- | --- |
| `git` ou `node` não reconhecido | Instale o pré-requisito e reabra o terminal para atualizar o PATH. |
| `npm.ps1` bloqueado no PowerShell | Use `npm.cmd`, como nos exemplos; não é necessário mudar a política de execução. |
| `ENOENT` ou `package.json` não encontrado | Entre na raiz `MediSync` e utilize o `--prefix` correto. |
| Erro durante `npm ci` | Confira a conexão, a versão do Node.js e a mensagem exibida. Mantenha os arquivos de lock do clone. |
| `EADDRINUSE` ou porta ocupada | Encerre a instância anterior do MediSync ou o programa que ocupa a porta e execute novamente. |
| Interface abre, mas não entra ou não carrega dados | Confira se a API está ativa em `http://localhost:3000/api/health` e se os endereços em `App.tsx` correspondem à porta usada. |
| Arquivo de dados incompleto ou inválido | Pare o backend e restaure um backup válido. Para recriar somente a demonstração, renomeie a pasta `data` preservando a cópia. |
| Erro ao salvar dados | Confira espaço disponível e permissão de escrita na pasta do arquivo JSON. |
| Câmera/microfone não disponíveis | Confira as permissões do navegador e use `localhost` no teste local. Não há garantia de chamadas entre todas as redes. |

## Equipe e documentação

Equipe conforme a apresentação da P1: **Luiz Henrique dos Passos Silva, Danilo Almeida Brito e Leandro**.

- [Wiki do MediSync](https://github.com/fatecrl-ite004/MediSync/wiki): problema, público-alvo, proposta, escopo, arquitetura e evolução.
- [Registro de validação](VALIDACAO.md): verificações documentadas do protótipo.
- [Issues do projeto](https://github.com/fatecrl-ite004/MediSync/issues): dúvidas e relatos de problemas, com passos para reproduzir e sem dados pessoais ou credenciais.

O repositório ainda não define uma licença de uso.
