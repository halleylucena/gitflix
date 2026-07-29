/**
 * Spike de validação: conversão Nashville Number System com ChordSheetJS.
 * Acompanha docs/estudo-apis-letras-cifras-nashville.md (seção 5).
 *
 * Reproduzir:  npm i chordsheetjs && node docs/spikes/nashville-spike.mjs
 *
 * Objetivo: provar que a feature central do app (acorde <-> número, em qualquer
 * tom, preservando alinhamento com a letra) funciona — e documentar onde falha.
 */
import { Chord, ChordProParser, TextFormatter } from 'chordsheetjs';

// ChordSheetJS grafa b6 como #5 e b2 como #1. Músico de louvor espera bemol.
const FIX_ENHARMONIC = { '#5': 'b6', '#1': 'b2' };

export function toNashville(chordStr, key) {
  const chord = Chord.parse(chordStr);
  if (!chord) return chordStr; // texto solto (N.C., riff) passa direto
  let out = chord.toNumeric(key).toString();
  for (const [wrong, right] of Object.entries(FIX_ENHARMONIC)) {
    out = out.replace(wrong, right);
  }
  return out;
}

/** Reescreve os acordes de uma música mantendo o alinhamento com a letra. */
function mapChords(song, fn) {
  return song.mapItems((item) => {
    if (!item.chords) return item;
    const next = fn(item.chords);
    return next ? item.set({ chords: next }) : item;
  });
}

const source = `{title: Grande é o Senhor}
{key: D}
[D]Grande é o Se[G]nhor e mui[A]to digno de lou[Bm]vor
Na ci[G]dade do nosso [A]Deus, Seu santo [D]monte`;

const song = new ChordProParser().parse(source);
const text = new TextFormatter();

console.log('=== 1. Original (tom de %s) ===\n%s', song.key, text.format(song));

const nns = mapChords(song, (c) => toNashville(c, song.key));
console.log('\n=== 2. Nashville ===\n%s', text.format(nns));

// A partir dos números, renderiza em qualquer tom — sem transposição encadeada.
for (const target of ['G', 'A', 'Bb']) {
  const rendered = mapChords(nns, (n) => Chord.parse(n)?.toChordSymbol(target)?.toString());
  console.log('\n=== 3. Re-renderizado em %s ===\n%s', target, text.format(rendered));
}

console.log('\n=== 4. Armadilhas conhecidas ===');
console.log('  Ab em C   ->', toNashville('Ab', 'C'), '(sem a correção: #5)');
console.log('  Db em C   ->', toNashville('Db', 'C'), '(sem a correção: #1)');
console.log('  Asus4 em D->', toNashville('Asus4', 'D'), '<- qualidade sus normalizada, perde o "4"');
console.log('  D em Bm   ->', toNashville('D', 'Bm'), '<- ATENÇÃO: numera pela relativa MAIOR, não pela tônica menor');
