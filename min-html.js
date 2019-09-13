import { readFileSync, writeFileSync } from 'fs';

const input = readFileSync('build/index.html', { encoding: "utf-8"});
const output = input.replace(/(<!--[^]+?->|\s)+/g," ").replace(/ (?=<|$)|<\/[tl].>|<.p> *(<[p/])| ?\/?(>)/gi,"$1$2");

writeFileSync('dist/index.html', output, 'utf-8');
