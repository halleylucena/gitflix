/**
 * Protótipo: schema baseado em COMPASSO para chart Nashville sem letra.
 * Acompanha docs/estudo-apis-letras-cifras-nashville.md (seção 9.2).
 *
 * Reproduzir:  npm i chordsheetjs && node docs/spikes/nashville-chart-proto.mjs
 *
 * Prova que o schema representa as convenções reais do NNS (1 número = 1 compasso,
 * split bar, diamante, inversão) e renderiza o mesmo dado em qualquer tom.
 *
 * Nota: ChordSheetJS é usado APENAS para a matemática de acordes. O modelo dele é
 * centrado em letra (ChordLyricsPair) e não representa compasso — ver seção 5.3.
 */
import { Chord } from 'chordsheetjs';

const FIX = { '#5': 'b6', '#1': 'b2' };
const fixEnh = (s) => Object.entries(FIX).reduce((a, [w, r]) => a.replace(w, r), s);

// --- Schema: música = seções -> compassos -> acordes ---
// Regra central do NNS: 1 número = 1 compasso. Vários acordes num compasso = split bar.
const song = {
  title: 'Exemplo Louvor',
  originalKey: 'D',
  time: '4/4',
  sections: [
    { label: 'Intro',   repeat: 2, bars: [['1'], ['4'], ['5'], ['5']] },
    { label: 'Verso',   repeat: 1, bars: [['1'], ['4'], ['5', '6m'], ['1'], ['4'], ['1/3'], ['5'], ['5']] },
    { label: 'Refrão',  repeat: 2, bars: [['6m'], ['4'], ['1'], ['5'], ['6m'], ['4'], ['1', '5'], [{ d: '1', hold: true }]] },
    { label: 'Ponte',   repeat: 1, bars: [['4'], ['b7'], ['1'], ['1']] },
  ],
};

const norm = (c) => (typeof c === 'string' ? { d: c } : c);

/** Renderiza um compasso; split bar recebe sublinhado (convenção NNS). */
function renderBar(bar, toKey) {
  const chords = bar.map(norm).map((c) => {
    let sym = c.d;
    if (toKey) {
      const parsed = Chord.parse(c.d);
      sym = parsed ? parsed.toChordSymbol(toKey).toString() : c.d;
    } else {
      sym = fixEnh(c.d);
    }
    return c.hold ? `<${sym}>` : sym; // <> = diamante (segura o acorde)
  });
  const body = chords.join(' ');
  return { body, split: bar.length > 1 };
}

function renderChart(song, toKey = null) {
  const out = [`${song.title}${toKey ? ` — tom: ${toKey}` : ' — Nashville'}  [${song.time}]`, ''];
  for (const sec of song.sections) {
    out.push(`${sec.label}${sec.repeat > 1 ? ` (${sec.repeat}x)` : ''}`);
    // convenção: agrupar 4 compassos por linha, alinhados
    for (let i = 0; i < sec.bars.length; i += 4) {
      const group = sec.bars.slice(i, i + 4).map((b) => renderBar(b, toKey));
      const cells = group.map((g) => g.body.padEnd(9));
      out.push('  | ' + cells.join('| ') + '|');
      // sublinha os compassos com acorde dividido
      if (group.some((g) => g.split)) {
        out.push('    ' + group.map((g) => (g.split ? '‾'.repeat(g.body.length).padEnd(11) : ' '.repeat(11))).join(''));
      }
    }
    out.push('');
  }
  return out.join('\n');
}

console.log(renderChart(song));
console.log('='.repeat(58) + '\n');
for (const k of ['D', 'G', 'Bb']) console.log(renderChart(song, k) + '\n');

// Sanidade: o chart em Nashville é independente de tom — o mesmo dado gera qualquer tom.
const bars = song.sections.flatMap((s) => s.bars);
const roundtrip = bars.every((b) =>
  b.map(norm).every((c) => {
    const sym = Chord.parse(c.d)?.toChordSymbol('D')?.toString();
    return sym && fixEnh(Chord.parse(sym).toNumeric('D').toString()) === fixEnh(c.d);
  })
);
console.log('roundtrip número -> acorde -> número consistente:', roundtrip);
