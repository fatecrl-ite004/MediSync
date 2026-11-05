# Simplificação da experiência no computador

Revisão de 5 de novembro de 2026. Esta etapa reduz as decisões simultâneas e mantém a pessoa concentrada em uma consulta por vez. A base é a versão da main que já contém o fluxo do paciente e o plano de marketing. Não houve mudança nas regras da API, no armazenamento ou no login simulado.

## O que mudou

| Tela | Comportamento desta revisão |
| --- | --- |
| Início do médico | Saudação curta, próximo atendimento e acesso à agenda. Perfil, conversas recentes e painéis numéricos ficam em suas próprias páginas. |
| Menu do PC | Cinco destinos para o médico e quatro para o paciente. Perfil, chamadas, avisos e configurações ficam em Mais opções; avisos e perfil médico também continuam acessíveis pelo cabeçalho. |
| Agenda médica | Visualizações Próximas, Hoje e Histórico. Próximas inclui consultas confirmadas futuras e atendimentos em andamento. Histórico inclui as demais situações, preservando o status real registrado. |
| Linhas de consulta | Horário, pessoa ou serviço, situação e um botão para abrir os detalhes. A lista começa com seis resultados e oferece Ver mais. |
| Detalhes do atendimento | Ação principal conforme o status: iniciar, registrar ou consultar registro. Comunicação, chamada, reagendamento e cancelamento ficam na seção Comunicação e outras opções. |
| Pacientes | Busca e lista compacta. Cadastro e histórico permanecem disponíveis. Dados cadastrais e registros são abertos sob demanda. |
| Início do paciente | Uma consulta em destaque. Os detalhes, contato, alterações e calendário ficam na janela Ver detalhes. |
| Mais opções | Lista de recursos secundários. Leitura, acessibilidade e ajuda ficam em seções expansíveis. |

No mesmo cenário fictício utilizado antes e depois, o início do médico passou de dez botões no conteúdo principal para dois, e de nove itens no menu para cinco. Trata-se de uma comparação dessa tela e desse cenário, não de uma medida de satisfação ou de acessibilidade integral.

O menu mantém rótulos visíveis. A leitura continua confortável: a revisão não depende de diminuir a fonte para acomodar mais conteúdo. As janelas aceitam Escape, mantêm a navegação por Tab e incluem os títulos expansíveis no percurso do teclado. Ao fechar os detalhes, o foco retorna ao botão que os abriu.

## Adicionar uma consulta ao calendário

Nos detalhes de uma consulta futura confirmada, o paciente pode escolher Adicionar ao calendário. O aplicativo prepara um arquivo `.ics` com tipo de consulta, médica, início, fim e instrução de localização. Ele não inclui o histórico clínico nem o nome do paciente.

O horário é escrito em UTC a partir do instante da consulta, preservando a equivalência com o horário de Brasília. A duração utiliza o valor recebido da API, com cinquenta minutos como alternativa para registros anteriores sem esse campo. O arquivo usa o formato iCalendar descrito na [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545), com escapes de texto e divisão de linhas UTF-8.

A pessoa precisa abrir o arquivo no calendário que utiliza. Não há acesso à conta Google, Outlook ou Apple, criação de eventos por integração externa, sincronização ou atualização automática após reagendamento ou cancelamento. Se a consulta mudar, o evento importado precisa ser conferido e atualizado manualmente. O aplicativo informa essa limitação nos detalhes e na ajuda.

## Validação desta etapa

O build passou com TypeScript estrito e Vite. Os dois testes de integração do backend continuam aprovados. Três testes do frontend verificam horário e duração do calendário, identidade do evento, caracteres especiais, linhas UTF-8, rejeição de datas/durações inválidas e identificador inadequado.

No Chromium, foi percorrido o cadastro de um paciente fictício, agendamento médico, início, registro obrigatório, conclusão e leitura do registro encerrado. Também foram conferidos reagendamento do paciente, confirmação de cancelamento com opção de manter, abertura da conversa, retorno à agenda e acesso à fila por Mais opções.

Com um conjunto local temporário de consultas fictícias, foram conferidos o primeiro lote de seis e a expansão para nove consultas do paciente e onze do médico. A busca sem acentos, os filtros de situação e data e a visualização de dias sem consultas foram verificados. O conjunto adicional de consultas foi removido após a conferência, restaurando o arquivo de demonstração anterior ao cenário de lista longa.

As larguras de conteúdo de 320, 390, 768, 1024 e 1280 pixels foram conferidas em um quadro do navegador, sem transbordamento horizontal da agenda inspecionada. Também foram conferidos texto ampliado, contraste e tema noturno em 320 pixels, além da disponibilidade do botão de saída em uma janela de 600 pixels de altura. Não foram usados aparelhos físicos nessa verificação.

O botão de calendário apresentou a mensagem de arquivo preparado, e seu conteúdo foi validado pelos testes. A captura do download não pôde ser confirmada pelo ambiente de navegador gerenciado. A abertura/importação em calendários externos continua pendente de teste no dispositivo.

## Próxima etapa para encerramento

Realizar uma rodada curta com pessoas de diferentes idades: encontrar a próxima consulta, abrir os detalhes, reagendar, desistir de um cancelamento, localizar a fila e aumentar o texto. Registrar pedidos de ajuda e pontos de dúvida. O [roteiro de experiência do usuário](EXPERIENCIA-DO-USUARIO.md) continua sendo a referência para essa avaliação.

Esta revisão melhora a organização do protótipo. Autenticação real, banco definitivo, revisão de proteção de dados, implantação clínica e chamadas entre dispositivos continuam exigindo etapas próprias.
