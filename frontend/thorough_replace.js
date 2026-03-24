import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, 'src');

// A very inclusive regex: catches anything like `shadow-blue-500`, `from-blue-200`, `border-l-blue-600`, etc.
const bluePattern = /\b([a-z0-9:-]+)-blue-(\d+)\b/g;
const indigoPattern = /\b([a-z0-9:-]+)-indigo-(\d+)\b/g;
const cyanPattern = /\b([a-z0-9:-]+)-cyan-(\d+)\b/g;
const purplePattern = /\b([a-z0-9:-]+)-purple-(\d+)\b/g;

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

  // Broad tailwind replacements
  newContent = newContent.replace(bluePattern, '$1-emerald-$2');
  newContent = newContent.replace(indigoPattern, '$1-teal-$2');
  newContent = newContent.replace(cyanPattern, '$1-teal-$2');
  newContent = newContent.replace(purplePattern, '$1-emerald-$2');

  // Hardcoded colors or specific keys
  newContent = newContent.replace(/color:\s*'blue'/g, "color: 'emerald'");
  newContent = newContent.replace(/color:\s*'indigo'/g, "color: 'teal'");
  newContent = newContent.replace(/from-\[#1e3a8a\]/g, 'from-emerald-800');

  // Any remaining generic references
  newContent = newContent.replace(/shadow-blue-/g, 'shadow-emerald-');
  newContent = newContent.replace(/border-blue-/g, 'border-emerald-');
  
  // Custom tweaks for UI
  newContent = newContent.replace(/from-emerald-500 to-teal-600/g, 'from-emerald-600 to-teal-700');

  if (newContent !== content) {
    fs.writeFileSync(filepath, newContent, 'utf-8');
    countFilesModified++;
  }
});

console.log(`Modified ${countFilesModified} additional files for gradients, shadows, and secondary colors.`);
