import { ReactNode, useEffect, useRef, useState } from 'react';
import { COOKIE_KEY, NOTICE_VERSION, readStorageNotice, storageNotice } from './privacy';

const links = [
  ['privacidade', 'Privacidade'], ['termos', 'Termos de serviço'],
  ['cookies', 'Cookies e preferências'], ['reembolso', 'Cancelamento e reembolso'],
  ['responsaveis', 'Responsáveis pelo projeto'], ['acessibilidade', 'Acessibilidade']
] as const;
type LegalPage = typeof links[number][0];
function currentPage(): LegalPage | null {
  const value = window.location.hash.replace('#/', '');
  return links.some(([key]) => key === value) ? value as LegalPage : null;
}
function Content({ page }: { page: LegalPage }) {
  if (page === 'privacidade') return <>
    <p>Este aviso descreve a versão acadêmica do MediSync. Não há cadastro de pacientes reais nem serviço de saúde disponível nesta demonstração. Não informe nome real, CPF, endereço, exames, diagnósticos, senhas ou dados de terceiros.</p>
    <h2>Quais informações são utilizadas</h2>
    <ul><li>Perfis e consultas de exemplo: personagens fictícios e horários usados para demonstrar a navegação.</li><li>Cadastro de teste: somente um apelido no formato “Paciente de teste 1”. Nascimento, telefone, e-mail e alergias não são solicitados nesse cadastro.</li><li>Mensagens, registros, denúncias, sugestões e avaliações: os textos de teste enviados ficam no servidor da demonstração. Não são privados entre usuários autenticados; os perfis de demonstração são compartilhados.</li><li>Preferências de leitura, tema, avisos e fila: utilizadas para exibir e testar as funções escolhidas.</li><li>Informações técnicas: ao abrir o aplicativo, o servidor e eventual hospedagem recebem informações de conexão, como endereço IP. A configuração e a retenção de logs da hospedagem dependem do operador e ainda precisam ser inventariadas antes de publicação operacional.</li></ul>
    <h2>Finalidade, armazenamento e compartilhamento</h2>
    <p>Os dados de exemplo servem apenas ao ensino e aos testes do projeto. Alterações são guardadas em arquivo JSON no servidor até a equipe remover ou reiniciar o conjunto de testes. Não há expiração automática desses registros nem exclusão individual autenticada nesta versão. Backups e logs de infraestrutura precisam de regras próprias antes de uso real.</p>
    <p>O navegador guarda somente a ciência deste aviso de armazenamento por até 180 dias. Preferências do aplicativo são guardadas no servidor junto ao perfil de demonstração. Não há Google Analytics, publicidade, pixels ou fotografias externas na versão auditada. Nenhum texto de saúde é enviado a ferramentas de análise. Não há venda de dados implementada.</p>
    <p>Chamadas são simulações: câmera, microfone e conexão de mídia externa estão desativados. A leitura em voz alta, quando escolhida, utiliza o mecanismo de voz do navegador/sistema; o processamento pode depender desse fornecedor. Não utilize textos reais ou sensíveis.</p>
    <h2>Direitos e contato</h2>
    <p>Quando aplicável, a LGPD prevê confirmação e acesso, correção, informações sobre uso e compartilhamento, bloqueio ou eliminação de dados desnecessários, e revogação do consentimento. A eliminação pode ter exceções legais. O aceite de termos não é autorização genérica para tratar dados de saúde.</p>
    <p>O controlador e um canal privado para solicitações ainda não foram cadastrados. Se você inserir informação real por engano, interrompa o uso e procure a equipe responsável pela apresentação do projeto por canal privado. Não publique dados pessoais em issues do GitHub. O protótipo não oferece um canal operacional de direitos: essa é uma pendência que impede seu uso com pacientes reais.</p>
    <h2>Antes de utilizar dados reais</h2>
    <p>É necessário identificar controlador e operadores, publicar contato privado, definir bases legais por finalidade (incluindo as condições do art. 11 para saúde), prazos de retenção, atendimento de direitos, segurança, contratos e resposta a incidentes. Não declaramos conformidade integral com a LGPD.</p>
  </>;
  if (page === 'termos') return <>
    <h2>Uso da demonstração</h2><p>O MediSync é um protótipo acadêmico gratuito para simular organização de consultas e comunicação. Entrar como paciente ou profissional abre personagens de exemplo; isso não verifica identidade, habilitação profissional ou relação médico-paciente.</p>
    <p>Use somente dados fictícios. Não utilize o aplicativo para prestar assistência, diagnosticar, prescrever, guardar prontuários reais, atender emergências ou realizar pagamentos. Agendamentos não representam consultas reais. Chamadas não capturam nem transmitem áudio ou vídeo nesta versão.</p>
    <h2>Limites e conduta</h2><p>Não envie dados pessoais de terceiros, conteúdo ilícito ou arquivos e textos sem autorização. Mensagens de teste podem ser vistas por outras pessoas usando o mesmo perfil. O protótipo pode ser reiniciado e perder dados de exemplo. Não há compromisso de disponibilidade, resposta clínica ou resultados de saúde.</p>
    <h2>Avaliações e perfil profissional</h2><p>Nomes, formações e serviços de demonstração não comprovam credenciais. Avaliações enviadas no fluxo de teste não são depoimentos de pacientes reais nem prova de qualidade profissional. Não as utilize como publicidade.</p>
    <h2>Conteúdo e direitos</h2><p>O código e as dependências mantêm seus respectivos direitos e licenças. A publicação do repositório não concede, por si só, licença sobre todo o conteúdo. Não há licença geral de reutilização declarada pela equipe; pedidos devem ser tratados com os titulares. As imagens atuais de interface são ilustrações locais, sem retratos de pacientes ou profissionais reais.</p>
    <h2>Responsabilidade e alterações</h2><p>Estes termos não afastam direitos legalmente assegurados nem autorizam tratamento de dados reais. Mudanças na operação, cobrança ou tratamento de dados exigem revisão destes documentos e comunicação adequada. A versão atual não constitui contrato de serviço de saúde.</p>
  </>;
  if (page === 'reembolso') return <>
    <h2>Demonstração sem cobrança</h2><p>Esta versão não vende serviços, não processa pagamentos e não solicita cartão, Pix ou dados bancários. Não existe valor cobrado pelo aplicativo a reembolsar. Não pague a terceiros em nome desta demonstração.</p>
    <h2>Cancelar um agendamento de teste</h2><p>Em Consultas, abra Ver detalhes, depois Não vou conseguir comparecer e confirme o cancelamento. Você também pode manter ou reagendar antes de confirmar. A operação altera somente o agendamento fictício e não gera multa.</p>
    <h2>Se houver cobrança externa</h2><p>Uma cobrança fora deste aplicativo precisa ser verificada com o fornecedor e o responsável pela cobrança, por canal privado. Não envie comprovantes, dados bancários ou documentos no GitHub.</p>
    <h2>Antes de oferecer serviços pagos</h2><p>A equipe deverá definir e publicar identificação do fornecedor, preços, canais de atendimento, condições de cancelamento e procedimento de estorno. Direitos legais do consumidor, inclusive o direito de arrependimento quando aplicável, devem ser preservados; nenhuma regra de “não reembolsável” é estabelecida por este protótipo.</p>
  </>;
  if (page === 'responsaveis') return <>
    <h2>Identificação disponível</h2><dl><dt>Projeto</dt><dd>MediSync — demonstração acadêmica.</dd><dt>Repositório de desenvolvimento</dt><dd><a href="https://github.com/fatecrl-ite004/MediSync" rel="noreferrer">fatecrl-ite004/MediSync</a> — somente assuntos técnicos sem dados pessoais.</dd><dt>Fornecedor / controlador</dt><dd>Identificação jurídica não fornecida à revisão.</dd><dt>Razão social, CNPJ e endereço comercial</dt><dd>Não cadastrados. Nenhum dado empresarial foi inventado.</dd><dt>Contato privado de atendimento e privacidade</dt><dd>Pendente de definição pela equipe.</dd></dl>
    <p>O nome do repositório não identifica automaticamente uma empresa, um controlador ou uma instituição responsável pelo tratamento. A operação comercial e o uso com pacientes reais permanecem fora do escopo desta demonstração.</p>
  </>;
  if (page === 'acessibilidade') return <>
    <p>O projeto busca facilitar o uso com teclado, telas menores e ajustes de leitura. A revisão técnica usa critérios WCAG 2.2 nível AA como referência; não é certificação integral de acessibilidade.</p>
    <h2>Recursos disponíveis</h2><ul><li>Tecla Tab para avançar e Shift+Tab para voltar entre controles; Enter ou Espaço para ativar botões.</li><li>Escape fecha os modais; o foco retorna ao controle que os abriu.</li><li>Link “Pular para o conteúdo”, rótulos de formulário e indicação visível de foco.</li><li>Em Mais opções: texto maior, alto contraste e tema noturno.</li><li>Ilustrações decorativas usam alternativa vazia para evitar repetição; imagens informativas recebem descrição.</li></ul>
    <h2>Limites conhecidos</h2><p>Leitores de tela, zoom de 200%/400%, diferentes navegadores e dispositivos físicos ainda precisam de avaliação completa com participantes. Se encontrar uma barreira, informe à equipe o fluxo e o dispositivo, sem enviar dados pessoais ou de saúde em canais públicos.</p>
  </>;
  return <>
    <h2>Armazenamento necessário</h2><p>Não utilizamos cookies de análise, publicidade ou rastreamento nesta versão. Não há categorias opcionais para aceitar. Continuar sem rastreadores não impede o uso do aplicativo.</p>
    <div className="legal-table-wrap"><table><caption>Inventário do navegador</caption><thead><tr><th>Item</th><th>Finalidade</th><th>Duração</th></tr></thead><tbody><tr><td>{COOKIE_KEY} (localStorage)</td><td>Lembrar a ciência deste aviso, sua versão e data. Sem identificador de visitante.</td><td>Até 180 dias; expirado é ignorado na próxima leitura.</td></tr><tr><td>Conexão Socket.IO</td><td>Atualizações de teste e mensagens em tempo real no mesmo servidor; não é um cookie de marketing.</td><td>Enquanto a conexão estiver aberta.</td></tr></tbody></table></div>
    <h2>Escolhas e futuras mudanças</h2><p>Você pode apagar a ciência deste aviso abaixo ou limpar o armazenamento do site no navegador. Isso não apaga os registros de teste guardados no servidor. Se Analytics ou outros rastreadores forem adicionados no futuro, deverão permanecer bloqueados até uma decisão específica, com rejeição e revogação fáceis. Este aviso não autoriza rastreadores futuros.</p>
  </>;
}
export function LegalShell({ children }: { children: ReactNode }) {
  const [page, setPage] = useState(currentPage);
  const [ack, setAck] = useState(() => { try { return readStorageNotice(localStorage.getItem(COOKIE_KEY)); } catch { return false; } });
  const [message, setMessage] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const previousTitle = useRef(document.title);
  useEffect(() => { const change = () => { setPage(currentPage()); setMessage(''); }; window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change); }, []);
  useEffect(() => {
    document.title = page ? `${links.find(([key]) => key === page)?.[1]} | MediSync` : previousTitle.current;
    if (page) { window.scrollTo(0, 0); heading.current?.focus(); }
    else { const dialog = document.querySelector<HTMLElement>('[role=dialog] button'); if (dialog?.getClientRects().length) dialog.focus(); else document.querySelector<HTMLElement>('.content-wrap h1, .login-card h1')?.focus(); }
  }, [page]);
  function acknowledge() {
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify(storageNotice())); setAck(true); setMessage('Somente armazenamento necessário. Nenhum rastreador foi autorizado.'); }
    catch { setAck(true); setMessage('Preferência válida só nesta página: o navegador bloqueou o armazenamento.'); }
  }
  return <>
    <div hidden={!!page}>
      <p className="demo-safety-note">Demonstração acadêmica · Use apenas dados fictícios · Sem atendimento médico real.</p>
      {children}
    </div>
    {page && <main className="legal-page" id="legal-content"><a className="patient-link" href="#/">← Voltar ao aplicativo</a><header><span className="eyebrow">MediSync · Transparência</span><h1 tabIndex={-1} ref={heading}>{links.find(([key]) => key === page)?.[1]}</h1><p>Versão {NOTICE_VERSION} · Aplicável à demonstração acadêmica.</p></header><Content page={page} />{page === 'cookies' && <div className="actions"><button className="btn" onClick={acknowledge}>Continuar apenas com o necessário</button><button className="btn" onClick={() => { try { localStorage.removeItem(COOKIE_KEY); setAck(false); setMessage('Ciência do aviso apagada deste navegador.'); } catch { setMessage('Não foi possível alterar o armazenamento. Use as configurações do navegador.'); } }}>Apagar ciência deste aviso</button></div>}</main>}
    <footer className={`legal-footer ${page ? 'legal-standalone' : ''}`}><p>MediSync · Demonstração acadêmica com dados fictícios.</p><nav aria-label="Informações legais">{links.map(([key, label]) => <a href={`#/${key}`} key={key} aria-current={page === key ? 'page' : undefined}>{label}</a>)}</nav></footer>
    {!ack && <section className="storage-notice" aria-label="Aviso de armazenamento"><h2>Sem cookies de rastreamento</h2><p>Usamos apenas armazenamento necessário para lembrar este aviso. Sem Google Analytics ou publicidade. Sua escolha não autoriza rastreadores futuros.</p><div className="actions"><button className="btn" onClick={acknowledge}>Somente necessários</button><a className="btn" href="#/cookies">Ver detalhes e preferências</a></div></section>}
    {message && <p className="legal-status" role="status">{message}</p>}
  </>;
}
