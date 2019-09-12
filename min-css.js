import { readFileSync, writeFileSync } from 'fs';

const input = readFileSync('build/styles.css', { encoding: "utf-8"});
const output = input.replace(/(\/\*[^]+?\*\/|\s)+/g," ").replace(/^ |([ ;]*)([^\w:*.#% -])([ ;]*)|\*?(:) */g,"$2$4");

writeFileSync('dist/styles.min.css', output, 'utf-8');
