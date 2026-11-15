# Revisão de privacidade, acessibilidade e riscos — 14/11/2026

## Resultado e escopo

Revisão do código público do MediSync, a partir da main `5a2620b4f1e5eb6cd8799492a74e92b2565ab6c8`. Abrange frontend React, API Express/Socket.IO, HTML, CSS, dependências, imagens da interface e documentação de execução. Não houve acesso a hospedagem de produção, contas de Analytics/Tag Manager, contratos, logs de infraestrutura ou dados de uma empresa. O repositório não documenta uma aplicação operacional hospedada.

**Não é possível confirmar conformidade integral com a LGPD. A versão continua uma demonstração acadêmica, não habilitada para pacientes reais, atendimento médico ou comércio.** Não confundir páginas legais, consentimento ou bloqueios de demonstração com adequação jurídica e segurança completas. A exceção acadêmica do art. 4º, II, b, também remete aos arts. 7º e 11: “acadêmico” não autoriza indiscriminadamente dados reais de saúde.

## Atendimento dos 18 pedidos

| Pedido | Entrega / resultado | Limite ou próximo passo |
| --- | --- | --- |
| 1. Privacidade | Página pública `/#/privacidade`, finalidades, dados, armazenamento, direitos e limites descritos. | Controlador, operadores, logs e canal privado precisam de dados reais. |
| 2. Termos | Página `/#/termos`, demonstração gratuita, uso permitido, conteúdo, limites e direitos preservados. | Rever antes de qualquer contratação ou serviço de saúde. |
| 3. Cookies | `/#/cookies`, aviso sem bloqueio de uso, ciência versionada por 180 dias e opção de apagar. Nenhuma categoria opcional é habilitada. | Não existe consentimento para Analytics porque não há Analytics. Se instalado futuramente, bloquear até opt-in específico, permitir recusa e revogação, testar rede. |
| 4. Reembolso | `/#/reembolso`, ausência de cobrança, cancelamento fictício sem multa e direitos legais preservados. | Definir fornecedor, oferta, atendimento e estorno antes de cobrar. |
| 5. Formulários | Avisos contextuais, limites no cliente e servidor, rótulos e links de privacidade. Sem checkbox genérico de “aceito LGPD”. | Formulários de texto de teste não detectam automaticamente dados pessoais; uso real é proibido. |
| 6. Minimização | Novo cadastro aceita só apelido padronizado. API rejeita nascimento, contato, alergias e campos extras; preferências aceitam apenas campos e tipos conhecidos. Câmera, microfone, WebRTC e STUN removidos da demonstração. | Dados antigos não são apagados silenciosamente. Instalações existentes devem ser inventariadas por seu responsável. |
| 7. Analytics | Nenhuma integração GA/GTM encontrada nos pontos de entrada, dependências e fonte auditada. | Conta e configuração da eventual hospedagem não acessadas. |
| 8. Tracking | Fotos remotas removidas; nenhum pixel/SDK de anúncio encontrado. Política de conteúdo do build restringe scripts, conexões e imagens à mesma origem. | Scripts inseridos por CDN, hospedagem, extensões ou configurações futuras estão fora do escopo. Voz do sistema/navegador pode depender de fornecedor. |
| 9. Auditoria de acessibilidade | Inspeção técnica de cores, nomes, imagens, formulários, foco, rotas e teclado; referência WCAG 2.2 AA. | Não equivale a certificação. Roteiro e limites abaixo. |
| 10. Alt | Foto informativa do perfil substituída por ilustração local com descrição; avatar redundante junto ao nome mantém `alt=""`. | Novas imagens exigem revisão de finalidade e descrição. |
| 11. Contraste | Cores de texto secundário, bordas, placeholders, status, marca e foco ajustadas para temas claro/escuro/alto contraste. | A checagem de estilos calculados é amostral e não substitui análise de todos os estados. O reflow das páginas legais foi corrigido também para a área consumida pela barra de rolagem em tela estreita. |
| 12. Teclado | Avaliação usa o modal compartilhado (foco inicial, Tab/Shift+Tab, Escape e retorno); foco em títulos legais e retorno ao app; foco visível em horários. | Leitores de tela e dispositivos físicos continuam pendentes. |
| 13. Avaliações falsas | Nenhum depoimento ou nota fictícia pré-carregada encontrado: seed `ratings=[]`. Notas do fluxo de testes agora identificadas como simulação, nunca reputação real. | Não se apagaram avaliações existentes sem identificar sua origem. Autoria real exigiria autenticação. |
| 14. Promessas | Perfil e metadados identificados como simulação; CRM numérico e formações/experiências de exemplo removidos do seed e neutralizados na exibição/restauração; o CRM da simulação não é editável. O CNPJ não confirmado e a alegação sem fonte sobre lembretes foram retirados da transcrição Markdown de marketing. Sem promessa de resultado clínico, segurança absoluta ou “100% LGPD”. | Credenciais em arquivos antigos devem ser verificadas pelo responsável; a interface as identifica como fictícias. Marketing é planejamento, não evidência de implementação. |
| 15. Copyright | Retratos externos de procedência/autorização não confirmadas removidos. Avatar atual é SVG geométrico local; ícones são código SVG local; fonte usa fallback de sistema, sem download de webfont. | Licença geral do projeto, autoria do MER e material antigo de marketing ainda precisam de confirmação pelos titulares. Não foi imposta uma licença MIT a conteúdo alheio. |
| 16. Dados da empresa | `/#/responsaveis` informa projeto, repositório técnico e dados ainda não fornecidos. | Falta razão social/identificação aplicável, CNPJ quando houver, endereço e contato privado. Não foram inventados. |
| 17. Legalidade LGPD | Lacunas técnicas e organizacionais documentadas, sem declaração de conformidade integral. | Revisão jurídica/operacional e evidências do controlador são necessárias para uso real. |
| 18. Outros riscos | Bloqueio de inicialização com NODE_ENV=production; API em loopback; CORS por lista de origens, no-store, nosniff, referrer-policy e permissões de câmera/microfone negadas; atualização de dependências. | Esses controles não substituem autenticação, autorização, segurança de produção, contratos e governança. |

## Inventário de tratamento e armazenamento

| Elemento | Uso nesta demonstração | Local / retenção |
| --- | --- | --- |
| Perfis e consultas sem cadastro real | Ensinar fluxos de agenda | JSON do servidor; até remoção/reinicialização supervisionada, sem TTL automático. |
| Apelido `Paciente de teste 1` | Identificar paciente fictício | JSON; rejeita outros campos no novo cadastro. |
| Registro, mensagem, feedback, denúncia, nota | Testar interação, sem conteúdo real ou sensível | JSON compartilhado por perfis de demonstração; sem autenticação de titular ou exclusão individual segura. |
| Tema, leitura, avisos e fila | Executar preferências da demonstração | JSON por perfil fictício compartilhado. |
| `medisync.necessary-storage.v1` | Versão e ciência do aviso, sem ID de visitante | localStorage; ignorado após 180 dias; pode ser removido na página de cookies. Não é autorização de rastreadores. |
| Socket.IO | Atualizações e mensagens na mesma origem | Conexão enquanto aberta; mensagens persistem no JSON. Não é cookie analítico. |
| IP e metadados HTTP | Comunicação técnica com servidor e hospedagem | Recebimento inerente à conexão; logs, retenção e operadores da hospedagem ainda não auditados. |
| Câmera / microfone / STUN | Nenhum | Captura e sinalização WebRTC removidas. |
| Voz do navegador/sistema | Leitura opcional de texto fictício | Mecanismo do dispositivo; pode utilizar serviço do fornecedor. Não habilitar para textos sensíveis. |

Não há base legal declarada para operar com dados reais de pacientes. Consentimento não é a única base legal e não resolve as lacunas. Antes de uso real, documentar cada finalidade sob os arts. 7º e 11, não usar legítimo interesse como justificativa genérica para dados sensíveis, e identificar compartilhamentos e transferências internacionais. Preferências de cookies são separadas de termos, saúde e mídia.

## Riscos que impedem operação real

1. **Crítico — identidade/autorização:** login sem senha e papéis/IDs de demonstração, inclusive rotas legadas e canais Socket.IO. O cabeçalho X-Demo-Role pode ser forjado. CORS não autentica. NODE_ENV=production bloqueia o backend, mas não torna os outros modos seguros para exposição pública. Não implantar a API em serviço público.
2. **Crítico — saúde e prontuário:** JSON sem criptografia de aplicação, sem trilha de auditoria clínica, sem isolamento multiusuário e sem governança de retenção, backup ou restauração. Registros reais exigem avaliação de requisitos setoriais; não apagar prontuários por uma regra genérica de cookies.
3. **Alto — governança:** falta identificar controlador/operadores, canal privado, procedimento de direitos com verificação de identidade, contratos, controle de acesso, incidente e avaliação de risco/impacto quando cabível. Um formulário de sugestão de demonstração não atende essa necessidade.
4. **Alto — atividade de saúde/publicidade:** não há verificação de CRM/RQE, habilitação, instituição prestadora ou regras para telemedicina. Antes de oferecer atendimento real, validar obrigações profissionais e regulatórias com responsável habilitado. Se futuras funcionalidades diagnosticarem ou recomendarem condutas, avaliar também enquadramento regulatório específico.
5. **Alto — crianças/adolescentes:** não há fluxo de responsável legal nem análise do melhor interesse. Não recolher dados de menores nesta versão.
6. **Alto — operação/infraestrutura:** TLS, logs, retenção técnica, fornecedores, incidentes, rate limiting, autenticação de sockets, monitoramento e resposta a abuso precisam de implantação e testes próprios. A CSP em meta não substitui cabeçalhos de servidor, como frame-ancestors. A política de permissões depende de a hospedagem preservar os cabeçalhos.
7. **Alto — consumo:** antes de cobrar, identificar fornecedor, preço, condições, atendimento e exercício de direitos/arrependimento, sem cláusulas genéricas que os afastem. Não há checkout nesta versão.
8. **Médio — direitos autorais/marca:** obter confirmação de autoria/licenças dos materiais antigos, direito de uso da marca e decisão conjunta sobre a licença do repositório. Preservar avisos de terceiros ao distribuir dependências. Não presumir licença ou autorização de imagem por estar na internet.

## Validação e pendências

Resultados finais de build, testes, dependências e auditoria no navegador são registrados em [VALIDACAO.md](../VALIDACAO.md). Não houve teste com dados reais. O arquivo de dados anterior do usuário não foi alterado ou apagado.

Amostragem de contraste: cálculo WCAG de luminância sobre cores computadas de texto visível e fundo opaco ancestral, limites 4,5:1 (texto normal) / 3:1 (texto grande). Gradientes, opacidade, imagens, estados ocultos e todos os componentes não são certificados por essa amostragem. Para componentes sem texto, conferir bordas, foco e estados com critério de contraste não textual e inspeção visual.

Antes de liberar uso real, além dos riscos acima: testar NVDA/VoiceOver, zoom 200%/400%, todos os estados de erro e carregamento, teclado completo, dispositivos físicos, todos os temas, fluxos completos e rede de produção; implementar e testar as solicitações de titulares por canal privado. A declaração pública de acessibilidade mantém essas limitações.

## Referências oficiais consultadas em 14/11/2026

- [LGPD — texto atualizado, Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html): arts. 4º, 6º, 7º, 8º, 9º, 11, 14, 18, 37, 41 e 46.
- [ANPD — Guia orientativo Cookies e Proteção de Dados Pessoais](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais): necessidade, transparência, escolhas e revogação.
- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/): alternativas textuais, contraste, teclado, foco, nomes e rótulos.
- [Decreto 7.962/2013 — Planalto](https://www2.camara.leg.br/legin/fed/decret/2013/decreto-7962-15-marco-2013-775557-publicacaooriginal-139266-pe.html): identificação do fornecedor, atendimento e arrependimento em comércio eletrônico.
- [Código de Defesa do Consumidor — Planalto](https://www2.camara.leg.br/legin/fed/lei/1990/lei-8078-11-setembro-1990-365086-normaatualizada-pl.html): transparência e direitos quando aplicáveis.

Esta é uma revisão técnica acompanhada de textos para o escopo demonstrativo. A confirmação jurídica depende de operação, documentos e revisão profissional; não pode ser inferida do build aprovado.
