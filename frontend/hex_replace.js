import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, 'src');

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
  let newContent = content;

  // Replace utility classes
  newContent = newContent.replace(/bg-\[#1e3a8a\]/g, 'bg-emerald-900');
  newContent = newContent.replace(/text-\[#1e3a8a\]/g, 'text-emerald-900');
  newContent = newContent.replace(/border-\[#1e3a8a\]/g, 'border-emerald-900');
  newContent = newContent.replace(/border-t-\[#1e3a8a\]/g, 'border-t-emerald-900');
  newContent = newContent.replace(/border-l-\[#1e3a8a\]/g, 'border-l-emerald-900');
  
  // Replace just the hex code if it exists isolated
  newContent = newContent.replace(/#1e3a8a/g, '#064e3b');

  if (newContent !== content) {
    fs.writeFileSync(filepath, newContent, 'utf-8');
    countFilesModified++;
  }
});

console.log(`Modified ${countFilesModified} additional files for hardcoded hex.`);
