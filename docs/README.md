# Documentação do MediSync

Este índice reúne os materiais disponíveis e relaciona a proposta acadêmica ao comportamento atual do protótipo. As referências descrevem intenções do produto; a implementação e a validação indicam o que já pode ser demonstrado.

| Material | Finalidade | Situação |
| --- | --- | --- |
| [README principal](../README.md) | Instalação, execução, configuração e build | Atualizado para os fluxos do paciente |
| [Wiki e apresentação da P1](https://github.com/fatecrl-ite004/MediSync/wiki) | Problema, objetivos, participantes, proposta inicial e arquitetura | Referência da P1; pode conter planos anteriores |
| [Plano de marketing em Markdown](PLANO-DE-MARKETING.md) | Consulta e busca do conteúdo fornecido pelo grupo | Transcrição textual; sem alteração das afirmações originais |
| [Plano de marketing original](Plano-de-Marketing-MediSync.docx) | Preservar o arquivo recebido | Original, sem edição |
| [Experiência do usuário](EXPERIENCIA-DO-USUARIO.md) | Percursos, decisões, alinhamento com marketing e avaliação | Registro desta revisão |
| [Modelo inicial de dados](../MER/MER.jpeg) | Referência conceitual do banco planejado | O protótipo atual usa JSON, sem migrações SQL |
| [Validação](../VALIDACAO.md) | Evidências técnicas e limites dos testes | Atualizado com os cenários do paciente |

## Divergências que o grupo precisa revisar

O plano descreve clínicas particulares de médio porte como público institucional prioritário, mas algumas tabelas ainda citam policlínicas municipais. O item 3.1 também exclui “clínicas particulares” na frase final, contrariando a definição de público na mesma seção. Esta revisão adotou o direcionamento predominante de clínicas particulares para organizar a experiência, sem editar o original nem inventar uma decisão formal do grupo.

As tabelas de indicadores mencionam cadastros de piloto, redução de faltas e ocupação de vagas, enquanto a seção 5.2 propõe demonstrações simuladas sem uso clínico real. Os indicadores de mercado devem continuar como metas ou hipóteses até haver medição autorizada. A comparação com concorrentes no material não foi verificada nesta implementação.

Fila de espera, avisos dentro do aplicativo e agendamento pelo paciente agora têm um fluxo demonstrável. WhatsApp, e-mail externo, recomendações preditivas, múltiplas clínicas, autenticação real e banco definitivo continuam fora da versão atual. O plano não deve ser usado como evidência de funcionalidades ainda ausentes.
