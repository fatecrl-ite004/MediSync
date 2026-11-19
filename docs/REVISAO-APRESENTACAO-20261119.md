# Revisão para a apresentação — 19/11/2026

Base examinada: `6696de7506e5528d89090fe3570e4945ecb56394`, da `main` do repositório oficial. Os 94 arquivos foram conferidos com o conteúdo remoto antes da revisão. A instalação foi feita a partir dos dois arquivos de lock, com Node.js 24.22.3 em Linux.

## Correções pontuais

| Situação | Antes | Com a revisão |
| --- | --- | --- |
| Nova mensagem com a lista de conversas aberta | O aviso chegava, mas a prévia e a ordem da lista não mudavam | O evento chega aos dois perfis mesmo sem abrir a conversa; conversas novas também aparecem |
| Conversa silenciada | A atualização não podia depender de uma notificação de chat | O conteúdo continua atualizando; silenciar preserva apenas a escolha de avisos |
| Sala criada pela médica | O paciente recebia o aviso, mas o botão de entrada não aparecia nos detalhes da consulta | A sala passa a ser associada à consulta na tela do paciente |
| Sala encerrada | O paciente podia continuar dentro da tela de uma sala já encerrada | O encerramento chega aos dois perfis e remove a associação com a sala fechada |
| Regras do chat alteradas pela médica | O paciente conservava uma preferência local diferente da regra efetiva da API | A regra efetiva é devolvida ao paciente e sincronizada durante a sessão |
| Reconexão | A tela podia conservar dados anteriores à interrupção | A conexão reentra no canal do perfil e busca agenda, salas, preferências, avisos e conversas |
| Perfil fictício sem formação e experiência | Duas seções vazias apareciam na página | Seções sem itens ficam ocultas |

O login só abre a área após o carregamento dos dados; a saída limpa os diálogos e as informações mantidas pela interface. A tela de chamadas identifica explicitamente as salas como simuladas. Não foram adicionados pagamentos, autenticação real, captura de mídia ou serviços externos.

## Validação

- Instalação limpa dos dois subprojetos aprovada.
- Build TypeScript/Vite aprovado.
- Quatro testes do backend e seis testes do frontend aprovados.
- Novo teste de integração em tempo real aprovado, usando dois clientes Socket.IO e dados temporários: **11 testes no total**.
- Conferência no navegador: acesso dos dois perfis, agendamento do paciente, mensagem enviada com a lista aberta no outro perfil, entrada na sala pelos detalhes da consulta, encerramento propagado ao paciente e alteração/restauração da disponibilidade do chat.

As verificações são do ambiente de teste. O atalho `.bat`, dispositivos físicos, navegadores diferentes, rede da faculdade e importação do calendário em aplicativo externo não foram validados nesta revisão.

## Conferência antes de apresentar

1. Utilize uma cópia com esta revisão, pare os processos antigos e inicie `npm.cmd run dev` na raiz. Aguarde os servidores; abra `http://localhost:5173`.
2. Use apenas dados fictícios. Abra o perfil médico em uma janela e o paciente em outra janela ou aba.
3. Confirme se há uma consulta futura para João Silva. Caso as datas da instalação antiga já tenham passado, agende uma nova; não é necessário apagar o arquivo de dados.
4. Mostre o agendamento em três etapas, a agenda médica e o registro de atendimento. O resumo deve ser salvo antes de concluir uma consulta.
5. Mostre uma mensagem chegando ao outro perfil. Se demonstrar uma sala, explique antes que ela não transmite áudio ou vídeo.
6. Apresente as páginas legais como documentação do protótipo. Autenticação real, banco multiusuário, operação clínica e conformidade integral continuam pendentes.

Não é necessária troca de framework, atualização de dependências, instalação de PostgreSQL ou preenchimento de um `.env` para a demonstração. A aplicação continua sendo uma web responsiva executada localmente.
