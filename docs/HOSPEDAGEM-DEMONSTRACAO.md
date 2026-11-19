# Demonstração online do MediSync

O OpenRPG funciona em hospedagem estática porque usa arquivos HTML/JS e armazenamento no navegador. O MediSync precisa também de uma API Node.js e Socket.IO. Seu frontend, a API e as mensagens devem compartilhar um endereço hospedado; ativar apenas GitHub Pages não atende esse fluxo.

## Configuração preparada

O arquivo `render.yaml` define **um Web Service no plano Free**, usando a branch `fix/revisao-apresentacao-20261119`. A compilação instala as dependências dos dois subprojetos e gera `frontend/dist`. A execução usa `node scripts/host-demo.cjs`.

O iniciador hospedado serve os arquivos compilados e encaminha `/api` e `/socket.io` à API original, mantida em uma porta interna de loopback. A porta pública utiliza `PORT` e `0.0.0.0`, como exigido pela hospedagem. `RENDER_EXTERNAL_URL` define a origem permitida.

O bloqueio de inicialização da API original com `NODE_ENV=production` permanece intacto. O iniciador executa essa API em modo `demo`, atrás de uma página de acesso por código. O código é exigido tanto para arquivos da interface quanto para HTTP/Socket.IO; somente `/healthz` e a página de acesso são públicos.

`MEDISYNC_DEMO_PASSWORD` deve conter 16 a 256 caracteres. O Blueprint pede ao Render que gere um valor aleatório. Ele fica nas variáveis de ambiente do serviço: não o publique no repositório, na URL ou em capturas de tela. A sessão dura 12 horas e usa cookie assinado, `HttpOnly`, `SameSite=Strict` e `Secure` quando o endereço é HTTPS.

## Publicação pelo navegador

1. Conecte uma conta do Render. A configuração no repositório não cria uma conta nem publica um serviço por si só.
2. Crie um Blueprint para o repositório `fatecrl-ite004/MediSync`, selecionando a branch acima e `render.yaml`. Confira se o serviço mostra o plano **Free**.
3. Aguarde a compilação e a publicação. Use a URL efetivamente retornada pelo Render; não há uma URL reservada antecipadamente.
4. Abra as variáveis de ambiente do serviço e copie o valor gerado de `MEDISYNC_DEMO_PASSWORD` para uso na apresentação.
5. Acesse a URL pelo navegador, informe o código e escolha o perfil de paciente ou médica. Depois da publicação, não é necessário iniciar backend/frontend no seu computador.

O projeto continua sendo um protótipo acadêmico, exclusivamente com dados fictícios e salas simuladas. A página de acesso protege a demonstração compartilhada; não implementa autenticação clínica individual nem converte o projeto em sistema de produção.

## Limitações do plano gratuito

O Render pode suspender o serviço após 15 minutos sem tráfego, e a primeira abertura seguinte pode levar cerca de um minuto. Abra o site antes da apresentação.

O arquivo JSON local **não é permanente nessa hospedagem**: mudanças podem desaparecer em reinicializações, suspensão ou nova publicação. Os dados fictícios iniciais são recriados. Para armazenamento durável, é necessário planejar banco de dados ou disco persistente; essa mudança não faz parte desta demonstração.

## Verificação técnica

Após instalar as dependências e compilar o frontend, `npm run test:hosting` usa dados temporários para conferir o bloqueio sem código, a proteção de arquivos/API/Socket.IO, a sessão, a restrição de origem, uma mensagem entre os dois perfis por polling/WebSocket e o encerramento do processo da API. Nenhum serviço externo é criado pelo teste.

Fontes oficiais: [Blueprints](https://render.com/docs/blueprint-spec), [WebSockets](https://render.com/docs/websocket) e [limitações do plano Free](https://render.com/docs/free).

**Estado desta preparação:** configuração e testes locais prontos; a publicação e a URL dependem da conexão da conta e de um deploy concluído no Render.
