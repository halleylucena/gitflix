# Estudo de APIs — Letras e Cifras para App de Música Cristã (formato Nashville)

> Pesquisa realizada em julho/2026 para embasar um app React Native de letras + cifras
> de músicas cristãs, com acordes exibidos no **Nashville Number System (NNS)**.

---

## 1. Resumo executivo

Três conclusões que definem o projeto:

**1. Não existe API que entregue "cifra cristã em Nashville" pronta.** Nenhum provedor
público ou privado expõe isso. O NNS não é um dado que você busca — é uma **transformação**
que você aplica sobre acordes + tonalidade. Isso é boa notícia: a conversão é resolvida e
já validei que funciona (seção 5).

**2. O gargalo do projeto é jurídico, não técnico.** Letra de música é obra protegida.
As APIs "gratuitas" de letras ou (a) não entregam a letra, (b) entregam 30% dela, ou
(c) entregam mas transferem o risco para você. No universo cristão, o portão de entrada
é a **CCLI** — e ela é fechada por parceria.

**3. O caminho realista é catálogo próprio + conversão própria.** APIs de terceiros
servem para *metadados* e *descoberta*; o acervo de cifras precisa ser seu (curado ou
colaborativo), em ChordPro. Detalho na seção 6.

**Recomendação (revisada — ver seção 9):** escopo inicial **sem letra**, focado em
instrumentistas, servindo **apenas chart em Nashville**. Isso remove a maior parte do
risco autoral e, por consequência, remove a necessidade de scraping: o dado fica tão
pequeno que transcrever é mais barato que raspar. Acervo próprio, schema por compasso,
ChordSheetJS **só para a matemática de acordes**. CCLI/PraiseCharts viram meta de
médio prazo (parceria), não dependência de lançamento.

---

## 2. A restrição central: ninguém serve Nashville

O Nashville Number System representa acordes como **graus da escala** relativos à
tonalidade — `1 4 5 6m` em vez de `D G A Bm`. É o padrão de fato em bandas de louvor
porque o mesmo chart serve qualquer tom e qualquer cantor.

Consequência arquitetural: você precisa de duas coisas de qualquer fonte de dados:

| Dado necessário | Por quê |
|---|---|
| Acordes com posição no texto | Sem alinhamento acorde↔sílaba não há chart útil |
| **Tonalidade original** | Sem o tom, `D` não pode virar número. É o campo crítico |

Muitas fontes (especialmente scrapers) trazem acordes mas **omitem ou erram o tom**.
Sem `key`, o NNS é impossível. Ao avaliar qualquer fonte, essa é a primeira pergunta.

Validação de mercado: o **ChartBuilder da MultiTracks** já oferece exibição em
`Chords, Numbers, Numerals, ou Do-Re-Mi` — ou seja, a demanda por NNS é real e provada,
e há concorrente estabelecido. Seu diferencial não pode ser só "tem Nashville".

---

## 3. A camada jurídica (leia antes de escolher a API)

Isto não é rodapé — é o que decide o que você pode lançar.

### 3.1 Letras
Letras são copyright de compositores/editoras. É por isso que os planos completos são
pagos: a API precisa repassar royalties. Pontos concretos:

- **Genius não retorna letras pela API.** Os clientes que "funcionam" fazem scraping do
  HTML. Os termos do Genius proíbem uso comercial sem consentimento escrito.
- **Genius × Google:** o Genius *perdeu* a ação de scraping — mas por questão processual
  (não conseguiu provar vínculo contratual), não porque scraping seja livre. Não leia
  isso como permissão.
- **Vagalume** é explícito: usar a API **não transfere o direito de uso das letras**,
  que devem ser obtidos com os titulares. A API é grátis, o conteúdo não é livre.

### 3.2 O fator CCLI (específico do nicho cristão)
No mundo de louvor, a **CCLI** (Christian Copyright Licensing International) licencia
reprodução de letras/cifras para igrejas. Implicações para um app:

- Quem **exibe letras** de repertório protegido precisa de cobertura de licença.
- Ao reproduzir uma música, exige-se **título, crédito do compositor e aviso de copyright**.
- A licença **proíbe alterar letra, melodia ou o caráter fundamental** da música.
  ⚠️ Isso merece atenção no seu caso: **transpor** e **converter para Nashville** são
  operações que a própria CCLI oferece no SongSelect (charts transponíveis), então
  transposição é claramente aceita. Mas confirme o enquadramento do NNS na parceria —
  não presuma.
- O modelo usual de app: o **usuário** informa a licença CCLI da igreja dele, e o app
  atua como ferramenta. Isso desloca a obrigação, mas não elimina a sua.

> **Não sou advogado e isto não é parecer jurídico.** Antes de monetizar, converse com
> alguém especializado em direito autoral musical no Brasil (e considere ECAD/ABRAMUS
> para o contexto local).

### 3.3 Zona segura para lançar
Conteúdo em **domínio público** — hinários clássicos (Harpa Cristã, Cantor Cristão,
hinos tradicionais) — é livre de royalties e resolve o problema de "catálogo vazio no
lançamento". Estratégia recomendada para o MVP.

---

## 4. Catálogo de APIs avaliadas

### 4.1 Letras

| API | Acesso | Letra completa? | Sincronizada | Adequação cristã/PT-BR | Veredito |
|---|---|---|---|---|---|
| **LRCLIB** | Livre, sem key | ✅ Sim | ✅ Sim (LRC) | ⚠️ Fraca — foco em mainstream | **Melhor opção grátis** |
| **Musixmatch** | Key grátis / pago | ❌ ~30% no grátis | ✅ (plano pago) | 🟡 Média | Bom, mas pago p/ produção |
| **Genius** | Token grátis | ❌ **API não dá letra** | ❌ | 🟡 Média | Só metadados |
| **Vagalume** | Key grátis | ✅ Sim | ❌ | ✅ **Boa — PT-BR forte** | Ótimo p/ Brasil |

**LRCLIB** — o achado mais útil do lado grátis. Sem autenticação, sem custo, criado para
players FOSS. Busca por `artist_name` + `track_name` (e opcionalmente álbum/duração).
Ressalvas: a API pública é **limitada a ~1 request/30s**, o que praticamente **obriga
cache no seu backend**; e o acervo é alimentado pela comunidade de players de música,
então gospel brasileiro e louvor congregacional têm cobertura irregular. **Não tem acordes.**

**Vagalume** — a melhor opção para repertório brasileiro. API gratuita, key obrigatória
desde 2015, retorna letras e traduções, tem busca/ranking/discografia. Exige exibir
**logo e link do Vagalume**. O site tem cifras, mas a API documenta **letras**, não cifras
— confirme com eles se cifra é exposta antes de contar com isso.

**Musixmatch** — o mais "profissional" e licenciado, com sincronização. Mas o tier grátis
entrega preview (~30%), inútil para o produto final. Preço de plano comercial não é
público: precisa falar com vendas. *(Não consegui confirmar valores — a rede desta
sessão bloqueou o acesso; trate como "a apurar".)*

**Genius** — vale registrar o mal-entendido comum: **a API não serve letras**. Serve
metadados, artistas, anotações. Todo tutorial que "pega letra do Genius" está fazendo
scraping, contra os termos. Descarte para letras.

### 4.2 Acordes / Cifras

| Fonte | Tipo | Traz cifra de música? | Traz tonalidade? | Veredito |
|---|---|---|---|---|
| **Songsterr** | REST JSON | ✅ Progressões/tabs | 🟡 Parcial | Uso não-comercial livre; **comercial exige licença** |
| **Uberchord** | REST | ❌ Só diagramas | n/a | Útil p/ diagramas, não p/ repertório |
| **Scales-Chords** | Widget/API | ❌ Só diagramas | n/a | Diagramas violão/piano, sem ativação |
| **Chords API** (chords.alday.dev) | REST | ❌ Teoria/estrutura | n/a | Educacional |
| **Hooktheory** | REST | 🟡 Progressões estatísticas | ✅ Relativo a grau | Interessante: **já é grau, não acorde** |
| **Chordify** | — | — | — | **Sem API pública** (só pedidos de usuários) |
| **Ultimate Guitar** | — | — | — | **Sem API oficial.** Só scrapers → risco |
| **Cifra Club** | — | — | — | **Sem API pública.** Maior acervo gospel BR |
| **OnSong Connect** | API local | ❌ Biblioteca de acordes do device | n/a | Integração com app, não fonte |
| **Open Chord Charts** | REST open source | ✅ Colaborativo | ✅ | Acervo pequeno, mas **modelo replicável** |

**A lacuna crítica:** as duas fontes com acervo real de cifra gospel — **Cifra Club** e
**Ultimate Guitar** — não têm API. Existem scrapers no GitHub para ambas, e é tentador.
**Não recomendo** como base de um produto: viola os termos, quebra a cada mudança de HTML,
e te deixa sem defesa jurídica. Um app com scraper de cifra é um app que não pode crescer.

**Hooktheory** merece nota: por trabalhar com probabilidade de progressões, os dados já
vivem em graus da escala — conceitualmente alinhado ao NNS. Não é fonte de repertório,
mas pode virar feature ("progressões comuns em louvor", sugestão de próximo acorde).

### 4.3 Mundo worship (as fontes que realmente têm o repertório)

| Serviço | Acervo | API | Como entrar |
|---|---|---|---|
| **CCLI SongSelect** | ~260k+ músicas de louvor: letra, cifra, lead sheet, transponível | Existe (`/about/apipartners`) | **Parceria fechada.** Contato direto |
| **PraiseCharts** | Charts, lead sheets, sheet music, áudio | ✅ **Documentada e pública** | OAuth 1.0; `developers@praisecharts.com` |
| **MultiTracks** | Chart Pro / ChartBuilder — **já exibe Numbers e Numerals** | Sem API pública documentada | Integrações são parcerias (ex.: Planning Center) |

**PraiseCharts é a porta mais aberta que encontrei no nicho.** É a única do setor com
portal de desenvolvedor público, spec OpenAPI, contato de dev e regras claras:
autenticação **OAuth 1.0**, rate limit de ~100 req/min por endpoint, paginação e
tratamento de erro documentados. Modelo baseado em conteúdo **comprado** pelo usuário —
combina com um app onde o usuário conecta a conta dele. **É por onde eu começaria a
conversa de parceria.**

**CCLI SongSelect** é o acervo mais completo e a integração mais desejável (é o que
Planning Center, WorshipTools e One Church usam), mas é gated: existe página de "API
Partners" e o caminho é aplicação/contato comercial, não self-service. Trate como
objetivo, não como dependência de MVP.

> Transparência: `songselect.ccli.com/about/apipartners`, `developer.praisecharts.com` e
> `lrclib.net/docs` retornaram **403** para as ferramentas desta sessão (política de rede
> do sandbox / proteção anti-bot). Os detalhes acima vêm de resultados de busca e fontes
> secundárias — **valide nas páginas oficiais** antes de decidir.

### 4.4 Domínio público e dados abertos (o atalho para o MVP)

| Fonte | O que oferece | Formato |
|---|---|---|
| **Hymnary.org** | 1M+ hinos/textos; textos de DP completos | **API JSON** (busca por referência bíblica), export CSV, **dump completo do banco** |
| **Open Hymnal** | Só conteúdo de DP ou livremente distribuível | Arquivos |
| **pdhymns.com** | Hinos de domínio público | Partituras |
| **Worship Leader App DB** | **30k+ músicas, 40 idiomas**, atualização diária | OpenSong / OpenLP / Quelea |

**Hymnary.org é subestimado.** Ter *dump completo do banco* + API por referência bíblica
habilita uma feature muito boa para o público cristão: **buscar música por versículo**
("músicas sobre Salmos 23"). Isso é diferenciação real, e o conteúdo de DP é livre.

O banco do **Worship Leader App** (OpenSong/OpenLP) é o maior conjunto estruturado e
gratuito que encontrei — mas ⚠️ acervo comunitário não significa acervo licenciado.
Muita música moderna ali está protegida, independente de estar no arquivo. Filtre por
domínio público antes de publicar.

---

## 5. A camada Nashville — validada na prática

Aqui está a parte boa: **testei, funciona, e sei onde quebra.**

**Ferramenta: [ChordSheetJS](https://github.com/martijnversluis/ChordSheetJS)** — parsing
de ChordPro/UltimateGuitar/chords-over-words, transposição e — crucialmente —
**suporte nativo a acordes numéricos e numerais**, nas duas direções.

### 5.1 Resultado real (executado nesta pesquisa)

Símbolo → Nashville, na tonalidade de **D**:

```
D    -> numeral: I       numeric: 1
Em   -> numeral: ii      numeric: 2m
F#m  -> numeral: iii     numeric: 3m
G    -> numeral: IV      numeric: 4
A    -> numeral: V       numeric: 5
Bm   -> numeral: vi      numeric: 6m
A/C# -> numeral: V/VII   numeric: 5/7      ← inversões preservadas
Gmaj7-> numeral: IVma7   numeric: 4ma7     ← extensões preservadas
```

E a volta (número → acorde), que é o que permite "toque em qualquer tom":

```
1     -> em D: D      em G: G
2m    -> em D: Em     em G: Am
1/3   -> em D: D/F#   em G: G/B
b7    -> em D: C      em G: F
```

Pipeline completo de folha, também executado:

```
{title: Grande é o Senhor}      D            G         A              Bm
{key: D}                        Grande é o Senhor e muito digno de louvor
[D]Grande é o Se[G]nhor...  →
                                1            4         5              6m
                                Grande é o Senhor e muito digno de louvor
```

...e o mesmo chart re-renderizado em G (`G C D Em`), sem perder o alinhamento das sílabas.
**Essa é a feature central do app, e ela é resolvida.**

### 5.2 Três armadilhas que encontrei (importantes)

**a) Bug de enarmonia em graus bemóis.** Confirmado:

```
Ab em C  -> #5   (deveria ser b6)
Db em C  -> #1   (deveria ser b2)
Bb em D  -> #5   (deveria ser b6)
```

Mas `Eb→b3`, `Bb→b7`, `F#→#4` saem **certos**. Ou seja: o 6º e o 2º grau bemóis vêm
grafados como sustenidos. Músico de louvor lê `b6`, não `#5`. **Precisa de correção
pós-processamento** — mapeie `#5→b6` e `#1→b2`. Tonalidades bemóis diatônicas
(Eb: `1 2m 3m 4 5 6m b7`) saem perfeitas.

**b) Tom menor usa a relativa maior.** `Key.parse('Bm')` é reconhecido como menor, mas:

```
key Bm:  D=1   Bm=6m   A=5   G=4   F#m=3m
```

O `1` virou **D** (relativa maior de Bm), não Bm. Existem as duas convenções no mundo
real — charts de Nashville frequentemente numeram a partir da **tônica menor** (`Bm=1m`).
**Decida a convenção do produto e teste explicitamente**; se quiser tônica menor, desloque
3 semitons. Isso vai gerar bug report se passar batido.

**c) Qualidade `sus` é normalizada.** `Asus4` em D → `5sus` (perde o "4").
Se precisar distinguir sus2/sus4, preserve o sufixo original.

### 5.3 ⚠️ ChordSheetJS é centrado em LETRA — não use como modelo de dados

Descoberta crítica para um app sem letra. Testei representar compassos:

```
Entrada:  | [D] | [G] | [A] [Bm] | [D] |
Classes de item encontradas:  Tag, ChordLyricsPair     ← não existe Bar/Measure
```

O modelo do ChordSheetJS é **`ChordLyricsPair`**: acorde *ancorado a um fragmento de
letra*. As barras de compasso sobrevivem ao roundtrip apenas porque ficam guardadas
**como texto de letra** — não como estrutura. O `TextFormatter` as imprime na linha de
letra, desalinhadas dos acordes.

Consequência: **ao remover a letra, você remove a âncora da biblioteca.** Duração e
compasso — a única pista de tempo que resta num chart sem letra — não são representáveis.

**Portanto:** use ChordSheetJS para a **matemática de acordes** (`Chord.parse`,
`toNumeric`, `toChordSymbol` — validados e excelentes) e **não** para o modelo de dados.
O schema por compasso está na seção 9.2.

### 5.4 Correção de referência

```js
import { Chord } from 'chordsheetjs';

// ChordSheetJS grafa b6 como #5 e b2 como #1 — músico de louvor espera bemol.
const FIX_ENHARMONIC = { '#5': 'b6', '#1': 'b2' };

export function toNashville(chordStr, key) {
  const chord = Chord.parse(chordStr);
  if (!chord) return chordStr;               // texto solto (N.C., riffs) passa direto
  let out = chord.toNumeric(key).toString();
  for (const [wrong, right] of Object.entries(FIX_ENHARMONIC)) {
    out = out.replace(wrong, right);
  }
  return out;
}
```

Bibliotecas alternativas: **`nashville`** (npm, só NNS→acorde) e
**`@praisecharts/chordchartjs`** — este último é fork da PraiseCharts, então
**vale investigar se já resolveu esses casos** para o contexto de louvor.

---

## 6. Arquitetura recomendada

O ponto-chave: **nunca converta para Nashville no cliente a partir de dado de terceiro.**
Guarde ChordPro canônico com `key` explícita; NNS é camada de *apresentação*.

```
┌─────────────────────────────────────────────────────────┐
│  React Native                                           │
│  ChordSheetJS (render) — alterna Acorde / Número /       │
│  Numeral, transpõe, capo. Funciona OFFLINE.             │
└───────────────────────┬─────────────────────────────────┘
                        │  ChordPro + key (formato canônico)
┌───────────────────────┴─────────────────────────────────┐
│  SEU BACKEND  ← camada não-negociável                   │
│  • Acervo próprio em ChordPro (curado/colaborativo)     │
│  • Cache de letras (obrigatório: LRCLIB = 1 req/30s)    │
│  • Normalização de tom + validação                      │
└───────────────────────┬─────────────────────────────────┘
                        │
    ┌───────────────┬───┴────────────┬──────────────────┐
    │ Hymnary.org   │ LRCLIB         │ PraiseCharts     │
    │ (DP, MVP)     │ (letra sync)   │ (parceria, fase 2)│
    └───────────────┴────────────────┴──────────────────┘
```

**Por que backend obrigatório:** (1) o limite de 1 req/30s do LRCLIB torna chamada direta
do app inviável; (2) chaves de API não podem ir no bundle; (3) trocar de fonte não pode
exigir republicar o app; (4) só com acervo próprio você garante que `key` existe — e sem
`key` não há Nashville.

**Por que ChordPro como formato canônico:** é padrão aberto, o ChordSheetJS parseia
nativamente, carrega metadados (`key`, `capo`, `time`), e é interoperável com todo o
ecossistema de louvor (OnSong, OpenLP, OpenSong, Holyrics). Não invente formato próprio.

### Roadmap sugerido (revisado — ver seção 9)

| Fase | Conteúdo | Objetivo |
|---|---|---|
| **1 — MVP** | **Chart NNS sem letra**, transcrito internamente. App para instrumentistas | Risco autoral mínimo, acervo próprio |
| **2 — Acervo** | Contribuição de usuários + curadoria | Crescer sem depender de terceiros |
| **3 — Import** | Usuário importa o que já possui (ChordPro/SongSelect/PraiseCharts) | Ser o renderizador, não a biblioteca |
| **4 — Parceria** | PraiseCharts → depois CCLI | Repertório moderno licenciado; letra só aqui |

---

## 7. Riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| Repertório moderno é inacessível sem parceria | **Alta** | **Alto** | Fase 1 em DP; iniciar conversa com PraiseCharts **já** |
| Tentação de usar scraper (Cifra Club/UG) | Alta | **Alto** | Decidir agora que não. Dívida que inviabiliza escala |
| Fonte sem `key` → NNS impossível | Média | Alto | `key` obrigatória no schema; validar na ingestão |
| Bug de enarmonia (`#5` vs `b6`) chega ao usuário | **Alta se ignorado** | Médio | Correção da seção 5.3 + testes de todos os 12 tons |
| Convenção de tom menor errada | Média | Médio | Definir convenção e testar |
| Rate limit do LRCLIB | Alta sem cache | Médio | Cache no backend desde o início |
| App store rejeitar por copyright (Guideline 5.2.1) | Média | **Alto** | Documentar autorização; DP no lançamento |

O último merece destaque: a **Guideline 5.2.1 da Apple** já foi usada para rejeitar apps
de letras sem autorização documentada. Não é risco teórico.

---

## 8. Próximos passos concretos

1. **Escrever para `developers@praisecharts.com`** — é o contato mais acessível do nicho
   e o ciclo de parceria é longo. Faça isso antes de escrever código.
2. **Baixar o dump do Hymnary.org** e medir quanto do acervo de DP tem cifra utilizável
   (não só texto). Isso define o tamanho real do MVP.
3. **Definir o schema ChordPro canônico**, com `key` obrigatória.
4. **Implementar a camada NNS** com as correções da 5.3 + suíte de testes cobrindo os 12
   tons, maiores e menores. É a feature central: merece cobertura de teste desproporcional.
5. **Validar as páginas bloqueadas** (CCLI API Partners, portal PraiseCharts, docs LRCLIB)
   — 403 nesta sessão, precisam de conferência manual.
6. **Consultar advogado de direito autoral musical** antes de monetizar.

---

## 9. Direção definida: app para instrumentistas, Nashville sem letra

Decisão de escopo tomada após a análise das seções 3 e 8: **sem letra, só chart em
Nashville, busca por música, transposição no app.** Esta seção detalha as consequências.

### 9.1 Por que isso resolve o problema de acervo (e não só o jurídico)

**Retirar a letra retira a maior parte do passivo.** Progressões de acordes são tratadas
como "estoque comum de matéria-prima musical" e largamente não protegidas; letra é
integralmente protegida. Um chart em números, sem letra e sem tom fixo, é essencialmente
**análise harmônica funcional** — a posição mais defensável disponível no produto.

**E o efeito colateral é o mais importante: o dado fica minúsculo.** Uma música inteira
cabe em ~32–40 compassos, algumas dezenas de tokens:

```
Intro   | 1 | 4 | 5 | 5 |
Verso   | 1 | 4 | 5 6m | 1 | 4 | 1/3 | 5 | 5 |
Refrão  | 6m | 4 | 1 | 5 | 6m | 4 | 1 5 | <1> |
```

Um músico competente tira isso de ouvido em poucos minutos. **200 músicas é trabalho de
semanas de uma pessoa, não de um scraper.** A pergunta "vale raspar?" simplesmente
desaparece: transcrever é mais barato, gera dado limpo, com `key` correta (o campo que
scraping mais erra — seção 2), e o acervo passa a ser **ativo próprio**, mostrável a
investidor e compatível com parceria futura.

⚠️ Ressalva honesta: se os números forem *derivados* de scraping, a violação de termos de
uso na **aquisição** continua existindo — some apenas o artefato infringente no produto.
Como transcrever é barato aqui, o incentivo para raspar deixa de exister. E mantenha o
dado **funcional/harmônico**: não derive para transcrição nota-a-nota de arranjo
(voicings específicos, riffs, condução de vozes), porque *voice leading* distintivo
pode ser protegido.

### 9.2 O problema de design que a decisão cria: sem letra, perde-se o tempo

**A letra é o que diz ao músico QUANDO o acorde troca.** Sem ela, `1 4 5 6m` é ambíguo —
o `1` dura quantos compassos? Se o app servir uma lista plana de acordes, **o
instrumentista não consegue usar**. É o problema central do produto.

O NNS real resolve isso com convenções estabelecidas (verificadas):

| Convenção | Notação | Significado |
|---|---|---|
| **Regra central** | `1 número = 1 compasso` | Em 4/4, quatro tempos por número |
| Split bar | sublinhado sob os acordes | 2 ou 4 acordes dividindo um compasso |
| Divisão desigual | hash marks | Acordes com durações diferentes no compasso |
| Diamante | `<1>` | Segura o acorde (nota longa) |
| Menor | `4-` ou `4m` | Sem marcação = maior |
| Dim / Aug | `°` / `+` | |
| Inversão | `1/3` | Baixo alternativo — **o baixista vive disso** |
| Agrupamento | 4 compassos por linha, alinhados | Frase musical |

**Portanto o schema é baseado em COMPASSO, não em lista de acordes.** Retrofitar isso
depois é caro — modele no dia 1.

```js
{
  title: 'Exemplo', originalKey: 'D', time: '4/4',
  sections: [
    { label: 'Intro',  repeat: 2, bars: [['1'], ['4'], ['5'], ['5']] },
    { label: 'Refrão', repeat: 2, bars: [['6m'], ['4'], ['1', '5'], [{ d: '1', hold: true }]] },
  ],
}
```

Um `bar` é uma lista de acordes: um elemento = compasso inteiro; dois ou mais = split bar.
Protótipo executável validando renderização + transposição:
`docs/spikes/nashville-chart-proto.mjs`.

### 9.3 Ganhos de produto (a decisão é foco, não só cautela)

- **Segmento desatendido.** Praticamente todo app de louvor é *lyrics-first* — feito para
  cantor e projeção. A banda (teclado, baixo, guitarra, bateria) recebe um PDF impresso.
- **Offline-first fica trivial.** Com dado desse tamanho, o acervo inteiro cabe em algumas
  centenas de KB. Wi-fi de igreja é notoriamente ruim: isso é vantagem real, não detalhe.
- **Transposição instantânea e local**, sem servidor (validado na seção 5).
- **Sem backend crítico no MVP.** Sem letra, caem LRCLIB, cache e rate limit. O app pode
  nascer com acervo embarcado — muito menos infra para lançar.

### 9.4 Features que interessam ao instrumentista (e são livres de risco)

Nada aqui toca material protegido, e é o que a banda realmente pede:

- Transposição + **capo** por instrumentista (o violão quer o `4` em forma de E).
- **Mapa de seções com repetições** e contagem de compassos — o baterista usa mais isso
  que os acordes.
- **BPM e fórmula de compasso.**
- **Setlist** ordenada do culto, com tom por música (o tom que *aquela* cantora usa).
- Inversões explícitas (`1/3`, `1/5`) — informação de baixo.
- Modo de ensaio vs. modo palco (fonte grande, rolagem travada).

### 9.5 Riscos que mudam com a decisão

| Risco | Antes | Agora |
|---|---|---|
| Infração de letra | **Alto** | **Eliminado** (não há letra) |
| Takedown / App Store 5.2.1 | Alto | **Baixo** |
| Acervo vazio no lançamento | Alto | **Médio** — transcrição interna é factível |
| Chart ambíguo, inútil no palco | não avaliado | **Alto** — mitigar com schema 9.2 |
| Convenção de tom menor (seção 5.2b) | Médio | **Médio** — segue valendo, testar |

O risco dominante deixa de ser jurídico e passa a ser de **qualidade de dado**: um chart
sem letra e sem estrutura de compasso confiável é pior que chart nenhum, porque falha
no palco, ao vivo, sem chance de correção.

## 10. Panorama competitivo: todos são EDITOR, nenhum é CATÁLOGO

Levantamento dos apps de NNS existentes:

| Produto | O que é | Modelo | Preço |
|---|---|---|---|
| **JotChord** | Web app de autoria NNS, sintaxe "ChordText" otimizada para digitação rápida, PDF pronto para impressão, roda em qualquer navegador | **Editor** | **Grátis** |
| **1Chart** | App iPad para escrever charts NNS rápido | **Editor** | Pago |
| **Nashville Numbers** (iOS) | Criar charts "com a facilidade de papel e caneta" | **Editor** | Pago |
| **Chordsheet.com** | Chord sheet maker com suporte a NNS | **Editor** | Freemium |
| **PraiseCharts** | Vende charts (inclui NNS) de músicas específicas | **Catálogo licenciado** | Pago por música |
| **MultiTracks ChartBuilder** | Exibe `Chords / Numbers / Numerals / Do-Re-Mi` | **Catálogo licenciado** | Assinatura |

### A leitura estratégica

**Padrão claro: quem é grátis é editor; quem tem catálogo, licenciou e cobra.**

Nenhum produto independente oferece **busca por música que devolve o chart em Nashville**.
Isso não é acaso — é exatamente a lacuna que a seção 9 identificou: a parte cara
(transcrição) e a parte sensível (repertório de terceiros). Os concorrentes ou evitaram,
ou pagaram para ter (PraiseCharts, MultiTracks).

Duas consequências para o projeto:

1. **Não dá para ganhar no editor.** O JotChord é gratuito, maduro e roda em qualquer
   navegador sem instalar. Construir "mais um editor de NNS" é entrar num mercado
   comoditizado contra um incumbente de preço zero.

2. **O catálogo é o único valor defensável — e é justamente o que os outros não fizeram.**
   A busca que devolve o chart pronto é o diferencial real. Mas é preciso entrar nela com
   os olhos abertos: você estaria assumindo o custo e o risco que o mercado inteiro
   declinou. A seção 9.1 explica por que isso é viável **se** o dado for transcrito
   internamente, sem letra e mantido no nível funcional/harmônico.

O posicionamento que decorre: **não é "um editor de Nashville"; é "o acervo de Nashville
para a banda de louvor, com transposição e offline"**. Editor, se existir, é feature de
apoio para a equipe preencher lacunas — não o produto.

## Fontes

Letras: [LRCLIB](https://lrclib.net) · [LRCLIB no HN](https://news.ycombinator.com/item?id=39480390) · [Musixmatch free tier](https://freeapihub.com/apis/musixmatch) · [Vagalume API](https://api.vagalume.com.br/docs/letras/) · [Vagalume exemplos](https://github.com/vagalume/api-exemplos/blob/master/README.md) · [Music Assistant — lyrics](https://www.music-assistant.io/metadata/lyrics/)

Acordes: [Songsterr API](https://publicapis.io/songsterr-music-api) · [Uberchord](https://api.uberchord.com/) · [Scales-Chords](https://www.scales-chords.com/api/) · [Chords API](https://chords.alday.dev/) · [Hooktheory](https://www.hooktheory.com/api/trends/docs) · [OnSong Connect](https://onsongapp.com/developers/connect/api/chords.php) · [Open Chord Charts](https://github.com/open-chord-charts/web-api) · [Chordify — pedido de API](https://support.chordify.net/hc/en-us/community/posts/360005529718-Share-Chordify-API)

Worship: [CCLI SongSelect](https://songselect.ccli.com/) · [CCLI API Partners](https://songselect.ccli.com/about/apipartners) · [Church Copyright License](https://ccli.com/us/en/church-copyright-license) · [PraiseCharts Developers](https://developer.praisecharts.com/) · [PraiseCharts API docs](https://api.praisecharts.com/docs) · [MultiTracks ChartBuilder](https://www.multitracks.com/products/chartbuilder/)

Domínio público: [Hymnary.org](https://hymnary.org/) · [Hymnary FAQ](https://hymnary.org/faq) · [Open Hymnal](http://openhymnal.org/OpenHymnal2014.06.pdf) · [PD Hymns](https://www.pdhymns.com/) · [Worship Leader App DB](https://worshipleaderapp.com/en/download-song-database-opensong-openlp-and-quelea)

Concorrentes NNS: [JotChord](https://www.jotchord.com/) · [JotChord — worship leaders](https://www.jotchord.com/for-worship-leaders) · [1Chart](https://www.1chartapp.com/about-numbers/) · [Nashville Numbers (App Store)](https://apps.apple.com/us/app/nashville-numbers/id1475438302) · [Chordsheet.com — NNS](https://www.chordsheet.com/manual/nashville-number-system) · [PraiseCharts — NNS para bandas](https://www.praisecharts.com/blog/the-nashville-number-system-chart-for-bands/)

Nashville / libs: [ChordSheetJS](https://github.com/martijnversluis/ChordSheetJS) · [ChordJS](https://github.com/martijnversluis/ChordJS) · [@praisecharts/chordchartjs](https://www.npmjs.com/package/@praisecharts/chordchartjs) · [nashville (npm)](https://github.com/sgoudie/nashville) · [NNS — Wikipedia](https://en.wikipedia.org/wiki/Nashville_Number_System) · [ChordPro](https://en.wikipedia.org/wiki/ChordPro)

Jurídico: [Genius × Google](https://masslawblog.com/contracts/does-genius-have-an-illegal-scraping-case-against-google/) · [Apple Guideline 5.2.1](https://developer.apple.com/forums/thread/132280) · [CCLI: o que é legal](https://www.renewingworshipnc.org/the-ccli-license-what-is-legal-and-what-is-not/) · [Avisos de copyright](https://www.renewingworshipnc.org/how-to-properly-display-copyright-notices-for-ccli-license-holders/)
