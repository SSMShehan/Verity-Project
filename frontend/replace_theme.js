import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, 'src');

const pattern = /\b(bg|text|border|ring|divide)-blue-(\d+)\b/g;
const patternHover = /\b(hover:bg|hover:text|hover:border|focus:ring|focus:border|active:bg|group-hover:text)-blue-(\d+)\b/g;

let countFilesModified = 0;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(directory).filter(f => f.match(/\.(tsx|ts|jsx|js)$/));

files.forEach(filepath => {
  const content = fs.readFileSync(filepath, 'utf-8');
  let newContent = content.replace(pattern, '$1-emerald-$2');
  newContent = newContent.replace(patternHover, '$1-emerald-$2');
  newContent = newContent.replace(/badge-blue/g, 'badge-sage');

  if (newContent !== content) {
    fs.writeFileSync(filepath, newContent, 'utf-8');
    countFilesModified++;
  }
});

console.log(`Modified ${countFilesModified} files.`);
