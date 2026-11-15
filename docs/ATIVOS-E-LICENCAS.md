# Inventário de ativos e licenças — 13/11/2026

| Ativo | Origem e decisão | Situação |
| --- | --- | --- |
| `frontend/public/avatar-medica.svg` | Ilustração geométrica criada em código nesta revisão; sem fotografia ou retrato identificável. | Usada localmente, sem rastreamento ou download externo. A licença geral depende da decisão dos titulares do projeto. |
| SVGs de `frontend/src/UiIcon.tsx` | Caminhos geométricos locais preexistentes, sem chamada a biblioteca/CDN de ícones. | Sem licença externa declarada no arquivo; confirmar autoria histórica com a equipe. |
| Duas URLs de fotos Unsplash no perfil | Autorização de imagem e origem individual não confirmadas. | Removidas do seed e neutralizadas na restauração de perfis antigos. Não tratadas como retrato da médica fictícia. |
| Fontes CSS | Pilha de fontes do sistema; não há importação de Google Fonts ou arquivo de fonte. | Sem webfont redistribuída. |
| `MER/MER.jpeg` | Material do projeto preexistente, não carregado pela interface. | Preservado; autoria/licença a confirmar com a equipe. |
| Plano de marketing (DOCX/Markdown) | Material acadêmico preexistente, fora dos recursos carregados pelo aplicativo. | Preservado; verificar autoria/imagens e revisar promessas antes de publicidade. |
| Código do projeto | Trabalho coletivo, sem arquivo LICENSE declarado. | Nenhuma licença MIT ou cessão de direitos foi presumida. Decisão da equipe pendente. |

As dependências npm têm licenças próprias. O lock registra versões exatas; os avisos de licença em `node_modules` devem acompanhar redistribuições quando exigido. React, ReactDOM, Express, cors, Socket.IO e seu cliente, Vite, TypeScript e pacotes transitivos não se tornam propriedade exclusiva do projeto. O inventário técnico de instalação não substitui análise jurídica de autoria ou permissões de materiais de terceiros.

O [inventário de licenças npm](LICENCAS-NPM.md) registra as 155 combinações de pacote e versão instaladas nesta revisão.


## Anexos e documentação reunidos em 15/11/2026

- As 16 capturas em `docs/anexos/capturas-originais` foram fornecidas pelo integrante do projeto em 13/11; representam o protótipo com personagens e dados fictícios.
- As cinco pranchas em `docs/anexos` foram montadas a partir dessas capturas, com apoio de geração de imagem. Sua função é apresentação; não substituem as capturas originais para conferência exata.
- Apresentações, documentos Word e protótipos anteriores foram fornecidos ou produzidos na conversa e preservados em `docs/historico`. A procedência não equivale à concessão de uma licença geral ou confirmação de direitos sobre todos os componentes históricos; o grupo deve confirmar as autorias e permissões antes de redistribuição comercial.
- Credenciais, CNPJ e afirmações em documentos históricos não foram validados; esses materiais não representam dados legais da empresa ou publicidade aprovada. A aplicação e o Markdown revisados em 14/11 são a referência para os limites atuais.
- A cópia da wiki anterior à entrega foi obtida das páginas públicas da equipe em 15/11 e preservada para não perder o histórico. O histórico oficial do sub-repositório da wiki deve continuar preservado ao publicar as novas páginas.
