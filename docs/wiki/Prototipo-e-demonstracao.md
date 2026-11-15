# Protótipo e demonstração

Revisão: 15/11/2026. O próprio código React/Express é o protótipo funcional. Não há uma URL de aplicação hospedada documentada; execute localmente. Use apenas dados fictícios.

## Instalar e executar no PowerShell

Pré-requisitos: Git, **Node.js 24.x** com npm, navegador e portas 3000/5173 livres.

```powershell
git clone https://github.com/fatecrl-ite004/MediSync.git
cd MediSync
npm.cmd --prefix backend ci
npm.cmd --prefix frontend ci
npm.cmd run dev
```

Abra `http://localhost:5173`. O atalho mantém API e interface no mesmo terminal; `Ctrl+C` encerra os processos. No Linux/macOS, use `npm` no lugar de `npm.cmd`.

Nenhum `.env`, credencial, migração ou banco externo é obrigatório. A API escuta em `127.0.0.1:3000`, e o Vite encaminha `/api` e `/socket.io`. Os dados fictícios são criados em `backend/data/medisync.json`, pasta ignorada pelo Git. A API recusa `NODE_ENV=production`.

Para confirmar a API em outro terminal:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health"
```

Resultado esperado: `ok: true`, `version: 0.5.0`. Configurações opcionais, uso por IP no celular, backup dos dados e solução de problemas estão no [README completo](https://github.com/fatecrl-ite004/MediSync/blob/main/README.md).

## Roteiro de apresentação

1. Abra a entrada e escolha **Sou paciente**. Explique que João Silva e a médica são personagens fictícios.
2. Mostre o início, com uma ação principal, a próxima consulta ou o estado vazio.
3. Abra **Agendar consulta**; escolha o tipo, um horário futuro e confira o resumo antes de confirmar.
4. Abra os detalhes em **Consultas**; mostre o reagendamento e a confirmação do cancelamento quando aplicável.
5. Abra **Mensagens** e a fila em **Mais opções**; as notificações ficam dentro do aplicativo.
6. Saia e entre como **Sou profissional de saúde**. Confira a agenda; para um cadastro, use somente `Paciente de teste 1` ou outro número.
7. Inicie um atendimento fictício, salve o resumo antes de concluir e confira a leitura no histórico.
8. Mostre as páginas legais, a ciência de armazenamento necessário, texto maior, tema e alto contraste.
9. Em uma janela anônima, entre como paciente para demonstrar o chat; as salas de chamada são simulações sem câmera/microfone.
10. Reduza a largura do navegador e mostre os quatro destinos na barra inferior. As capturas em [Documentos e anexos](Documentos-e-anexos) registram a versão visual de 13/11.

Datas da agenda são relativas à primeira criação dos dados e podem diferir das capturas. Não insira dados pessoais ou de saúde reais em resumos, mensagens ou feedbacks.

## Testes e build

Na raiz:

```powershell
npm.cmd --prefix backend test
npm.cmd --prefix frontend test
npm.cmd --prefix frontend run build
```

O build verifica TypeScript e gera `frontend/dist`. Para conferir o resultado, mantenha o backend ativo e execute `npm.cmd --prefix frontend run preview -- --host localhost --port 4173 --strictPort`; abra `http://localhost:4173`.

O backend não tem etapa de build. `preview` é uma conferência local; não é implantação em produção. O registro de verificações e suas limitações está em [VALIDACAO.md](https://github.com/fatecrl-ite004/MediSync/blob/main/VALIDACAO.md).
